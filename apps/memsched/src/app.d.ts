// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type {
  CfProperties,
  D1Database,
  ExecutionContext,
  KVNamespace,
  R2Bucket,
} from '@cloudflare/workers-types';

import type { AvatarStorageService } from '$lib/server/avatar-store';
import type { CacheService } from '$lib/server/cache';
import type { DBType } from '$lib/server/db';
import type { Session } from '$lib/server/db/schema';
import type {
  MetricDataService,
  ModerationService,
  ObjectiveLogsService,
  ObjectivesService,
  PaymentService,
  SessionsService,
  UsersService,
  WidgetsService,
} from '$lib/server/services';
import type { StorageService } from '$lib/server/store';
import type { LocalUser } from '$lib/types';

declare global {
  namespace App {
    interface Locals {
      nonce: string;
      user: LocalUser | null;
      session: Session | null;
      db: DBType;
      cache: CacheService;
      store: StorageService;
      avatarStore: AvatarStorageService;
      sessionsService: SessionsService;
      usersService: UsersService;
      objectivesService: ObjectivesService;
      objectiveLogsService: ObjectiveLogsService;
      widgetsService: WidgetsService;
      metricDataService: MetricDataService;
      paymentService: PaymentService;
      moderationService: ModerationService;
    }
    interface Platform {
      env: {
        DB: D1Database;
        CACHE_KV: KVNamespace;
        STORAGE_R2: R2Bucket;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
