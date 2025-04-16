import type { DBType } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';

// Global test context that can be accessed across test files
type TestContext = {
  db: DBType | null;
  testUsers: User[];
};

// Initialize with null/empty values
export const testContext: TestContext = {
  db: null,
  testUsers: [],
};

// Helper to set the database
export function setTestDB(db: DBType): void {
  testContext.db = db;
}

// Helper to set test users
export function setTestUsers(users: User[]): void {
  testContext.testUsers = users;
}

// Helper to get the database with type safety
export function getTestDB(): DBType {
  if (!testContext.db) {
    throw new Error(
      'Test database not initialized. Make sure setupTests.ts is properly configured.'
    );
  }
  return testContext.db;
}

// Helper to get test users
export function getTestUsers(): User[] {
  return testContext.testUsers;
}
