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
