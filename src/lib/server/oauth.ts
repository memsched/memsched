import { GitHub, Google } from 'arctic';
import { PUBLIC_GITHUB_REDIRECT_URI, PUBLIC_GOOGLE_REDIRECT_URI } from '$env/static/public';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '$env/static/private';

export type ProviderId = 'github' | 'google';

export const github = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PUBLIC_GITHUB_REDIRECT_URI
);

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PUBLIC_GOOGLE_REDIRECT_URI
);
