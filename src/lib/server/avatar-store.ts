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
