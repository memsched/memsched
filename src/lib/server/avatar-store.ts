import type { ResultAsync } from 'neverthrow';
import { v4 as uuid4 } from 'uuid';

import { dev } from '$app/environment';

import { type DrizzleError, wrapResultAsyncFn } from './db/types';
import { getStore, type StorageService } from './store';

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

  protected async resizeAvatar(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    if (dev) {
      // In dev mode, we'll just return the original buffer without resizing
      return buffer;
    }

    const { PhotonImage, SamplingFilter, resize } = await import('@cf-wasm/photon');
    const inputBytes = new Uint8Array(buffer);
    const inputImage = PhotonImage.new_from_byteslice(inputBytes);

    try {
      // Calculate new dimensions maintaining aspect ratio
      const width = inputImage.get_width();
      const height = inputImage.get_height();
      const size = 600;
      let newWidth = width;
      let newHeight = height;

      if (width > height && width > size) {
        newWidth = size;
        newHeight = Math.round((height * size) / width);
      } else if (height > size) {
        newHeight = size;
        newWidth = Math.round((width * size) / height);
      }

      const outputImage = resize(inputImage, newWidth, newHeight, SamplingFilter.Lanczos3);
      const outputBytes = outputImage.get_bytes_jpeg(75);
      outputImage.free();
      return outputBytes.buffer as ArrayBuffer;
    } finally {
      inputImage.free();
    }
  }

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
      const resizedBuffer = await this.resizeAvatar(buffer);

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
