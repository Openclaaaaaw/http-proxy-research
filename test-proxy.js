/**
 * Simple test script for HTTP Proxy
 * Tests the proxy with a local test server
 */
const http = require('http');

const PROXY_PORT = 8080;
const TEST_SERVER_PORT = 3000;

// Test function to make request through proxy
function testProxy() {
  console.log('Testing HTTP Proxy...\n');
  
  // Test 1: Direct to test server (should show original)
  console.log('=== Test 1: Direct to test server (port 3000) ===');
  http.get(`http://localhost:${TEST_SERVER_PORT}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response received (first 500 chars):');
      console.log(data.substring(0, 500));
      console.log('\n---\n');
      
      // Test 2: Through proxy (should show modifications)
      console.log('=== Test 2: Through proxy (port 8080) ===');
      http.get(`http://localhost:${TEST_SERVER_PORT}`, {
        headers: {
          'Host': 'localhost:' + TEST_SERVER_PORT
        }
      }, (res2) => {
        // Use a proxy agent instead
        testViaProxy();
      }).on('error', err => {
        console.log('Direct test failed, trying via proxy...');
        testViaProxy();
      });
    });
  }).on('error', err => {
    console.log('Test server not running. Start it with: node test-server.js');
    console.log('Then start proxy with: node proxy.js');
  });
}

function testViaProxy() {
  // Use http.request with proxy configuration
  const options = {
    hostname: 'localhost',
    port: PROXY_PORT,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response received through proxy (first 500 chars):');
      console.log(data.substring(0, 500));
    });
  });
  
  req.on('error', (err) => {
    console.log('Error:', err.message);
  });
  
  req.end();
}

// Run test
testProxy();