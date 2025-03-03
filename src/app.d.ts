// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { LocalUser } from '$lib/types';
import type { Session } from '$lib/server/db/schema';

declare global {
  namespace App {
    interface Locals {
      user: LocalUser | null;
      session: Session | null;
    }
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
