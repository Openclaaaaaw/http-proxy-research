const http = require('http');
const httpProxy = require('http-proxy');
const cheerio = require('cheerio');

const PORT = 8080;
const TARGET = 'http://httpbin.org';

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy Error:', err.message);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy Error: ' + err.message);
});

// Modify HTML response
function modifyHtml(html, options = {}) {
  const $ = cheerio.load(html);
  
  // Example modifications:
  // 1. Replace specific text
  if (options.replaceText) {
    Object.entries(options.replaceText).forEach(([search, replace]) => {
      $('body').contents().each((i, el) => {
        if (el.type === 'text') {
          const newText = el.data.replace(new RegExp(search, 'gi'), replace);
          $(el).replaceWith(newText);
        }
      });
    });
  }
  
  // 2. Replace icons/images
  if (options.replaceImages) {
    Object.entries(options.replaceImages).forEach(([search, replace]) => {
      $('img[src*="' + search + '"]').each((i, el) => {
        $(el).attr('src', replace);
      });
    });
  }
  
  // 3. Modify tables
  if (options.modifyTables) {
    $('table').each((i, table) => {
      $(table).css('border', '2px solid red');
      $(table).css('border-collapse', 'collapse');
      $('th, td', table).css('padding', '10px');
      $('th', table).css('background-color', '#f0f0f0');
    });
  }
  
  // 4. Add custom CSS
  if (options.addCSS) {
    const style = $('<style>').text(options.addCSS);
    $('head').append(style);
  }
  
  return $.html();
}

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
    const contentLength = res.getHeader('content-length');
    
    // Only modify HTML responses
    if (contentType.includes('text/html') && chunks.length > 0) {
      const originalHtml = Buffer.concat(chunks).toString('utf8');
      
      // Apply modifications
      const modifiedHtml = modifyHtml(originalHtml, {
        addCSS: 'body { font-family: Arial !important; }',
        modifyTables: true,
        replaceText: {
          'Hello': 'Hello (Modified!)',
          'Example': 'Demo'
        }
      });
      
      // Update content length
      res.setHeader('Content-Length', Buffer.byteLength(modifiedHtml));
      return originalEnd.call(res, modifiedHtml);
    }
    
    return originalEnd.apply(this, arguments);
  };
  
  // Forward request to proxy
  proxy.web(req, res);
});

server.listen(PORT, () => {
  console.log(`HTTP Proxy Server running on http://localhost:${PORT}`);
  console.log(`Forwarding to ${TARGET}`);
  console.log('Press Ctrl+C to stop');
});