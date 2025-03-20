import { describe, it, expect, beforeEach } from 'vitest';
import { isUsernameValid, generateUniqueUsername, RESERVED_USERNAMES } from './user-queries';
import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getTestDB, getTestUsers } from '$lib/server/test-utils/test-context';

describe('User functions', () => {
  let db: DBType;
  let testUsers: table.User[];

  // Get the database and test users from the global test context
  beforeEach(() => {
    db = getTestDB();
    testUsers = getTestUsers();
  });

  describe('isUsernameValid', () => {
    it('should return false for reserved usernames', async () => {
      for (const reservedName of RESERVED_USERNAMES) {
        const result = await isUsernameValid(db, reservedName);
        expect(result).toBe(false);
      }
    });

    it('should return false for existing usernames', async () => {
      const result = await isUsernameValid(db, testUsers[0].username);
      expect(result).toBe(false);
    });

    it('should return true for valid new usernames', async () => {
      const result = await isUsernameValid(db, 'newvaliduser');
      expect(result).toBe(true);
    });

    it('should exclude specified user ID when checking', async () => {
      // Should be invalid when not excluding (username exists)
      const resultWithoutExclude = await isUsernameValid(db, testUsers[0].username);
      expect(resultWithoutExclude).toBe(false);

      // Should be valid when excluding the user's own ID (only that user has the username)
      const resultWithExclude = await isUsernameValid(db, testUsers[0].username, testUsers[0].id);
      expect(resultWithExclude).toBe(true);
    });
  });

  describe('generateUniqueUsername', () => {
    it('should return the original username if it is valid', async () => {
      const result = await generateUniqueUsername(db, 'newuser');
      expect(result).toBe('newuser');
    });

    it('should append a number if original username is taken', async () => {
      const result = await generateUniqueUsername(db, testUsers[0].username);
      expect(result).toBe(`${testUsers[0].username}1`);
    });

    it('should increment until finding an available username', async () => {
      // First, add a couple of incremented usernames to simulate a common base username
      const baseUsername = 'popular';

      // Insert a few users with incremented usernames
      await db.insert(table.user).values([
        {
          id: 'test-popular',
          email: 'popular@example.com',
          username: 'popular',
          name: 'Popular User',
        },
        {
          id: 'test-popular1',
          email: 'popular1@example.com',
          username: 'popular1',
          name: 'Popular User 1',
        },
        {
          id: 'test-popular2',
          email: 'popular2@example.com',
          username: 'popular2',
          name: 'Popular User 2',
        },
      ]);

      // Now generateUniqueUsername should create 'popular3'
      const result = await generateUniqueUsername(db, baseUsername);
      expect(result).toBe('popular3');
    });

    it('should treat reserved usernames as taken', async () => {
      // Admin is a reserved username
      const result = await generateUniqueUsername(db, 'admin');
      expect(result).toBe('admin1');
    });
  });
});
