/**
 * Configuration for Google HTTPS modification
 */
module.exports = {
  port: 8888,
  // Use http for the target - the proxy will handle HTTPS
  target: 'http://www.google.com',
  
  modifications: {
    replaceText: {
      'Google': 'G○○○gle',
      'Search': 'Searζh'
    },
    
    replaceImages: {},
    
    modifyTables: false,
    
    injectCSS: `
      body { 
        background-color: #f0f0ff !important;
      }
      /* Make modifications visible */
      img { border: 3px solid red !important; }
    `
  }
};
