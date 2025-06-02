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
import { beforeEach, describe, expect, it } from 'vitest';

import type { DBType } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { getTestDB, getTestUsers } from '$lib/server/test-utils/test-context';

import { RESERVED_USERNAMES, UsersService } from './users-service';

describe('User functions', () => {
  let db: DBType;
  let testUsers: table.User[];
  let userService: UsersService;
  // Get the database and test users from the global test context
  beforeEach(() => {
    db = getTestDB();
    testUsers = getTestUsers();
    userService = new UsersService(db);
  });

  describe('isUsernameValid', () => {
    it('should return false for reserved usernames', async () => {
      for (const reservedName of RESERVED_USERNAMES) {
        const result = await userService.isUsernameValid(reservedName);
        if (result.isErr()) {
          throw result.error;
        }
        expect(result.value).toBe(false);
      }
    });
    it('should return false for existing usernames', async () => {
      const result = await userService.isUsernameValid(testUsers[0].username);
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe(false);
    });

    it('should return true for valid new usernames', async () => {
      const result = await userService.isUsernameValid('newvaliduser');
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe(true);
    });

    it('should exclude specified user ID when checking', async () => {
      // Should be invalid when not excluding (username exists)
      const resultWithoutExclude = await userService.isUsernameValid(testUsers[0].username);
      if (resultWithoutExclude.isErr()) {
        throw resultWithoutExclude.error;
      }
      expect(resultWithoutExclude.value).toBe(false);

      // Should be valid when excluding the user's own ID (only that user has the username)
      const resultWithExclude = await userService.isUsernameValid(
        testUsers[0].username,
        testUsers[0].id
      );
      if (resultWithExclude.isErr()) {
        throw resultWithExclude.error;
      }
      expect(resultWithExclude.value).toBe(true);
    });
  });

  describe('generateUniqueUsername', () => {
    it('should return the original username if it is valid', async () => {
      const result = await userService.generateUniqueUsername('newuser');
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe('newuser');
    });

    it('should append a number if original username is taken', async () => {
      const result = await userService.generateUniqueUsername(testUsers[0].username);
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe(`${testUsers[0].username}1`);
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
      const result = await userService.generateUniqueUsername(baseUsername);
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe('popular3');
    });

    it('should treat reserved usernames as taken', async () => {
      // Admin is a reserved username
      const result = await userService.generateUniqueUsername('admin');
      if (result.isErr()) {
        throw result.error;
      }
      expect(result.value).toBe('admin1');
    });
  });
});
