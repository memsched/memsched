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
import type { KVNamespace } from '@cloudflare/workers-types';

import { dev } from '$app/environment';

type CacheMetadata = Record<string, string | number | boolean | null>;

interface CacheValue {
  value: string;
  etag: string;
  metadata: CacheMetadata;
}

// Simple in-memory cache for development
const memoryCache = new Map<string, CacheValue>();

export interface CacheService {
  get(key: string): Promise<CacheValue | null>;
  set(key: string, value: string, etag: string, metadata?: CacheMetadata): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

class MemoryCacheService implements CacheService {
  async get(key: string): Promise<CacheValue | null> {
    return memoryCache.get(key) || null;
  }

  async set(key: string, value: string, etag: string, metadata?: CacheMetadata): Promise<void> {
    memoryCache.set(key, { value, etag, metadata: metadata || {} });
  }

  async delete(key: string): Promise<void> {
    memoryCache.delete(key);
  }

  async keys(): Promise<string[]> {
    return Array.from(memoryCache.keys());
  }
}

class KVCacheService implements CacheService {
  private readonly EXPIRATION_TTL = 604800; // 7 days
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async get(key: string): Promise<CacheValue | null> {
    const result = await this.kv.get(key, { type: 'json' });
    return result as CacheValue | null;
  }

  async set(key: string, value: string, etag: string, metadata?: CacheMetadata): Promise<void> {
    await this.kv.put(key, JSON.stringify({ value, etag, metadata }), {
      expirationTtl: this.EXPIRATION_TTL,
    });
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  async keys(): Promise<string[]> {
    const keys = await this.kv.list();
    return keys.keys.map((key) => key.name);
  }
}

export function getCache(platform?: App.Platform): CacheService {
  if (dev) {
    return new MemoryCacheService();
  }

  if (!platform?.env?.CACHE_KV) {
    throw new Error('CACHE_KV is not available in the platform environment');
  }

  return new KVCacheService(platform.env.CACHE_KV);
}
