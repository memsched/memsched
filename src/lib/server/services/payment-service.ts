import { wrapResultAsyncFn, DrizzleRecordNotFoundErrorCause } from '$lib/server/db/types';
import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { getPlanLimits } from '$lib/server/subscription';
import type { LocalUser } from '$lib/types';
import { okAsync } from 'neverthrow';
import { FREE_PLAN_LIMITS } from '$lib/constants';

// Custom error types for better error handling
class SubscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubscriptionError';
  }
}

// Initialize Stripe with proper error handling
const initializeStripe = () => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured');
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia', // Latest supported API version
    typescript: true,
    telemetry: false,
  });
};

const stripe = initializeStripe();

export class PaymentService {
  constructor(private readonly db: DBType) {}

  /**
   * Creates a subscription for a user and returns the checkout URL
   */
  public createSubscription(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    return wrapResultAsyncFn(async () => {
      // 1. Validate inputs
      if (!priceId.startsWith('price_')) {
        throw new SubscriptionError('Invalid price ID format');
      }

      // 2. Verify the user exists and get their data
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      const user = users[0];

      // 3. Handle Stripe customer creation/retrieval
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        // Update user with new Stripe customer ID
        await this.db
          .update(table.user)
          .set({ stripeCustomerId: customerId })
          .where(eq(table.user.id, userId));
      }

      // 4. Verify the price exists and is active
      const price = await stripe.prices.retrieve(priceId);
      if (!price.active) {
        throw new SubscriptionError('Selected price is not active');
      }

      // 5. Create checkout session with proper configuration
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: userId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_collection: 'always',
        subscription_data: {
          metadata: {
            userId: userId,
          },
        },
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      });

      return {
        checkoutUrl: session.url || '',
        sessionId: session.id,
      };
    });
  }

  /**
   * Gets the customer portal URL for managing subscriptions
   */
  public getCustomerPortalUrl(userId: string, returnUrl: string) {
    return wrapResultAsyncFn(async () => {
      // 1. Verify the user exists
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      const user = users[0];

      // 2. Check if user has stripeCustomerId
      if (!user.stripeCustomerId) {
        throw new DrizzleRecordNotFoundErrorCause('User does not have a Stripe customer ID');
      }

      // 3. Create a customer portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      return {
        portalUrl: portalSession.url,
        sessionId: portalSession.id,
      };
    });
  }

  /**
   * Gets the subscription status for a user
   */
  public getSubscriptionStatus(userId: string) {
    return wrapResultAsyncFn(async () => {
      // 1. Verify the user exists
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      const user = users[0];

      // If user has a Stripe customer ID, fetch the latest subscription info
      if (user.stripeCustomerId) {
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'all',
            limit: 1,
          });

          if (subscriptions.data.length > 0) {
            const subscription = subscriptions.data[0];

            // Update the database with the latest info
            await this.updateSubscriptionStatus(userId, {
              status: subscription.status,
              planId: subscription.items.data[0]?.price.id,
              periodEnd: subscription.current_period_end,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            });

            // Return fresh data
            return {
              status: subscription.status,
              planId: subscription.items.data[0]?.price.id,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            };
          }
        } catch (error) {
          console.error('Error fetching subscription from Stripe:', error);
          // Continue and return database values
        }
      }

      // Return subscription details from the user record
      return {
        status: user.subscriptionStatus || 'inactive',
        planId: user.stripePlanId || null,
        currentPeriodEnd: user.subscriptionPeriodEnd || null,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd || false,
      };
    });
  }

  public getPlanLimits(user: LocalUser | null) {
    if (!user) {
      return okAsync(FREE_PLAN_LIMITS);
    }
    return this.getSubscriptionStatus(user.id).andThen((subscription) => {
      return okAsync(getPlanLimits(subscription, user.admin ?? false));
    });
  }

  /**
   * Updates a user's subscription status in the database
   */
  public updateSubscriptionStatus(
    userId: string,
    subscriptionData: {
      status: string;
      planId?: string;
      periodEnd?: number;
      cancelAtPeriodEnd?: boolean;
      stripeCustomerId?: string;
    }
  ) {
    return wrapResultAsyncFn(async () => {
      const updateData: Partial<typeof table.user.$inferInsert> = {
        subscriptionStatus: subscriptionData.status,
      };

      if (subscriptionData.planId) {
        updateData.stripePlanId = subscriptionData.planId;
      }

      if (subscriptionData.periodEnd) {
        updateData.subscriptionPeriodEnd = new Date(subscriptionData.periodEnd * 1000);
      }

      if (subscriptionData.cancelAtPeriodEnd !== undefined) {
        updateData.cancelAtPeriodEnd = subscriptionData.cancelAtPeriodEnd;
      }

      if (subscriptionData.stripeCustomerId) {
        updateData.stripeCustomerId = subscriptionData.stripeCustomerId;
      }

      const result = await this.db
        .update(table.user)
        .set(updateData)
        .where(eq(table.user.id, userId))
        .returning();

      return result[0];
    });
  }

  /**
   * Cancel a subscription immediately or at period end
   */
  public cancelSubscription(userId: string, atPeriodEnd: boolean = true) {
    return wrapResultAsyncFn(async () => {
      // 1. Verify the user exists and has a subscription
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('User not found');
      }
      const user = users[0];

      if (!user.stripeCustomerId) {
        throw new DrizzleRecordNotFoundErrorCause('User does not have a Stripe customer ID');
      }

      // 2. Find the active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
      });

      if (subscriptions.data.length === 0) {
        throw new DrizzleRecordNotFoundErrorCause('No active subscription found');
      }

      // 3. Cancel the subscription
      const subscription = subscriptions.data[0];

      if (atPeriodEnd) {
        // Cancel at period end
        const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });

        // Update database
        await this.updateSubscriptionStatus(userId, {
          status: updatedSubscription.status,
          cancelAtPeriodEnd: true,
        });

        return {
          canceled: true,
          status: updatedSubscription.status,
          cancelAtPeriodEnd: true,
        };
      } else {
        // Cancel immediately
        await stripe.subscriptions.cancel(subscription.id);

        // Update database
        await this.updateSubscriptionStatus(userId, {
          status: 'canceled',
        });

        return {
          canceled: true,
          status: 'canceled',
          cancelAtPeriodEnd: false,
        };
      }
    });
  }

  /**
   * Validates and processes a Stripe webhook event
   * @param payload Raw body from webhook request
   * @param signature Stripe signature from headers
   * @param endpointSecret Webhook endpoint secret to verify the event
   */
  public validateAndProcessWebhook(payload: string, signature: string, endpointSecret: string) {
    return wrapResultAsyncFn(async () => {
      try {
        // Validate webhook signature
        const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

        // Process the validated event
        return await this.handleWebhookEvent(event);
      } catch (err: any) {
        console.error('Webhook signature verification failed', err);
        throw new Error(`Webhook Error: ${err.message || 'Unknown error'}`);
      }
    });
  }

  /**
   * Handles Stripe webhook events
   */
  public handleWebhookEvent(event: Stripe.Event) {
    return wrapResultAsyncFn(async () => {
      const eventType = event.type;

      switch (eventType) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.handleCheckoutSessionCompleted(session);
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionUpdated(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await this.handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.handleInvoicePaymentFailed(invoice);
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          await this.handleInvoicePaid(invoice);
          break;
        }
      }

      return { success: true };
    });
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (session.mode === 'subscription' && session.subscription) {
      const userId = session.client_reference_id;
      if (!userId) {
        throw new SubscriptionError('No user ID found in checkout session');
      }

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await this.db
        .update(table.user)
        .set({
          subscriptionStatus: subscription.status,
          stripeCustomerId: session.customer as string,
          stripePlanId: subscription.items.data[0]?.price.id,
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })
        .where(eq(table.user.id, userId));
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const users = await this.db
      .select()
      .from(table.user)
      .where(eq(table.user.stripeCustomerId, customerId));

    if (users.length === 0) {
      throw new DrizzleRecordNotFoundErrorCause('User not found for Stripe customer ID');
    }

    await this.db
      .update(table.user)
      .set({
        subscriptionStatus: subscription.status,
        stripePlanId: subscription.items.data[0]?.price.id,
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      })
      .where(eq(table.user.id, users[0].id));
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const users = await this.db
      .select()
      .from(table.user)
      .where(eq(table.user.stripeCustomerId, customerId));

    if (users.length === 0) {
      throw new DrizzleRecordNotFoundErrorCause('User not found for Stripe customer ID');
    }

    await this.db
      .update(table.user)
      .set({
        subscriptionStatus: 'canceled',
        subscriptionPeriodEnd: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : undefined,
      })
      .where(eq(table.user.id, users[0].id));
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (typeof invoice.customer === 'string') {
      const users = await this.db
        .select()
        .from(table.user)
        .where(eq(table.user.stripeCustomerId, invoice.customer));

      if (users.length > 0) {
        await this.db
          .update(table.user)
          .set({
            subscriptionStatus: 'past_due',
          })
          .where(eq(table.user.id, users[0].id));

        // TODO: Implement notification system to alert user of payment failure
      }
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    if (typeof invoice.customer === 'string') {
      const users = await this.db
        .select()
        .from(table.user)
        .where(eq(table.user.stripeCustomerId, invoice.customer));

      if (users.length > 0) {
        await this.db
          .update(table.user)
          .set({
            subscriptionStatus: 'active',
          })
          .where(eq(table.user.id, users[0].id));
      }
    }
  }

  /**
   * Cleans up customer data in Stripe when a user deletes their account
   */
  public cleanupCustomerData(userId: string) {
    return wrapResultAsyncFn(async () => {
      // 1. Get user's Stripe customer ID
      const users = await this.db.select().from(table.user).where(eq(table.user.id, userId));
      if (users.length === 0) {
        return; // User already deleted or not found
      }

      const stripeCustomerId = users[0].stripeCustomerId;
      if (!stripeCustomerId) {
        return; // No Stripe data to clean
      }

      // 2. Cancel any active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
      });

      for (const subscription of subscriptions.data) {
        await stripe.subscriptions.cancel(subscription.id);
      }

      // 3. Schedule customer deletion (delayed to allow for refunds/disputes)
      await stripe.customers.del(stripeCustomerId);

      return { success: true };
    });
  }
}
