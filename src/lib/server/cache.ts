import { dev } from '$app/environment';
import type { KVNamespace } from '@cloudflare/workers-types';

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
