/**
 * CLI for HTTP Proxy Server
 */
const path = require('path');
const args = process.argv.slice(2);

const commands = {
  start: 'Start the proxy server',
  test: 'Run test suite',
  help: 'Show help message'
};

function showHelp() {
  console.log(`
HTTP Proxy Server CLI

Usage: node cli.js [command] [options]

Commands:
  start           Start the proxy server
  test           Run tests
  help           Show this help message

Options:
  --port <n>     Set proxy port (default: 8080)
  --target <url> Set target server URL
  --config <path> Use custom config file

Examples:
  node cli.js start
  node cli.js start --port 9000 --target http://example.com
  node cli.js test

`);
}

function startProxy(options) {
  // Load config
  const configPath = options.config || './config.js';
  const config = require(path.resolve(configPath));
  
  // Override with CLI options
  if (options.port) config.port = parseInt(options.port);
  if (options.target) config.target = options.target;
  
  // Start proxy (will be handled by proxy.js)
  console.log(`Starting proxy on port ${config.port}...`);
  console.log(`Target: ${config.target}`);
  
  // The actual server start is done by proxy.js
  require('./proxy.js');
}

function runTests() {
  console.log('Running tests...');
  require('./test-proxy.js');
}

// Parse commands
const command = args[0] || 'help';

if (command === 'help') {
  showHelp();
} else if (command === 'start') {
  const options = {};
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) {
      options.port = args[++i];
    } else if (args[i] === '--target' && args[i + 1]) {
      options.target = args[++i];
    } else if (args[i] === '--config' && args[i + 1]) {
      options.config = args[++i];
    }
  }
  startProxy(options);
} else if (command === 'test') {
  runTests();
} else {
  console.log(`Unknown command: ${command}`);
  showHelp();
}