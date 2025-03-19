// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { LocalUser } from '$lib/types';
import type { Session } from '$lib/server/db/schema';
import type { DBType } from '$lib/server/db';
import type { CacheService } from '$lib/server/cache';
import type {
  D1Database,
  KVNamespace,
  CfProperties,
  ExecutionContext,
} from '@cloudflare/workers-types';

declare global {
  namespace App {
    interface Locals {
      user: LocalUser | null;
      session: Session | null;
      db: DBType;
      cache: CacheService;
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
