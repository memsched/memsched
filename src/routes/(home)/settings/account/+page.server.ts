import type { PageServerLoad, Actions } from './$types';
import { redirect, error, fail } from '@sveltejs/kit';
import type { LocalUser } from '$lib/types';
import { handleDbError } from '$lib/server/utils';
import { getPlanLimits } from '$lib/server/subscription';

const PRICE_ID = 'price_1R5jykLbnAcoN7rzDYDJtJvK';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.session) {
    return redirect(302, '/auth/signin');
  }

  // Get subscription status
  const subscriptionResult = await event.locals.paymentService.getSubscriptionStatus(
    event.locals.session.userId
  );
  if (subscriptionResult.isErr()) {
    return handleDbError(subscriptionResult);
  }

  const planLimits = getPlanLimits(subscriptionResult.value, event.locals.user?.admin ?? false);

  return {
    user: event.locals.user as LocalUser,
    subscription: subscriptionResult.value,
    planLimits,
    price: event.locals.paymentService.getPrice(PRICE_ID),
  };
};

export const actions: Actions = {
  deleteAccount: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const formData = await event.request.formData();
    const userId = formData.get('userId') as string;
    const reason = formData.get('reason') as string;

    // Verify the user is deleting their own account
    if (userId !== event.locals.session.userId) {
      return error(403, 'Forbidden');
    }

    const result = await event.locals.usersService.deleteUser(userId, reason);
    if (result.isErr()) {
      return handleDbError(result);
    }

    event.locals.sessionsService.deleteSessionTokenCookie(event);
    return redirect(302, '/auth/signin');
  },

  manageSubscription: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const result = await event.locals.paymentService.getCustomerPortalUrl(
      event.locals.session.userId,
      event.url.origin + '/settings/account'
    );

    if (result.isErr()) {
      return fail(400, { error: 'Failed to get customer portal URL' });
    }

    return redirect(302, result.value.portalUrl);
  },

  subscribe: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const result = await event.locals.paymentService.createSubscription(
      event.locals.session.userId,
      PRICE_ID,
      event.url.origin + '/settings/account',
      event.url.origin + '/settings/account'
    );

    if (result.isErr()) {
      return fail(400, { error: 'Failed to create subscription' });
    }

    return redirect(302, result.value.checkoutUrl);
  },

  cancelSubscription: async (event) => {
    if (!event.locals.session) {
      return error(401, 'Unauthorized');
    }

    const result = await event.locals.paymentService.cancelSubscription(
      event.locals.session.userId,
      true // Cancel at period end
    );

    if (result.isErr()) {
      return fail(400, { error: 'Failed to cancel subscription' });
    }

    return { success: true };
  },
};
