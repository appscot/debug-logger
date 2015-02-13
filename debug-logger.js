'use strict';

var util = require('util');
var vmDebug = require('debug');
exports = module.exports = debugLogger;
exports.getForeColor = getForeColor;
exports.getBackColor = getBackColor;

exports.inspectOptions = {};

exports.colors = {
  black :   0,
  red :     1,
  green :   2,
  yellow :  3,
  blue :    4,
  magenta : 5,
  cyan :    6,
  white :   7
};
exports.colorReset = '\x1b[0m';

exports.levels = {
  debug : {
    color : getForeColor('blue'),
    prefix :       'DEBUG  ',
    namespaceSuffix : ':debug'
  },
  log : {
    color : '',
    prefix : '      LOG    '
  },
  info : {
    color : getForeColor('green'),
    prefix : '      INFO   '
  },
  warn : {
    color : getForeColor('yellow'),
    prefix : '      WARN   '
  },
  error : {
    color : getForeColor('red'),
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
}

function getPadding(size){
  return new Array(size+1).join(' ');
}

function getForeColor(color){
  return '\x1b[' + (30 + exports.colors[color]) + 'm';
}

function getBackColor(color){
  return '\x1b[' + (40 + exports.colors[color]) + 'm';
}

function debugLogger(namespace) {
  var levels = exports.levels;
  var defaultPadding = '\n' + getPadding(2);
  var log = vmDebug(namespace);
  var debugLoggers = { 'default': log };

  var logger = {};
  
  Object.keys(levels).forEach(function(level) {
    var loggerNamespaceSuffix = levels[level].namespaceSuffix ? levels[level].namespaceSuffix : 'default';
    if(!debugLoggers[loggerNamespaceSuffix]){
      debugLoggers[loggerNamespaceSuffix] = vmDebug(namespace + loggerNamespaceSuffix);
    }
    var levelLog = debugLoggers[loggerNamespaceSuffix];
    var color = vmDebug.useColors ? levels[level].color : '';
    var reset = vmDebug.useColors ? exports.colorReset : '';

    logger[level] = function (message, e) {
      var errorStrings = getErrorMessage(e);
      var padding = errorStrings[1] !== '' ? defaultPadding : '';
      levelLog(color + levels[level].prefix + reset + message + errorStrings[0] + padding + errorStrings[1]);
    };
    
    logger[level].logger = levelLog;
    logger[level].enabled = levelLog.enabled;
  });

  return logger;
}
