'use strict';

var util = require('util');
var vmDebug = require('debug');
exports = module.exports = debugLogger;

exports.inspectOptions = {};

var DEBUG_NAMESPACE = ':debug';
var RED     = '\x1b[31m';
var GREEN   = '\x1b[32m';
var YELLOW  = '\x1b[33m';
var BLUE    = '\x1b[34m';
var RESET   = '\x1b[0m';

exports.levels = {
  debug : {
    color : BLUE,
    prefix :       'DEBUG  ',
    debugLogger : true
  },
  info : {
    color : GREEN,
    prefix : '      INFO   '
  },
  warn : {
    color : YELLOW,
    prefix : '      WARN   '
  },
  error : {
    color : RED,
    prefix : '      ERROR  '
  }
};

function getErrorMessage(e) {
  var errorStrings = ['', ''];

  if ( typeof e === 'undefined') {
    return errorStrings;
  }
  if ( typeof e === 'string' || e instanceof String) {
    errorStrings[0] = ' ' + e;
    return errorStrings;
  }
  if ( e instanceof Error) {
    errorStrings[0] = ' ' + e.toString();
    if (e.stack) {
      errorStrings[1] = 'Stack trace:\n' + e.stack;
    }
    return errorStrings;
  }
  if (e && typeof e.toString !== 'undefined') {
    errorStrings[0] = ' ' + e.toString();
  }
  errorStrings[1] = 'Inspected object:\n' + util.inspect(e, exports.inspectOptions);
  return errorStrings;
};

function getPadding(size){
  return new Array(size+1).join(' ');
}

function debugLogger(namespace) {
  var log = vmDebug(namespace);
  var debug = vmDebug(namespace + DEBUG_NAMESPACE);
  var defaultPadding = '\n' + getPadding(2);

  var logger = {
    logger : log,
    debugLogger : debug,
    isEnabled : log.enabled,
    isDebugEnabled : debug.enabled
  };

  var levels = exports.levels;
  Object.keys(levels).forEach(function(level) {
    var levelLog = levels[level].debugLogger ? debug : log;
    var color = vmDebug.useColors ? levels[level].color : '';
    var reset = vmDebug.useColors ? RESET : '';

    logger[level] = function(message, e) {
      var errorStrings = getErrorMessage(e);
      var padding = errorStrings[1] != '' ? defaultPadding : '';
      levelLog(color + levels[level].prefix + reset + message + errorStrings[0] + padding + errorStrings[1]);
    };
  });

  return logger;
};
