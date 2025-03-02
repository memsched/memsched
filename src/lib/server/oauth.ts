import { GitHub, Google } from 'arctic';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '$env/static/private';

export type ProviderId = 'github' | 'google';

// TODO: Update redirect URI
export const github = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  'http://localhost:5173/signin/github/callback'
);

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/signin/google/callback'
);
