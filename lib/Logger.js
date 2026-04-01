/**
 * Logging utility for HTTP Proxy
 */
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.logDir = options.logDir || './logs';
    this.logFile = options.logFile || 'proxy.log';
    this.console = options.console !== false;
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    this.logPath = path.join(this.logDir, this.logFile);
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };
    
    const logLine = JSON.stringify(logEntry);
    
    // Write to file
    fs.appendFileSync(this.logPath, logLine + '\n');
    
    // Log to console
    if (this.console) {
      const color = this._getColor(level);
      console.log(`${color}[${timestamp}] ${level.toUpperCase()}:${'\x1b[0m'} ${message}`);
      if (data) console.log('  ', data);
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  _getColor(level) {
    const colors = {
      info: '\x1b[36m',    // cyan
      warn: '\x1b[33m',    // yellow
      error: '\x1b[31m',   // red
      debug: '\x1b[90m'    // gray
    };
    return colors[level] || '\x1b[0m';
  }
}

module.exports = Logger;