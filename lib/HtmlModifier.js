/**
 * HTML Modifier - Central module for modifying HTML content
 */
const cheerio = require('cheerio');

class HtmlModifier {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Modify HTML content based on configured rules
   * @param {string} html - Original HTML content
   * @param {object} rules - Modification rules
   * @returns {string} - Modified HTML
   */
  modify(html, rules = {}) {
    const $ = cheerio.load(html);
    
    // Apply text replacements
    if (rules.replaceText) {
      this._replaceText($, rules.replaceText);
    }
    
    // Apply image/icon replacements
    if (rules.replaceImages) {
      this._replaceImages($, rules.replaceImages);
    }
    
    // Modify tables
    if (rules.modifyTables) {
      this._modifyTables($);
    }
    
    // Inject custom CSS
    if (rules.injectCSS) {
      this._injectCSS($, rules.injectCSS);
    }
    
    // Add custom classes to elements
    if (rules.addClasses) {
      this._addClasses($, rules.addClasses);
    }
    
    // Remove specific elements
    if (rules.removeElements) {
      this._removeElements($, rules.removeElements);
    }
    
    return $.html();
  }

  _replaceText($, replacements) {
    // Replace text in all text nodes, including nested ones
    $('body').find('*').addBack().contents().each((i, el) => {
      if (el.type === 'text') {
        let text = el.data;
        Object.entries(replacements).forEach(([search, replace]) => {
          const regex = new RegExp(this._escapeRegex(search), 'gi');
          text = text.replace(regex, replace);
        });
        if (text !== el.data) {
          $(el).replaceWith(text);
        }
      }
    });
  }

  _replaceImages($, replacements) {
    Object.entries(replacements).forEach(([pattern, newSrc]) => {
      $(`img[src*="${pattern}"]`).each((i, el) => {
        $(el).attr('src', newSrc);
        $(el).attr('data-modified', 'true');
      });
    });
  }

  _modifyTables($) {
    $('table').each((i, table) => {
      $(table).addClass('proxy-modified-table');
      $('th, td', table).each((j, cell) => {
        $(cell).addClass('proxy-modified-cell');
      });
    });
  }

  _injectCSS($, css) {
    const style = $('<style>').attr('id', 'proxy-injected-style').text(css);
    $('head').append(style);
  }

  _addClasses($, classes) {
    Object.entries(classes).forEach(([selector, className]) => {
      $(selector).addClass(className);
    });
  }

  _removeElements($, selectors) {
    selectors.forEach(selector => {
      $(selector).remove();
    });
  }

  _escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = HtmlModifier;