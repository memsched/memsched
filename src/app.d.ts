// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type {
  CfProperties,
  D1Database,
  ExecutionContext,
  KVNamespace,
} from '@cloudflare/workers-types';

import type { CacheService } from '$lib/server/cache';
import type { DBType } from '$lib/server/db';
import type { Session } from '$lib/server/db/schema';
import type {
  MetricDataService,
  MetricsService,
  ModerationService,
  ObjectiveLogsService,
  ObjectivesService,
  PaymentService,
  SessionsService,
  UsersService,
  WidgetsService,
} from '$lib/server/services';
import type { LocalUser } from '$lib/types';

declare global {
  namespace App {
    interface Locals {
      user: LocalUser | null;
      session: Session | null;
      db: DBType;
      cache: CacheService;
      sessionsService: SessionsService;
      usersService: UsersService;
      objectivesService: ObjectivesService;
      objectiveLogsService: ObjectiveLogsService;
      widgetsService: WidgetsService;
      metricDataService: MetricDataService;
      metricsService: MetricsService;
      paymentService: PaymentService;
      moderationService: ModerationService;
    }
    interface Platform {
      env: {
        DB: D1Database;
        CACHE_KV: KVNamespace;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
