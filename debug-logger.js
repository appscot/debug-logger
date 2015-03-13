'use strict';

var util = require('util'),
    vmDebug = require('debug'),
    streamSpy = require('./stream-spy');

exports = module.exports = debugLogger;
exports.debug = vmDebug;

exports.config = function config(options){
  options = options || {};
  if(options.ensureNewline){
    ensureNewline();
  }
  if(options.inspectOptions){
    exports.inspectOptions = options.inspectOptions;
  }
  if(options.levels){
    merge(exports.levels, options.levels);
  }
  return debugLogger;
};

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
  trace : {
    color : exports.colors.cyan,
    prefix : '',
    namespaceSuffix : ':trace',
    level : 0,
    fd : 1  // currently only 1 (stdout) is supported. stderr is debug's standard
  },
  debug : {
    color : exports.colors.blue,
    prefix : '',
    namespaceSuffix : ':debug',
    level : 1,
    fd : 1
  },
  log : {
    color : '',
    prefix : '  ',
    namespaceSuffix : ':log',
    level : 2,
    fd : 1
  },
  info : {
    color : exports.colors.green,
    prefix : ' ',
    namespaceSuffix : ':info',
    level : 3,
    fd : 1
  },
  warn : {
    color : exports.colors.yellow,
    prefix : ' ',
    namespaceSuffix : ':warn',
    level : 4
  },
  error : {
    color : exports.colors.red,
    prefix : '',
    namespaceSuffix : ':error',
    level : 5
  }
};

exports.styles = {
  underline : '\x1b[4m'
};


function time(label){
  this.timeLabels[label] = process.hrtime();
}

function timeEnd(label, level){
  level = level || 'log';
  var diff = process.hrtime(this.timeLabels[label]);
  var diffMs = (diff[0] * 1e9 + diff[1]) / 1e6;
  this[level](label + ':', diffMs + 'ms');
  return diffMs;
}

function dir(obj, options, level){
  if(!level && this[options]){
    level = options;
    options = undefined;
  }
  options = options || exports.inspectOptions;
  level = level || 'log';
  this[level](util.inspect(obj, options));
}

function assert(expression){
  if (!expression) {
    var level = 'error';
    var arr = Array.prototype.slice.call(arguments, 1);
    if(this[arr[arr.length-1]]){
      level = arr[arr.length-1];
      arr = arr.slice(0, -1);
    }
    var assrt = require('assert');
    var err = new assrt.AssertionError({
      message: util.format.apply(this, arr),
      actual: false,
      expected: true,
      operator: '==',
      stackStartFunction: assert
    });
    this[level](err);
    throw err;
  }
}


var ensureNewlineEnabled = false;
var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
function ensureNewline(){
  if(fd !== 1 && fd !== 2){ return; }
  streamSpy.enable();
  ensureNewlineEnabled = true;
  return debugLogger;
}

function merge(object, source){
  Object.keys(source).forEach(function(key){
    var val = source[key];
    
    if(!object[key] || !isObject(val)){
      object[key] = val;
      return;
    }
    Object.keys(val).forEach(function(idx){
      object[key][idx] = val[idx];
    });
  });
}

function getLogLevel(namespace) {
  if(!process.env.DEBUG_LEVEL) {
    return 0;
  }
  var debugLevel = process.env.DEBUG_LEVEL.toLowerCase();
  if(debugLevel.indexOf('*:') === 0){
    return hasLogLevel(debugLevel.slice(2)) || 0;
  }
  var hasLevel = hasLogLevel(debugLevel);
  if(hasLevel !== null){
    return hasLevel;
  }
  if(!namespace) {
    return 0;
  }
  //currently we will only process the first part of namespace
  var appNamespace = namespace.split(':')[0].toLowerCase();
  
  var debugLevelParts = debugLevel.split(',');
  
  var i;
  for(i = 0; i < debugLevelParts.length; i++){
    var parts = debugLevelParts[i].split(':');
    if(appNamespace === parts[0]){
      return hasLogLevel(parts[parts.length-1]) || 0;
    }
  }
  return 0;
}

function hasLogLevel(level) {
  if(!level) {
    return null;
  }
  if (!isNaN(level)){
    return level;
  }
  else if(isString(level) && exports.levels[level]){
    return exports.levels[level].level || 0;
  }
  return null;
}

function isString(str){
  return typeof str === 'string' || str instanceof String;
}

function isObject(obj){
  return typeof obj === 'object' || obj instanceof Object;
}

function hasFormattingElements(str){
  if(!str) { return false; }
  var res = false;
  ['%s', '%d', '%j', '%o'].forEach(function(elem){
    if(str.indexOf(elem) >= 0) { 
      res = true; 
    }
  });
  return res;
}

function getErrorMessage(e) {
  var errorStrings = ['' + e];

  if (typeof e === 'undefined') {
    return errorStrings;
  }
  if (e === null) {
    return errorStrings;
  }
  if (e instanceof Date) {
    return errorStrings;
  }
  if (e instanceof Error) {
    errorStrings[0] = e.toString();
    if (e.stack) {
      errorStrings[1] = 'Stack trace';
      errorStrings[2] = e.stack;
    }
    return errorStrings;
  }
  if (isObject(e)) {
    var inspection = util.inspect(e, exports.inspectOptions);
    if(inspection.length < 55){
      errorStrings[0] = inspection;
      return errorStrings;
    }
    if (typeof e.toString !== 'undefined') {
      errorStrings[0] = e.toString();
    }
    errorStrings[1] = 'Inspected object';
    errorStrings[2] = inspection;
  }

  return errorStrings;
}

function getForeColor(color){
  if(!isNaN(color)){
    return '\x1b[3' + color + 'm';
  }
  else if(exports.colors[color]){
    return '\x1b[3' + exports.colors[color] + 'm';
  }
  return color;
}

function disableColors(loggerLevel, disable){
  if(disable){
    loggerLevel.color = '';
    loggerLevel.reset = '';
    loggerLevel.inspectionHighlight = '';
  }
}

var debugInstances = {};
function getDebugInstance(namespace, color, fd){
  if(!debugInstances[namespace]){
    debugInstances[namespace] = vmDebug(namespace);
    if(fd === 1 && isNaN(parseInt(process.env.DEBUG_FD))){
      debugInstances[namespace].log = console.log.bind(console);
    }
    if(!isNaN(color)){
      debugInstances[namespace].color = color;
    }
  }
  return debugInstances[namespace]; 
}


function debugLogger(namespace) {
  var levels = exports.levels;
  var debugLoggers = { 'default': getDebugInstance.bind(this, namespace, '') };

  var logger = function(){
    debugLoggers['default']().apply(this, arguments);
  };
  logger.logLevel = getLogLevel(namespace);
  
  logger.timeLabels = {};
  logger.time = time;
  logger.timeEnd = timeEnd;
  logger.dir = dir;
  logger.assert = assert;
  
  Object.keys(levels).forEach(function(levelName) {
    var loggerNamespaceSuffix = levels[levelName].namespaceSuffix ? levels[levelName].namespaceSuffix : 'default';
    if(!debugLoggers[loggerNamespaceSuffix]){
      debugLoggers[loggerNamespaceSuffix] = getDebugInstance.bind(this, namespace + loggerNamespaceSuffix, levels[levelName].color, levels[levelName].fd);
    }
    var levelLogger = debugLoggers[loggerNamespaceSuffix];
    
    var initialized = false;

    function logFn() {
      if (logger.logLevel > logger[levelName].level) { return; }
      
      var levelLog = levelLogger();
      if(!levelLog.enabled) { return; }
      
      if(!initialized){
        initialized = true;
        disableColors(logger[levelName], !levelLog.useColors);
      }
      
      if (isString(arguments[0]) && hasFormattingElements(arguments[0])){
        arguments[0] = logger[levelName].color + levels[levelName].prefix + logger[levelName].reset + arguments[0];
        return levelLog.apply(this, arguments);
      }
      
      var selfArguments = arguments;
      var errorStrings = Object.keys(selfArguments).map(function(key){
        return getErrorMessage(selfArguments[key]);
      });
      var message = "";
      var inspections = "";
      
      var i, param;
      var n = 1;
      for(i=0; i<errorStrings.length; i++){
        param = errorStrings[i];
        message += i === 0 ? param[0] : ' ' + param[0];
        if (param.length > 1) {
          var highlightStack = param[1].indexOf('Stack') >= 0 ? logger[levelName].color : '';
          inspections += '\n' +
            logger[levelName].inspectionHighlight + '___' + param[1] + ' #' + n++ + '___' + logger[levelName].reset +'\n' +
            highlightStack + param[2] + logger[levelName].reset;
        }
      };
      
      levelLog(logger[levelName].color + levels[levelName].prefix + logger[levelName].reset + message + inspections);
    };

    function logNewlineFn() {
      if (streamSpy.lastCharacter !== '\n') {
        vmDebug.log('');
      }
      logFn.apply(logFn, arguments);
    };

    logger[levelName] = ensureNewlineEnabled ? logNewlineFn : logFn;
    logger[levelName].level = levels[levelName].level;
    logger[levelName].logger  = function(){ return levelLogger(); };
    logger[levelName].enabled = function(){ return logger.logLevel <= logger[levelName].level && levelLogger().enabled; };
    logger[levelName].color = getForeColor(levels[levelName].color);
    logger[levelName].reset = exports.colorReset;
    logger[levelName].inspectionHighlight = exports.styles.underline;
  });

  return logger;
}
