var log = require('../debug-logger')('myapp');

log.debug("I'm a debug output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");


var debugLogger = require('../debug-logger');
if(log.isDebugEnabled){
  // This only runs if environment variable DEBUG includes "myapp:debug" namespace
  log.debug("Debug is enabled, let's inspect something:", debugLogger.levels);
}


var err = new Error('error message');
err.stack = 'the stack\nline2\nline3';
log.error('Something failed:', err);


log.logger('the default instance of debug, "using myapp" namespace');
log.debugLogger('the debug instance of debug, using "myapp:debug" namespace');


debugLogger.levels.info.color = '\x1b[31m';
var customColorLog = require('../debug-logger')('myapp');
customColorLog.info("I'm a RED info output");