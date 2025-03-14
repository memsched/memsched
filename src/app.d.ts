// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { LocalUser } from '$lib/types';
import type { Session } from '$lib/server/db/schema';
import type { DBType } from '$lib/server/db';
declare global {
  namespace App {
    interface Locals {
      user: LocalUser | null;
      session: Session | null;
      db: DBType;
    }
    interface Platform {
      env: {
        DB: D1Database;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
