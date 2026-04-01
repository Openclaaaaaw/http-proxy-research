/**
 * Test script to verify HTTPS proxy HTML modification
 */
const https = require('https');

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false
};

console.log('Testing HTTPS proxy HTML modification...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Check for our modifications
    const hasPurpleBg = data.includes('#f0f0ff') || data.includes('rgb(240, 240, 255)');
    const hasTextReplace = data.includes('G○○○gle') || data.includes('Searζh');
    
    console.log(`✅ Received HTML response (${data.length} bytes)`);
    
    if (hasPurpleBg) {
      console.log('✅ Purple background CSS found!');
    } else {
      console.log('❌ Purple background CSS NOT found');
    }
    
    if (hasTextReplace) {
      console.log('✅ Text replacement working (G○○○gle or Searζh found)!');
    } else {
      console.log('❌ Text replacement NOT working');
    }
    
    // Show a snippet
    const snippetStart = data.indexOf('<body');
    const snippetEnd = Math.min(snippetStart + 500, data.length);
    console.log('\nBody snippet:');
    console.log(data.substring(snippetStart, snippetEnd));
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
