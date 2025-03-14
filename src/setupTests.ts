import { setupTestDB, seedTestData, teardownTestDB, TEST_DB_URL } from '$lib/server/test-utils/db';
import { setTestDB, setTestUsers } from '$lib/server/test-utils/test-context';
import { vi, beforeAll, afterAll } from 'vitest';
import { env } from '$env/dynamic/private';

// Mock the $env/dynamic/private module to provide our test DATABASE_URL
vi.mock('$env/dynamic/private', () => {
  return {
    env: {
      // This will be set by the test utils, don't worry about it being undefined here
      DATABASE_URL: TEST_DB_URL,
    },
  };
});

// Global test hooks
beforeAll(async () => {
  // Set up the test database
  const db = await setupTestDB();

  // Store the DB reference in our global test context
  setTestDB(db);

  // Seed test data
  const { testUsers } = await seedTestData(db);

  // Store test users in our global test context
  setTestUsers(testUsers);

  // Make DATABASE_URL available using type assertion
  (env as any).DATABASE_URL = TEST_DB_URL;
});

afterAll(async () => {
  // Cleanup database resources
  await teardownTestDB();
});
