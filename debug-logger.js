'use strict';

var util = require('util');
var vmDebug = require('debug');
exports = module.exports = logger;

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
      errorStrings[1] = '\n  stack trace: ' + e.stack;
    }
    return errorStrings;
  }
  if (e && typeof e.toString !== 'undefined') {
    errorStrings[0] = ' ' + e.toString();
  }
  errorStrings[1] = '\n  object: ' + util.inspect(e);
  return errorStrings;
};

function getFormattedMessage(message, e) {
  var errorStrings = getErrorMessage(e);
  return message + errorStrings[0] + errorStrings[1];
}

function logger(namespace) {
  var log = vmDebug(namespace);
  var debug = vmDebug(namespace + ':debug');

  var loggerObj = {
    logger : log,
    debugLogger : debug,
    isEnabled : function() {
      return log.enabled;
    },
    isDebugEnabled : function() {
      return debug.enabled;
    }
  };

  var levels = exports.levels;
  Object.keys(levels).forEach(function(level) {
    var levelLog = levels[level].debugLogger ? debug : log;
    var color = vmDebug.useColors ? levels[level].color : '';
    var reset = vmDebug.useColors ? RESET : '';

    loggerObj[level] = function(message, e) {
      levelLog(color + levels[level].prefix + reset + getFormattedMessage(message, e));
    };
  });

  return loggerObj;
};
