import { FREE_PLAN_LIMITS } from '$lib/constants';

export interface PlanLimits {
  maxWidgets: number;
  maxObjectives: number;
}

export interface SubscriptionStatus {
  status: string;
  planId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

const UNLIMITED = Number.MAX_SAFE_INTEGER;

export function getPlanLimits(
  subscription: SubscriptionStatus | null,
  isAdmin: boolean
): PlanLimits {
  // Admins always get unlimited access
  if (isAdmin) {
    return {
      maxWidgets: UNLIMITED,
      maxObjectives: UNLIMITED,
    };
  }

  // Check if user has an active subscription
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';

  if (isSubscribed) {
    return {
      maxWidgets: UNLIMITED,
      maxObjectives: UNLIMITED,
    };
  }

  // Free plan limits
  return {
    maxWidgets:
      import.meta.env.VITE_DEBUG_UNLIMITED_WIDGETS === '1' && import.meta.env.DEV
        ? UNLIMITED
        : FREE_PLAN_LIMITS.maxWidgets,
    maxObjectives:
      import.meta.env.VITE_DEBUG_UNLIMITED_OBJECTIVES === '1' && import.meta.env.DEV
        ? UNLIMITED
        : FREE_PLAN_LIMITS.maxObjectives,
  };
}
