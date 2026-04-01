/**
 * Request/Response Inspector
 * Debug tool for viewing request and response details
 */
class Inspector {
  constructor(options = {}) {
    this.enabled = options.enabled || false;
    this.logHeaders = options.logHeaders || false;
    this.logBody = options.logBody || false;
    this.maxBodyLength = options.maxBodyLength || 1000;
  }

  /**
   * Inspect incoming request
   */
  inspectRequest(req) {
    if (!this.enabled) return null;
    
    const inspection = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: this.logHeaders ? req.headers : undefined,
      connection: {
        remoteAddress: req.connection?.remoteAddress,
        remotePort: req.connection?.remotePort
      }
    };
    
    this._log('Request', inspection);
    return inspection;
  }

  /**
   * Inspect outgoing response
   */
  inspectResponse(res, body = null) {
    if (!this.enabled) return null;
    
    const inspection = {
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      headers: this.logHeaders ? res.getHeaders() : undefined,
      body: this.logBody && body ? this._truncate(body) : undefined
    };
    
    this._log('Response', inspection);
    return inspection;
  }

  _log(type, data) {
    console.log(`\n=== ${type} Inspection ===`);
    console.log(JSON.stringify(data, null, 2));
    console.log('========================\n');
  }

  _truncate(str) {
    if (typeof str !== 'string') return str;
    if (str.length <= this.maxBodyLength) return str;
    return str.substring(0, this.maxBodyLength) + '...';
  }

  /**
   * Enable/disable inspection
   */
  toggle(enabled) {
    this.enabled = enabled;
  }
}

module.exports = Inspector;