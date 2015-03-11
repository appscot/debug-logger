/**
 * Make debug-logger behave like it did in v0.3.X
 */
var debugLogger = require('..').config({
  levels : {
    trace : {
      prefix :       'TRACE  '
    },
    debug : {
      prefix :       'DEBUG  '
    },
    log : {
      prefix : '      LOG    ',
      namespaceSuffix : null
    },
    info : {
      prefix : '      INFO   ',
      namespaceSuffix : null
    },
    warn : {
      prefix : '      WARN   ',
      namespaceSuffix : null
    },
    error : {
      prefix : '      ERROR  ',
      namespaceSuffix : null
    }
  }
});

var log = debugLogger('myapp');


// The below only shows up if environment variable DEBUG includes "myapp" namespace
log.trace("I'm a trace output");
log.debug("I'm a debug output");
log.log("I'm a log output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");


console.log();
debugLogger.levels.debug.color = '\x1b[4' + debugLogger.colors.cyan + 'm' + '\x1b[3' + debugLogger.colors.white + 'm';
var customColorLog = debugLogger('myapp');
customColorLog.debug("I'm a 'cyan'/'white' debug output");

console.log();
