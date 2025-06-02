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
import { beforeAll } from 'vitest';

import { seedTestData, setupTestDB } from '$lib/server/test-utils/db';
import { setTestDB, setTestUsers } from '$lib/server/test-utils/test-context';

// Global test hooks
beforeAll(async () => {
  const db = await setupTestDB();
  setTestDB(db);

  const { testUsers } = await seedTestData(db);
  setTestUsers(testUsers);
});
