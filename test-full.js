/**
 * Test script to verify HTTPS proxy with detailed output
 */
const https = require('https');

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false
};

console.log('Testing HTTPS proxy - Full Analysis\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nResponse size: ${data.length} bytes`);
    
    // Check for CSS injection
    const hasPurpleBg = data.includes('#f0f0ff') || data.includes('rgb(240, 240, 255)') || data.includes('f0f0ff');
    console.log(`\nCSS Injection: ${hasPurpleBg ? '✅ WORKING' : '❌ NOT WORKING'}`);
    
    // Check for text replacement
    const hasGModified = data.includes('G○○○gle');
    const hasSModified = data.includes('Searζh');
    const hasGoogleOriginal = data.includes('>Google<') || data.includes('Google');
    console.log(`Text Replacement (G○○○gle): ${hasGModified ? '✅ WORKING' : '❌ NOT WORKING'}`);
    console.log(`Text Replacement (Searζh): ${hasSModified ? '✅ WORKING' : '❌ NOT WORKING'}`);
    console.log(`Original "Google" text found: ${hasGoogleOriginal ? 'YES' : 'NO'}`);
    
    // Show first 1000 chars
    console.log('\n--- First 1000 chars of modified HTML ---');
    console.log(data.substring(0, 1000));
    console.log('---');
    
    // Look for specific patterns
    console.log('\n--- Searching for key elements ---');
    const logoMatch = data.match(/logo.*?(google|Google)/i);
    console.log(`Logo text: ${logoMatch ? logoMatch[0] : 'not found'}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
