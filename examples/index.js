var log = require('..')('myapp');

// The below only shows up if environment variable DEBUG includes "myapp" namespace
log.debug("I'm a debug output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");

console.log();
var debugLogger = require('..');
if (log.isDebugEnabled) {
  // This only runs if environment variable DEBUG includes "myapp:debug" namespace
  log.debug("Debug is enabled, let's inspect 'debugLogger.levels':", debugLogger.levels);
}

console.log();
var err = new Error('error message');
err.stack = 'the stack\nline2\nline3';
log.error('Something failed:', err);

console.log();
log.logger("the default instance of debug, using 'myapp' namespace");
log.debugLogger("the debug instance of debug, using 'myapp:debug' namespace");

console.log();
debugLogger.levels.error.color = debugLogger.getForeColor('magenta');
debugLogger.levels.debug.color = debugLogger.getBackColor('cyan') + debugLogger.getForeColor('white');
var customColorLog = debugLogger('myapp');
customColorLog.error("I'm a 'magenta' error output");
customColorLog.debug("I'm a 'cyan'/'white' debug output");

console.log();
debugLogger.inspectOptions = {
  colors : true
};
// Check http://nodejs.org/api/util.html#util_util_inspect_object_options
log.info('nice colored example:', {
  anumber : 1234,
  astring : 'str',
  adate : new Date(),
  aboolean : true
});

console.log();
debugLogger.levels.silly = {
  color : debugLogger.getForeColor('magenta'),
  prefix : 'SILLY  ',
  namespaceSuffix : ':silly'
};
var sillyLog = debugLogger('myapp');
sillyLog.info("Is silly logger enabled? " + sillyLog.loggers.silly.enabled);
// The below only shows up if environment variable DEBUG includes "myapp:silly" namespace
sillyLog.silly("I'm a silly output");

