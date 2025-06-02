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
