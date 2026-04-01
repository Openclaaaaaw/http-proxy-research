/**
 * Test script to verify HTTPS proxy - only check text content
 */
const https = require('https');

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false
};

console.log('Testing HTTPS proxy - Checking Text Nodes Only\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response size: ${data.length} bytes`);
    
    // Use regex to find text content between tags
    const textContentRegex = /(?<=>)([^<]+?)(?=<)/g;
    const matches = data.match(textContentRegex);
    
    console.log(`\nFound ${matches ? matches.length : 0} text segments`);
    
    // Filter to meaningful text (more than just whitespace)
    const meaningfulText = matches ? matches.filter(m => m.trim().length > 0) : [];
    console.log(`Found ${meaningfulText.length} non-empty text segments`);
    
    // Check for G○○○gle and Google
    const hasGModified = data.includes('G○○○gle');
    const hasSModified = data.includes('Searζh');
    const googleCount = (data.match(/Google/gi) || []).length;
    const gModifiedCount = (data.match(/G○○○gle/g) || []).length;
    
    console.log(`\n"Google" appears ${googleCount} times`);
    console.log(`"G○○○gle" appears ${gModifiedCount} times`);
    console.log(`"Searζh" appears ${hasSModified ? 'YES' : 'NO'}`);
    
    // Show some text segments
    console.log('\n--- Sample text segments containing "Google" ---');
    if (matches) {
      matches.filter(m => m.includes('Google')).forEach((m, i) => {
        console.log(`  ${i}: "${m.trim()}"`);
      });
    }
    
    console.log(`\n✅ CSS Injection: ${data.includes('f0f0ff') ? 'WORKING' : 'NOT WORKING'}`);
    console.log(`✅ Text Replacement: ${hasGModified ? 'WORKING' : 'NOT WORKING'}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
