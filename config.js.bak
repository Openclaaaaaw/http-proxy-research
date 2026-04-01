/**
 * Configuration for HTTP Proxy modifications
 */
module.exports = {
  // Server settings
  port: process.env.PROXY_PORT || 8080,
  target: process.env.PROXY_TARGET || 'http://httpbin.org',
  
  // Modification rules
  modifications: {
    // Replace text patterns
    replaceText: {
      'Hello': 'Hello (Modified!)',
      'Example': 'Demo',
      'World': 'Proxy World'
    },
    
    // Replace images/icons by matching src pattern
    replaceImages: {
      'icon': 'https://via.placeholder.com/50',
      'logo': 'https://via.placeholder.com/100'
    },
    
    // Enable table modifications
    modifyTables: true,
    
    // Custom CSS to inject
    injectCSS: `
      body { 
        font-family: Arial, sans-serif !important; 
      }
      table {
        border-collapse: collapse;
      }
      th {
        background-color: #4CAF50 !important;
        color: white !important;
      }
      td, th {
        padding: 10px !important;
        border: 1px solid #ddd !important;
      }
    `
  }
};