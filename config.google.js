/**
 * Configuration for Google modification
 */
module.exports = {
  port: 8888,
  target: 'http://www.google.com',
  
  modifications: {
    replaceText: {},
    
    replaceImages: {
      'favicon': 'https://www.google.com/favicon.ico'
    },
    
    modifyTables: false,
    
    injectCSS: `
      body { 
        background-color: #f0f0ff !important;
      }
    `
  }
};
