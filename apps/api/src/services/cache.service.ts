/**
 * In-memory TTL Cache Service
 * Provides fast caching for high-throughput read endpoints (feeds, categories, locations)
 * with automatic expiration and prefix invalidation.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private static store = new Map<string, CacheEntry<any>>();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  private static ensureCleanupRunning() {
    if (!this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
          if (now > entry.expiresAt) {
            this.store.delete(key);
          }
        }
      }, 60000); // Clean up expired keys every minute
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Set a value in the cache with a time-to-live in seconds.
   */
  static set<T>(key: string, value: T, ttlSeconds: number = 60): void {
    this.ensureCleanupRunning();
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  /**
   * Get a cached value. Returns null if missing or expired.
   */
  static get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete a specific cache key.
   */
  static delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all keys matching a given prefix.
   */
  static invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  static clear(): void {
    this.store.clear();
  }

  /**
   * Current number of stored cache entries.
   */
  static size(): number {
    return this.store.size;
  }
}
