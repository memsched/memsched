import { GitHub, Google } from 'arctic';

import { env } from '$env/dynamic/private';
import { PUBLIC_GITHUB_REDIRECT_URI, PUBLIC_GOOGLE_REDIRECT_URI } from '$env/static/public';

export type ProviderId = 'github' | 'google';

export const github = new GitHub(
  env.GITHUB_CLIENT_ID as string,
  env.GITHUB_CLIENT_SECRET as string,
  PUBLIC_GITHUB_REDIRECT_URI
);

export const google = new Google(
  env.GOOGLE_CLIENT_ID as string,
  env.GOOGLE_CLIENT_SECRET as string,
  PUBLIC_GOOGLE_REDIRECT_URI
);
