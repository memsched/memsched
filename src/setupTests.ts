import { setupTestDB, seedTestData } from '$lib/server/test-utils/db';
import { setTestDB, setTestUsers } from '$lib/server/test-utils/test-context';
import { beforeAll } from 'vitest';

// Global test hooks
beforeAll(async () => {
  const db = await setupTestDB();
  setTestDB(db);

  const { testUsers } = await seedTestData(db);
  setTestUsers(testUsers);
});
