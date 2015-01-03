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


debugLogger.levels.info.color = debugLogger.getForeColor('cyan');
debugLogger.levels.debug.color = debugLogger.getBackColor('magenta') + debugLogger.getForeColor('white');
var customColorLog = require('../debug-logger')('myapp');
customColorLog.info("I'm a 'cyan' info output");
customColorLog.debug("I'm a 'magenta'/'white' debug output");

debugLogger.inspectOptions = { colors: true };  // Check http://nodejs.org/api/util.html#util_util_inspect_object_options
log.info('nice colored example:', { anumber: 1234, astring: 'str', adate: new Date(), aboolean: true });
