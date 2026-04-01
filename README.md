# HTTP Proxy Server with HTML Modification

A Node.js-based HTTP proxy server that can intercept and modify web page content in real-time.

## ✨ Features

- **HTTP Proxy**: Forward HTTP requests to target servers
- **HTML Modification**: Modify HTML content using Cheerio
  - Replace text patterns
  - Replace images/icons
  - Style tables
  - Inject custom CSS
- **Middleware System**: Extensible architecture for custom modifications
- **Logging**: Detailed request/response logging
- **Configuration**: Easy-to-use config file for modification rules

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the proxy server
npm start
```

Configure your browser to use `localhost:8080` as HTTP proxy.

## ⚙️ Configuration

Edit `config.js` to customize:

```javascript
modifications: {
  // Text replacements (search -> replacement)
  replaceText: {
    'Hello': 'Hello (Modified!)',
    'World': 'Proxy World'
  },
  
  // Image/icon replacements (src pattern -> new URL)
  replaceImages: {
    'icon': 'https://example.com/new-icon.png',
    'logo': 'https://example.com/logo.png'
  },
  
  // Enable table styling
  modifyTables: true,
  
  // Inject custom CSS
  injectCSS: `
    body { background: #f0f0f0; }
    table { border-collapse: collapse; }
  `
}
```

## 📁 Project Structure

```
http-proxy-research/
├── proxy.js           # Main proxy server
├── config.js          # Configuration & modification rules
├── test-server.js     # Local test HTTP server
├── test-proxy.js      # Test script
├── lib/
│   ├── HtmlModifier.js   # HTML modification logic
│   ├── Logger.js         # Logging utility
│   └── Middleware.js     # Middleware system
├── examples/
│   └── middleware-example.js  # Example middlewares
└── README.md
```

## 🧪 Testing

```bash
# Terminal 1: Start test server
node test-server.js

# Terminal 2: Start proxy
node proxy.js

# Terminal 3: Test via curl
curl -x http://localhost:8080 http://localhost:3000
```

## 🔧 Environment Variables

```bash
PROXY_PORT=8080         # Proxy server port
PROXY_TARGET=http://example.com  # Target server
```

## 📝 API

### HtmlModifier

```javascript
const HtmlModifier = require('./lib/HtmlModifier');
const modifier = new HtmlModifier();

const modified = modifier.modify(html, {
  replaceText: { 'old': 'new' },
  injectCSS: 'body { color: red; }'
});
```

### Middleware

```javascript
const { Middleware } = require('./lib/Middleware');

const mw = new Middleware();
mw.use((req, res, next) => {
  console.log('Request:', req.url);
  next();
});
```

## 📜 License

MIT