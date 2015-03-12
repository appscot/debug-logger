// Write to a file
// e.g.: node examples/file.js 3>debug.log
process.env.DEBUG_FD=3;

var log = require('..')('myapp');

log.info("I'm an info output");

br();
log.time('100-elements');
for (var i = 0; i < 100; i++) {
  ;
}
log.timeEnd('100-elements');

br();
log.time('setTimeout');
setTimeout(function(){
  var diff = log.timeEnd('setTimeout', 'debug');
  log.trace('log.timeEnd returns diff so it can be reused:', diff);
  br();
}, 262);



function br(){
  require('..').debug.log('');
}
