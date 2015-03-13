// The below only shows up if environment variable DEBUG includes "myapp:*" namespace
// e.g.: export DEBUG=$DEBUG,myapp:*
var log = require('..')('myapp');

var count = 5;
console.log('count: %d', count);
log.log('count: %d', count);

br();
count++;
console.info('count:', count, '...');
log.info('count:', count, '...');

br();
count++;
console.error('count: %d', count);
log.error('count: %d', count);

br();
console.warn('plain message');
log.warn('plain message');

br();
console.dir({ foo: { bar: 1 } }, { depth: 0 });
log.dir({ foo: { bar: 1 } }, { depth: 0 });

br();
console.time('100-elements');
log.time('100-elements');
for (var i = 0; i < 100; i++) {
  ;
}
console.timeEnd('100-elements');
log.timeEnd('100-elements');

br();
count++;
// log.trace accepts similar input as console.log but it behaves more like log4j's TRACE as it prints a finer level of events
console.trace('count: %d', count);
log.trace('count: %d', count);

br();
try{
  console.assert(1 == 0, 'Wrong value');
} catch(err){}
try{
  log.assert(1 == 0, 'Wrong value');
} catch(err){}



br();
function br(){
  console.log();
}
