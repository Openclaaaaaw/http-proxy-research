/**
 * Error handling utilities
 */
class ProxyError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'ProxyError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class NetworkError extends ProxyError {
  constructor(message, originalError) {
    super(message, 'NETWORK_ERROR', 502);
    this.originalError = originalError;
  }
}

class ModificationError extends ProxyError {
  constructor(message, originalError) {
    super(message, 'MODIFICATION_ERROR', 500);
    this.originalError = originalError;
  }
}

class ConfigError extends ProxyError {
  constructor(message) {
    super(message, 'CONFIG_ERROR', 500);
  }
}

/**
 * Error handler for proxy
 */
class ErrorHandler {
  constructor(options = {}) {
    this.logger = options.logger || console;
  }

  /**
   * Handle error and send appropriate response
   */
  handle(err, req, res) {
    this.logger.error(`[Error] ${err.message}`, {
      url: req.url,
      method: req.method,
      code: err.code
    });

    if (err instanceof ProxyError) {
      res.writeHead(err.statusCode, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Proxy Error');
    }
  }

  /**
   * Wrap async handler to catch errors
   */
  asyncWrap(fn) {
    return async (req, res) => {
      try {
        await fn(req, res);
      } catch (err) {
        this.handle(err, req, res);
      }
    };
  }
}

// Error codes
const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  MODIFICATION_ERROR: 'MODIFICATION_ERROR',
  CONFIG_ERROR: 'CONFIG_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  BLOCKED: 'BLOCKED'
};

module.exports = {
  ProxyError,
  NetworkError,
  ModificationError,
  ConfigError,
  ErrorHandler,
  ErrorCodes
};