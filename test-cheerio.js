/**
 * Debug script for text replacement
 */
const cheerio = require('cheerio');

const html = '<html><body><p>Hello Google Search World</p><div>Google in div</div></body></html>';

const $ = cheerio.load(html);

console.log('Before replacement:');
console.log($.html());

$('body').find('*').addBack().contents().each((i, el) => {
  if (el.type === 'text') {
    console.log(`Text node ${i}: "${el.data}"`);
  }
});

const replacements = {
  'Google': 'G○○○gle',
  'Search': 'Searζh'
};

$('body').find('*').addBack().contents().each((i, el) => {
  if (el.type === 'text') {
    let text = el.data;
    Object.entries(replacements).forEach(([search, replace]) => {
      const regex = new RegExp(search, 'gi');
      text = text.replace(regex, replace);
    });
    if (text !== el.data) {
      console.log(`Replacing "${el.data}" with "${text}"`);
      $(el).replaceWith(text);
    }
  }
});

console.log('\nAfter replacement:');
console.log($.html());
