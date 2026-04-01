/**
 * In-memory request router
 * Maps incoming requests to different targets based on rules
 */
class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Add a route
   * @param {string|RegExp} pattern - URL pattern to match
   * @param {string} target - Target URL or path
   */
  addRoute(pattern, target) {
    this.routes.push({ pattern, target });
  }

  /**
   * Find matching route
   * @param {string} url - Request URL
   * @returns {string|null} - Matched target or null
   */
  match(url) {
    for (const route of this.routes) {
      if (this._matchPattern(route.pattern, url)) {
        return route.target;
      }
    }
    return null;
  }

  _matchPattern(pattern, url) {
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    if (typeof pattern === 'string') {
      return url.includes(pattern);
    }
    if (typeof pattern === 'function') {
      return pattern(url);
    }
    return false;
  }

  /**
   * Clear all routes
   */
  clear() {
    this.routes = [];
  }
}

// Predefined routers
module.exports = {
  Router,
  
  // Common routing patterns
  presets: {
    // Route based on path prefix
    byPath: (routes) => {
      const router = new Router();
      Object.entries(routes).forEach(([path, target]) => {
        router.addRoute(new RegExp(`^${path}`), target);
      });
      return router;
    },
    
    // Route based on domain
    byDomain: (routes) => {
      const router = new Router();
      Object.entries(routes).forEach(([domain, target]) => {
        router.addRoute(new RegExp(domain), target);
      });
      return router;
    }
  }
};