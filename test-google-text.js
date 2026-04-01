/**
 * Test script to analyze Google HTML text nodes
 */
const https = require('https');

const options = {
  hostname: 'localhost',
  port: 8888,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Load into cheerio
    const cheerio = require('cheerio');
    const $ = cheerio.load(data);
    
    console.log('Searching for text nodes containing "Google" or "Search"...\n');
    
    let count = 0;
    $('body').find('*').addBack().contents().each((i, el) => {
      if (el.type === 'text' && (el.data.includes('Google') || el.data.includes('Search'))) {
        count++;
        console.log(`Text node ${i}: "${el.data.trim().substring(0, 100)}"`);
      }
    });
    
    console.log(`\nTotal text nodes with "Google" or "Search": ${count}`);
    
    // Also check raw HTML
    const googleRegex = />[^<]*Google[^<]*</g;
    const matches = data.match(googleRegex);
    console.log(`\nRaw HTML matches for ">...Google...": ${matches ? matches.length : 0}`);
    if (matches) {
      matches.slice(0, 5).forEach((m, i) => {
        console.log(`  ${i}: ${m}`);
      });
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
