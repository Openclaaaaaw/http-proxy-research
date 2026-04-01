/**
 * Cache system for HTTP Proxy
 * Reduce repeated modifications for same content
 */
class Cache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 60000; // 1 minute default
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Generate cache key from request
   * @param {object} req - HTTP request
   * @returns {string}
   */
  getKey(req) {
    return `${req.url}-${req.method}`;
  }

  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {object|null}
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Store response in cache
   * @param {string} key - Cache key
   * @param {object} data - Data to cache
   */
  set(key, data) {
    // Clear old entry if exists
    if (this.cache.has(key)) {
      const timer = this.timers.get(key);
      if (timer) clearTimeout(timer);
    }
    
    // Limit cache size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const expiry = Date.now() + this.ttl;
    
    this.cache.set(key, { data, expiry });
    
    // Auto-expire
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, this.ttl);
    
    this.timers.set(key, timer);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

module.exports = Cache;