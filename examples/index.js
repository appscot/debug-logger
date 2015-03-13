var log = require('..')('myapp');

// The below only shows up if environment variable DEBUG includes "myapp:*" namespace
log.trace("I'm a trace output");
log.debug("I'm a debug output");
log.log("I'm a log output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");


console.log();
var debugLogger = require('..');
if (log.debug.enabled()) {
  // This only runs if environment variable DEBUG includes "myapp:debug" or "myapp:*" namespace
  log.debug("Debug is enabled, let's inspect 'debugLogger.levels':", debugLogger.levels);
} else {
  console.log("Debug is disabled, please add 'myapp:debug' namespace to DEBUG environment variable");
  console.log("e.g.: export DEBUG=$DEBUG,myapp:debug");
}


console.log();
var err = new Error('error message');
err.stack = 'the stack\nline2\nline3';
log.error('Something failed:', err);


console.log();
log.warn("You can use log.<level>(err) and the stack trace is printed on the level's color");
log.warn(err);


console.log();
log.log("Multiple", "arguments", "including", "objects:", { obj: 'obj'}, "makes life easier");
log.warn("util.format style string: %s, number: %d and json: %j.", "foo", 13, { obj: 'json'});


console.log();
log('the root/default debug instance');
log.info.logger()("the info instance of debug, using 'myapp:info' namespace");
// debugLogger.debug references the debug module, e.g.: debugLogger.debug == require('debug')
var debug = debugLogger.debug('myapp:visionmedia');
debug('nothing tastes better than the original!');


console.log();
debugLogger.levels.error.color = debugLogger.colors.magenta;
debugLogger.levels.error.prefix = 'ERROR ';
var customColorLog = debugLogger('myapp');
customColorLog.error("I'm a 'magenta' error output");


console.log();
debugLogger.inspectOptions = {
  colors : true
};
// Check http://nodejs.org/api/util.html#util_util_inspect_object_options
log.info('By enabling colors we get this nice colored example:', {
  anumber : 1234,
  astring : 'str',
  adate : new Date(),
  aboolean : true
});


console.log();
debugLogger.levels.silly = {
  color : debugLogger.colors.magenta,
  prefix : 'SILLY ',
  namespaceSuffix : ':silly',
  level : 0
};
var sillyLog = debugLogger('myapp');
sillyLog.info("Is silly logger enabled? " + sillyLog.silly.enabled());
if(sillyLog.silly.enabled()){
  sillyLog.silly("I'm a silly output");
} else {
  console.log("Silly is disabled, please add 'myapp:silly' namespace to DEBUG environment variable");
  console.log("e.g.: export DEBUG=$DEBUG,myapp:silly");
}


console.log();
var alwaysPrintAtStartOfLineLog = debugLogger.config({ ensureNewline: true })('myapp');
process.stdout.write('Some text without a line break');
alwaysPrintAtStartOfLineLog.warn('from the start');


if (!log.error.enabled()) {
  // This only runs if environment variable DEBUG includes "myapp:*" namespace
  console.log("\nYou probably haven't seen much because some loggers are disabled");
  console.log("Please add 'myapp:*' namespace to DEBUG environment variable and try again");
  console.log("e.g.: export DEBUG=$DEBUG,myapp:*");
} else if(log.log.enabled()) {
  console.log("\nNow set DEBUG_LEVEL environment variable to warn and run this example again");
  console.log("e.g.: export DEBUG_LEVEL=warn");
}
console.log();

