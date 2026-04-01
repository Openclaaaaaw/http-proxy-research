/**
 * Debug script to understand why Google text isn't being replaced
 */
const https = require('https');
const cheerio = require('cheerio');

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
    const $ = cheerio.load(data);
    
    console.log('Testing text replacement on Google HTML...\n');
    
    // Count text nodes
    let textNodeCount = 0;
    let googleTextNodes = [];
    
    $('body').find('*').addBack().contents().each((i, el) => {
      if (el.type === 'text') {
        textNodeCount++;
        if (el.data && el.data.includes('Google')) {
          googleTextNodes.push({ index: i, data: el.data.trim().substring(0, 100) });
        }
      }
    });
    
    console.log(`Total text nodes: ${textNodeCount}`);
    console.log(`Text nodes containing "Google": ${googleTextNodes.length}`);
    googleTextNodes.forEach((t, i) => {
      console.log(`  ${i}: "${t.data}"`);
    });
    
    // Try replacement
    console.log('\n--- Attempting text replacement ---');
    const replacements = { 'Google': 'G○○○gle' };
    
    $('body').find('*').addBack().contents().each((i, el) => {
      if (el.type === 'text') {
        let text = el.data;
        Object.entries(replacements).forEach(([search, replace]) => {
          const regex = new RegExp(search, 'gi');
          text = text.replace(regex, replace);
        });
        if (text !== el.data) {
          console.log(`Replacing text node ${i}:`);
          console.log(`  Before: "${el.data.trim().substring(0, 80)}"`);
          console.log(`  After: "${text.trim().substring(0, 80)}"`);
          $(el).replaceWith(text);
        }
      }
    });
    
    // Check result
    const modifiedHtml = $.html();
    const hasGModified = modifiedHtml.includes('G○○○gle');
    console.log(`\n✅ Text replacement successful: ${hasGModified}`);
    
    if (!hasGModified) {
      // Try regex on raw HTML
      console.log('\n--- Trying raw regex on HTML ---');
      let rawHtml = data;
      Object.entries(replacements).forEach(([search, replace]) => {
        const regex = new RegExp(search, 'gi');
        rawHtml = rawHtml.replace(regex, replace);
      });
      const hasGModifiedRaw = rawHtml.includes('G○○○gle');
      console.log(`Raw regex replacement successful: ${hasGModifiedRaw}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
