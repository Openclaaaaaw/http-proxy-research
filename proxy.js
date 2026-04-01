/**
 * HTTPS Proxy Server with HTML modification capabilities
 * Supports both HTTP and HTTPS (MITM mode)
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const config = require('./config');
const HtmlModifier = require('./lib/HtmlModifier');

// Create HtmlModifier instance
const htmlModifier = new HtmlModifier();

// SSL certificates for MITM (man-in-the-middle)
const CERT_DIR = path.join(__dirname, 'certs');
const CERT_KEY = path.join(CERT_DIR, 'key.pem');
const CERT_CERT = path.join(CERT_DIR, 'cert.pem');

// Generate self-signed certificates if they don't exist
function ensureCertificates() {
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(CERT_KEY) || !fs.existsSync(CERT_CERT)) {
    console.log('Generating SSL certificates...');
    const { execSync } = require('child_process');
    try {
      execSync(`openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 -subj "/CN=*" -keyout "${CERT_KEY}" -out "${CERT_CERT}"`, 
        { cwd: CERT_DIR });
      console.log('SSL certificates generated.');
    } catch (e) {
      console.error('Failed to generate certificates:', e.message);
    }
  }
}

ensureCertificates();

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync(CERT_KEY),
  cert: fs.readFileSync(CERT_CERT)
};

// Parse target URL
const targetUrl = config.target;
const parsedTarget = url.parse(targetUrl);
const targetProtocol = parsedTarget.protocol === 'https:' ? https : http;
const targetPort = parsedTarget.port || (parsedTarget.protocol === 'https:' ? 443 : 80);
const targetHost = parsedTarget.hostname;
const targetPath = parsedTarget.path || '/';

// Create HTTPS server for intercepting connections
const server = https.createServer(sslOptions, (clientReq, clientRes) => {
  console.log(`[${new Date().toISOString()}] ${clientReq.method} ${clientReq.url}`);
  
  // Determine target based on config or request
  // For now, use the configured target
  const options = {
    hostname: targetHost,
    port: targetPort,
    path: clientReq.url, // Use the actual request path
    method: clientReq.method,
    headers: { ...clientReq.headers },
    rejectUnauthorized: false
  };
  
  // Set SNI hostname for HTTPS targets
  if (targetProtocol === https) {
    options.servername = targetHost;
  }
  
  // Remove proxy-Authorization header and fix Host header
  delete options.headers['proxy-authorization'];
  options.headers.host = targetHost + (targetPort !== 80 ? ':' + targetPort : '');
  
  const proxyReq = targetProtocol.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    const isHtml = contentType.includes('text/html');
    
    console.log(`  -> ${proxyRes.statusCode} ${contentType.substring(0, 50)}`);
    
    if (isHtml) {
      // Collect response body
      let body = [];
      
      proxyRes.on('data', (chunk) => {
        body.push(chunk);
      });
      
      proxyRes.on('end', () => {
        try {
          body = Buffer.concat(body);
          const html = body.toString('utf8');
          
          // Apply modifications
          const modified = htmlModifier.modify(html, config.modifications);
          
          // Send modified response (remove Transfer-Encoding to avoid conflict with Content-Length)
          const headers = { ...proxyRes.headers };
          delete headers['transfer-encoding'];
          clientRes.writeHead(proxyRes.statusCode, {
            ...headers,
            'content-length': Buffer.byteLength(modified)
          });
          clientRes.end(modified);
          console.log(`  HTML modified (${html.length} -> ${modified.length} bytes)`);
        } catch (err) {
          console.error('  Modification error:', err.message);
          // Fallback to original
          clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
          clientRes.end(body);
        }
      });
    } else {
      // Pass through non-HTML responses
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    }
  });
  
  proxyReq.on('error', (err) => {
    console.error('  Proxy request error:', err.message);
    clientRes.writeHead(502);
    clientRes.end('Proxy Error: ' + err.message);
  });
  
  clientReq.pipe(proxyReq);
});

// Handle CONNECT method for HTTPS tunneling
server.on('connect', (req, clientSocket, head) => {
  console.log(`[${new Date().toISOString()}] CONNECT ${req.url}`);
  
  const [hostname, port] = req.url.split(':');
  const targetPort = parseInt(port) || 443;
  
  // Connect to target server
  const serverSocket = require('net').connect(targetPort, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    
    if (head.length > 0) {
      serverSocket.write(head);
    }
    
    // Pipe traffic bidirectionally
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
  
  serverSocket.on('error', (err) => {
    console.error('CONNECT error:', err.message);
    clientSocket.end();
  });
  
  clientSocket.on('error', (err) => {
    serverSocket.end();
  });
});

server.listen(config.port, () => {
  console.log(`HTTPS Proxy Server running on https://localhost:${config.port}`);
  console.log(`Forwarding to ${config.target}`);
  console.log('');
  console.log('⚠️  Important: To intercept HTTPS, you need to trust the proxy certificate.');
  console.log(`   Certificate location: ${CERT_DIR}/cert.pem`);
  console.log('');
  console.log('   On macOS, run:');
  console.log(`   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${CERT_CERT}`);
  console.log('');
  console.log('   On Linux (Ubuntu/Debian):');
  console.log(`   sudo cp ${CERT_CERT} /usr/local/share/ca-certificates/proxy.crt`);
  console.log('   sudo update-ca-certificates');
  console.log('');
  console.log('Press Ctrl+C to stop');
});
