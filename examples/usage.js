/**
 * Simple example: Using the HTTP Proxy library programmatically
 */
const { HtmlModifier, Cache, Stats } = require('./lib');

// Example 1: Modify HTML directly
console.log('=== Example 1: HTML Modification ===');
const modifier = new HtmlModifier();

const html = `
<html>
<body>
  <h1>Hello World</h1>
  <p>This is an Example page.</p>
  <img src="/icon.png" alt="icon">
  <table>
    <tr><th>Name</th><th>Value</th></tr>
    <tr><td>A</td><td>1</td></tr>
  </table>
</body>
</html>
`;

const modified = modifier.modify(html, {
  replaceText: {
    'Hello': 'Greetings',
    'Example': 'Demo'
  },
  replaceImages: {
    'icon': 'https://example.com/new-icon.png'
  },
  modifyTables: true,
  injectCSS: 'body { background: #f9f9f9; }'
});

console.log('Modified HTML:');
console.log(modified);

console.log('\n=== Example 2: Cache ===');
const cache = new Cache({ maxSize: 10, ttl: 5000 });

// Store something in cache
cache.set('test-key', { data: 'test value' });
console.log('Cached:', cache.get('test-key'));

console.log('\n=== Example 3: Stats ===');
const stats = new Stats();

stats.recordRequest({ url: '/page1' });
stats.recordModified({ url: '/page1', headers: { 'content-type': 'text/html' } });
stats.recordResponseCode(200);

console.log('Statistics:', stats.get());

console.log('\n✅ All examples completed!');