/**
 * HTTP Proxy Library - Main Export
 * Consolidates all modules for easy importing
 */

// Core modules
const HtmlModifier = require('./HtmlModifier');
const Logger = require('./Logger');
const { Middleware, loggingMiddleware, errorMiddleware } = require('./Middleware');
const Filter = require('./Filter');
const RuleEngine = require('./RuleEngine');
const Cache = require('./Cache');
const Stats = require('./Stats');
const { 
  ProxyError, 
  NetworkError, 
  ModificationError, 
  ConfigError, 
  ErrorHandler,
  ErrorCodes 
} = require('./Errors');
const Inspector = require('./Inspector');
const Router = require('./Router');

module.exports = {
  // Core
  HtmlModifier,
  Logger,
  Middleware,
  Filter,
  RuleEngine,
  
  // Utilities
  Cache,
  Stats,
  Inspector,
  Router,
  
  // Error handling
  ProxyError,
  NetworkError,
  ModificationError,
  ConfigError,
  ErrorHandler,
  ErrorCodes,
  
  // Pre-made middlewares
  loggingMiddleware,
  errorMiddleware
};