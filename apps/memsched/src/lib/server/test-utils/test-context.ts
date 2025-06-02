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
