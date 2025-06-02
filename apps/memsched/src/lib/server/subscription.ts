/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
