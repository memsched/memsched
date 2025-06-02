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
import type { ResultAsync } from 'neverthrow';
import { v4 as uuid4 } from 'uuid';

import { type DrizzleError, wrapResultAsyncFn } from './db/types';
import { getStore, type StorageService } from './store';
import { resizeImageBuffer } from './utils/image';

export interface AvatarStorageService {
  uploadAvatar(
    file: File,
    userId: string,
    oldUrl: string | null
  ): ResultAsync<string, DrizzleError>;

  getAvatar(
    url: string
  ): ResultAsync<{ buffer: ArrayBuffer; contentType: string } | null, DrizzleError>;

  deleteAvatar(url: string): ResultAsync<void, DrizzleError>;
}

class BaseAvatarStorageService implements AvatarStorageService {
  constructor(private storageService: StorageService) {}

  uploadAvatar(
    file: File,
    userId: string,
    oldUrl: string | null
  ): ResultAsync<string, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Only images are allowed.');
      }

      // Delete old avatar if it exists
      if (oldUrl) {
        await this.deleteAvatar(oldUrl);
      }

      const buffer = await file.arrayBuffer();
      const resizedBuffer = await resizeImageBuffer(buffer, 600); // Avatars are 600px max

      const fileExtension = 'jpeg';
      const filename = `${uuid4()}.${fileExtension}`;

      const result = await this.storageService.put(filename, resizedBuffer, {
        contentType: 'image/jpeg',
        prefix: `avatars/${userId}`,
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    });
  }

  getAvatar(
    url: string
  ): ResultAsync<{ buffer: ArrayBuffer; contentType: string } | null, DrizzleError> {
    return this.storageService.get(url);
  }

  deleteAvatar(url: string): ResultAsync<void, DrizzleError> {
    return this.storageService.delete(url);
  }
}

export function getAvatarStore(platform?: App.Platform): AvatarStorageService {
  const storageService = getStore(platform);
  return new BaseAvatarStorageService(storageService);
}
