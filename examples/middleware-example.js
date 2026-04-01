/**
 * Example Custom Middleware - Add custom modifications
 * Copy this as a template for custom middleware
 */
const cheerio = require('cheerio');

/**
 * Custom HTML modification middleware
 * Add your own modification logic here
 */
function customHtmlMiddleware(req, res, next) {
  // This middleware runs on HTML responses
  // You can add custom logic based on req.url, headers, etc.
  
  console.log(`[Custom Middleware] Processing: ${req.url}`);
  
  // Example: Add banner to specific pages
  if (req.url.includes('/dashboard')) {
    // Would modify HTML before sending
    console.log('[Custom Middleware] Adding dashboard banner');
  }
  
  next();
}

/**
 * Example: Modify response headers
 */
function headerMiddleware(req, res, next) {
  // Add custom headers
  res.setHeader('X-Proxy-Modified', 'true');
  res.setHeader('X-Custom-Header', 'custom-value');
  
  next();
}

/**
 * Example: Block specific URLs
 */
function blockMiddleware(req, res, next) {
  const blockedPaths = ['/admin', '/private', '/secret'];
  
  if (blockedPaths.some(path => req.url.includes(path))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }
  
  next();
}

/**
 * Example: Rate limiting (simple version)
 */
const requestCounts = {};
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 100;

function rateLimitMiddleware(req, res, next) {
  const key = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts[key]) {
    requestCounts[key] = { count: 1, resetTime: now + WINDOW_MS };
    return next();
  }
  
  const record = requestCounts[key];
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + WINDOW_MS;
    return next();
  }
  
  if (record.count >= MAX_REQUESTS) {
    res.writeHead(429, { 'Content-Type': 'text/plain' });
    res.end('Too Many Requests');
    return;
  }
  
  record.count++;
  next();
}

module.exports = {
  customHtmlMiddleware,
  headerMiddleware,
  blockMiddleware,
  rateLimitMiddleware
};