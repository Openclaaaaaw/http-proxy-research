/**
 * Filter system for HTTP Proxy
 * Control which requests are modified
 */
class Filter {
  constructor(options = {}) {
    this.filters = options.filters || {};
  }

  /**
   * Check if a request should be modified
   * @param {object} req - HTTP request
   * @returns {boolean}
   */
  shouldModify(req) {
    // Check URL patterns
    if (this.filters.urlPatterns) {
      const shouldModify = this.filters.urlPatterns.some(pattern => {
        if (pattern.startsWith('*')) {
          return req.url.includes(pattern.slice(1));
        }
        return req.url.includes(pattern);
      });
      if (!shouldModify) return false;
    }

    // Check excluded patterns
    if (this.filters.excludePatterns) {
      const shouldExclude = this.filters.excludePatterns.some(pattern => {
        return req.url.includes(pattern);
      });
      if (shouldExclude) return false;
    }

    // Check content types
    if (this.filters.contentTypes) {
      // This is checked later in the response
      return true;
    }

    return true;
  }

  /**
   * Check if content type should be modified
   * @param {string} contentType - Response content type
   * @returns {boolean}
   */
  shouldModifyContent(contentType) {
    if (!this.filters.contentTypes) return true;
    return this.filters.contentTypes.some(type => 
      contentType.includes(type)
    );
  }
}

// Predefined filters
module.exports = {
  Filter,
  
  // Common filter configurations
  presets: {
    // Only modify HTML pages
    htmlOnly: {
      filters: {
        contentTypes: ['text/html']
      }
    },
    
    // Modify HTML and CSS
    htmlAndCss: {
      filters: {
        contentTypes: ['text/html', 'text/css']
      }
    },
    
    // Exclude certain paths
    excludeAdmin: {
      filters: {
        excludePatterns: ['/admin', '/login', '/api/']
      }
    }
  }
};