/**
 * Rule-based modifiers for specific scenarios
 */
const cheerio = require('cheerio');

class RuleEngine {
  constructor() {
    this.rules = [];
  }

  /**
   * Add a modification rule
   * @param {object} rule - Rule definition
   */
  addRule(rule) {
    this.rules.push(rule);
  }

  /**
   * Apply all matching rules to HTML
   * @param {string} html - HTML content
   * @param {object} context - Request context (url, headers, etc.)
   * @returns {string} - Modified HTML
   */
  apply(html, context) {
    const $ = cheerio.load(html);
    
    this.rules.forEach(rule => {
      // Check if rule matches
      if (!this._matches(rule, context)) return;
      
      // Apply rule modifications
      this._applyRule($, rule);
    });
    
    return $.html();
  }

  _matches(rule, context) {
    // Check URL pattern
    if (rule.urlPattern) {
      const regex = new RegExp(rule.urlPattern);
      if (!regex.test(context.url)) return false;
    }
    
    // Check condition function
    if (rule.condition && !rule.condition(context)) {
      return false;
    }
    
    return true;
  }

  _applyRule($, rule) {
    // Text replacements
    if (rule.replaceText) {
      Object.entries(rule.replaceText).forEach(([from, to]) => {
        const regex = new RegExp(this._escapeRegex(from), 'gi');
        $('body').each((i, el) => {
          const $el = $(el);
          const html = $el.html();
          if (html) {
            $el.html(html.replace(regex, to));
          }
        });
      });
    }
    
    // Add CSS class
    if (rule.addClass) {
      $(rule.selector).addClass(rule.addClass);
    }
    
    // Inject CSS
    if (rule.injectCSS) {
      const style = $('<style>').text(rule.injectCSS);
      $('head').append(style);
    }
    
    // Custom function
    if (rule.modify) {
      rule.modify($);
    }
  }

  _escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Example rules
module.exports = {
  RuleEngine,
  
  // Predefined rule sets
  presets: {
    // Make all tables striped
    stripedTables: {
      urlPattern: '.*',
      injectCSS: `
        .proxy-modified-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }
      `
    },
    
    // Add responsive wrapper to images
    responsiveImages: {
      urlPattern: '.*',
      modify: ($) => {
        $('img').each((i, img) => {
          const $img = $(img);
          $img.wrap('<div style="max-width: 100%; overflow: hidden;"></div>');
        });
      }
    }
  }
};