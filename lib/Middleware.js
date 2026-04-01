/**
 * Middleware system for HTTP Proxy
 * Allows adding custom middleware functions
 */
class Middleware {
  constructor() {
    this.middlewares = [];
  }

  /**
   * Add a middleware function
   * @param {Function} fn - Middleware function (req, res, next)
   */
  use(fn) {
    this.middlewares.push(fn);
  }

  /**
   * Execute middlewares
   * @param {object} req - Request object
   * @param {object} res - Response object
   */
  async execute(req, res) {
    let index = 0;
    
    const next = async () => {
      if (index >= this.middlewares.length) return;
      
      const fn = this.middlewares[index++];
      try {
        await fn(req, res, next);
      } catch (err) {
        console.error('Middleware error:', err);
        next();
      }
    };
    
    await next();
  }
}

// Pre-defined middlewares
module.exports = {
  Middleware,
  
  // Request logging middleware
  loggingMiddleware: (req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  },
  
  // Error handling middleware
  errorMiddleware: (err, req, res, next) => {
    console.error('Request error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};