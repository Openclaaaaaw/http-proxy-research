# HTTP Proxy Server

Node.js HTTP proxy server with HTML modification capabilities.

## Features

- HTTP proxy forwarding
- HTML content modification using Cheerio
- Text replacement
- Image/icon replacement
- Table styling modifications
- Custom CSS injection

## Quick Start

```bash
# Install dependencies
npm install

# Start the proxy server
npm start

# Or with custom config
PROXY_PORT=8080 PROXY_TARGET=http://example.com npm start
```

## Configuration

Edit `config.js` to customize modification rules:

```javascript
modifications: {
  replaceText: {
    'Hello': 'Hello (Modified!)',
    'Example': 'Demo'
  },
  replaceImages: {
    'icon': 'https://example.com/new-icon.png'
  },
  modifyTables: true,
  injectCSS: 'body { background: #f0f0f0; }'
}
```

## Usage

Configure your browser or application to use:
- **Proxy:** localhost:8080
- **Target server:** configured in config.js (default: httpbin.org)

Example:
```bash
curl -x http://localhost:8080 http://httpbin.org/html
```

## Architecture

- `proxy.js` - Main proxy server with response interception
- `config.js` - Modification rules and configuration