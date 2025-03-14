import { GitHub, Google } from 'arctic';
import { PUBLIC_GITHUB_REDIRECT_URI, PUBLIC_GOOGLE_REDIRECT_URI } from '$env/static/public';
import { env } from '$env/dynamic/private';

export type ProviderId = 'github' | 'google';

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  PUBLIC_GITHUB_REDIRECT_URI
);

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  PUBLIC_GOOGLE_REDIRECT_URI
);
