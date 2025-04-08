import { error, fail, redirect } from '@sveltejs/kit';

import { PUBLIC_STRIPE_MONTHLY_PRO_PRICE_ID } from '$env/static/public';
import { getPlanLimits } from '$lib/server/subscription';
import { handleDbError } from '$lib/server/utils';
import type { LocalUser } from '$lib/types';

import type { Actions, PageServerLoad } from './$types';

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
    price: event.locals.paymentService.getPrice(PUBLIC_STRIPE_MONTHLY_PRO_PRICE_ID),
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

    const result = await event.locals.usersService.delete(userId, reason);
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
      PUBLIC_STRIPE_MONTHLY_PRO_PRICE_ID,
      event.url.origin + '/settings/account',
      event.url.origin + '/settings/account'
    );

    if (result.isErr()) {
      return fail(400, { error: 'Failed to create subscription' });
    }

    return redirect(302, result.value.checkoutUrl);
  },

  // cancelSubscription: async (event) => {
  //   if (!event.locals.session) {
  //     return error(401, 'Unauthorized');
  //   }
  //
  //   const result = await event.locals.paymentService.cancelSubscription(
  //     event.locals.session.userId,
  //     true // Cancel at period end
  //   );
  //
  //   if (result.isErr()) {
  //     return fail(400, { error: 'Failed to cancel subscription' });
  //   }
  //
  //   return { success: true };
  // },
};
