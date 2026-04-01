/**
 * Simple test HTTP server for testing the proxy
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is an Example paragraph with some text.</p>
  
  <h2>Test Icons</h2>
  <img src="/icon.png" alt="icon1">
  <img src="/images/logo.png" alt="logo">
  
  <h2>Test Table</h2>
  <table border="1">
    <tr><th>Name</th><th>Value</th></tr>
    <tr><td>A</td><td>1</td></tr>
    <tr><td>B</td><td>2</td></tr>
  </table>
  
  <h2>Another Paragraph</h2>
  <p>More World content here.</p>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  console.log(`[Test Server] ${req.method} ${req.url}`);
  
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
    return;
  }
  
  if (req.url === '/icon.png') {
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end('<PNG data>');
    return;
  }
  
  // 404 for other requests
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Use proxy.js to test modifications');
});