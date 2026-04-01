/**
 * Request/Response statistics collector
 */
class Stats {
  constructor() {
    this.requests = {
      total: 0,
      modified: 0,
      blocked: 0,
      errors: 0
    };
    this.responseCodes = {};
    this.contentTypes = {};
    this.startTime = Date.now();
  }

  /**
   * Record a request
   */
  recordRequest(req) {
    this.requests.total++;
  }

  /**
   * Record a modified response
   */
  recordModified(req) {
    this.requests.modified++;
    this._recordContentType(req);
  }

  /**
   * Record a blocked request
   */
  recordBlocked(req) {
    this.requests.blocked++;
  }

  /**
   * Record an error
   */
  recordError(req) {
    this.requests.errors++;
  }

  /**
   * Record response code
   */
  recordResponseCode(code) {
    this.responseCodes[code] = (this.responseCodes[code] || 0) + 1;
  }

  _recordContentType(req) {
    const type = req.headers && req.headers['content-type'] || 'unknown';
    const simpleType = type.split(';')[0].trim();
    this.contentTypes[simpleType] = (this.contentTypes[simpleType] || 0) + 1;
  }

  /**
   * Get current statistics
   */
  get() {
    const uptime = Date.now() - this.startTime;
    return {
      requests: this.requests,
      responseCodes: this.responseCodes,
      contentTypes: this.contentTypes,
      uptime: Math.floor(uptime / 1000) + 's',
      requestsPerSecond: (this.requests.total / (uptime / 1000)).toFixed(2)
    };
  }

  /**
   * Reset statistics
   */
  reset() {
    this.requests = { total: 0, modified: 0, blocked: 0, errors: 0 };
    this.responseCodes = {};
    this.contentTypes = {};
    this.startTime = Date.now();
  }
}

module.exports = Stats;