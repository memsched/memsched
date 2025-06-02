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
import type { R2Bucket } from '@cloudflare/workers-types';
import type { ResultAsync } from 'neverthrow';

import { dev } from '$app/environment';

import { type DrizzleError, wrapResultAsyncFn } from './db/types';

// Used only in dev mode
const memoryStore = new Map<string, { buffer: ArrayBuffer; contentType: string }>();

export interface StorageService {
  put(
    key: string,
    file: File | ArrayBuffer,
    options?: { contentType?: string; prefix?: string }
  ): ResultAsync<string, DrizzleError>;

  get(url: string): ResultAsync<{ buffer: ArrayBuffer; contentType: string } | null, DrizzleError>;

  delete(url: string): ResultAsync<void, DrizzleError>;
}

abstract class BaseStorageService implements StorageService {
  protected abstract putObject(
    key: string,
    buffer: ArrayBuffer,
    contentType: string
  ): Promise<void>;
  protected abstract getObject(
    key: string
  ): Promise<{ buffer: ArrayBuffer; contentType: string } | null>;
  protected abstract deleteObject(key: string): Promise<void>;

  protected getKeyFromUrl(url: string): string {
    // Remove protocol and hostname if present
    const path = url.replace(/^(?:https?:)?\/\/[^/]+/, '');
    // Remove leading slash and objects/ prefix
    return path.replace(/^\//, '').replace('objects/', '');
  }

  put(
    key: string,
    file: File | ArrayBuffer,
    options: { contentType?: string; prefix?: string } = {}
  ): ResultAsync<string, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      const buffer = file instanceof File ? await file.arrayBuffer() : file;
      const contentType =
        options.contentType ?? (file instanceof File ? file.type : 'application/octet-stream');
      const prefix = options.prefix ?? '';

      const finalKey = prefix ? `${prefix}/${key}` : key;
      await this.putObject(finalKey, buffer, contentType);
      return '/objects/' + finalKey;
    });
  }

  get(url: string): ResultAsync<{ buffer: ArrayBuffer; contentType: string } | null, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      const key = this.getKeyFromUrl(url);
      return this.getObject(key);
    });
  }

  delete(url: string): ResultAsync<void, DrizzleError> {
    return wrapResultAsyncFn(async () => {
      const key = this.getKeyFromUrl(url);
      await this.deleteObject(key);
    });
  }
}

class DevStorageService extends BaseStorageService {
  protected async putObject(key: string, buffer: ArrayBuffer, contentType: string): Promise<void> {
    memoryStore.set(key, { buffer, contentType });
  }

  protected async getObject(
    key: string
  ): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    return memoryStore.get(key) ?? null;
  }

  protected async deleteObject(key: string): Promise<void> {
    memoryStore.delete(key);
  }
}

class R2StorageService extends BaseStorageService {
  constructor(private r2: R2Bucket) {
    super();
  }

  protected async putObject(key: string, buffer: ArrayBuffer, contentType: string): Promise<void> {
    await this.r2.put(key, buffer, {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000, immutable', // 1 year cache
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
      },
    });
  }

  protected async getObject(
    key: string
  ): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
    const object = await this.r2.get(key);
    if (!object) return null;

    const buffer = await object.arrayBuffer();
    return {
      buffer,
      contentType: object.httpMetadata?.contentType ?? 'application/octet-stream',
    };
  }

  protected async deleteObject(key: string): Promise<void> {
    await this.r2.delete(key);
  }
}

export function getStore(platform?: App.Platform): StorageService {
  if (dev) {
    return new DevStorageService();
  }

  if (!platform?.env?.STORAGE_R2) {
    throw new Error('Storage service configuration error: STORAGE_R2 is not available.');
  }

  return new R2StorageService(platform.env.STORAGE_R2);
}
