/**
 * HTTP Proxy Server with HTML modification capabilities
 */
const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./config');
const HtmlModifier = require('./lib/HtmlModifier');

// Create HtmlModifier instance
const htmlModifier = new HtmlModifier();

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: config.target,
  changeOrigin: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy Error:', err.message);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy Error: ' + err.message);
});

// Create HTTP server to intercept requests
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Capture response for modification
  const originalWrite = res.write;
  const originalEnd = res.end;
  let chunks = [];
  
  res.write = function(chunk) {
    chunks.push(chunk);
    return originalWrite.apply(this, arguments);
  };
  
  res.end = function(chunk) {
    if (chunk) chunks.push(chunk);
    
    const contentType = res.getHeader('content-type') || '';
    
    // Only modify HTML responses
    if (contentType.includes('text/html') && chunks.length > 0) {
      try {
        const originalHtml = Buffer.concat(chunks).toString('utf8');
        
        // Apply modifications using HtmlModifier
        const modifiedHtml = htmlModifier.modify(
          originalHtml, 
          config.modifications
        );
        
        // Update content length
        res.setHeader('Content-Length', Buffer.byteLength(modifiedHtml));
        return originalEnd.call(res, modifiedHtml);
      } catch (err) {
        console.error('HTML Modification Error:', err.message);
        // Fallback to original response
        return originalEnd.call(res, Buffer.concat(chunks));
      }
    }
    
    return originalEnd.apply(this, arguments);
  };
  
  // Forward request to proxy
  proxy.web(req, res);
});

server.listen(config.port, () => {
  console.log(`HTTP Proxy Server running on http://localhost:${config.port}`);
  console.log(`Forwarding to ${config.target}`);
  console.log('Press Ctrl+C to stop');
});