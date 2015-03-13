var log = require('..')('myapp');

log.trace("goes to stdout!");
log.debug("goes to stdout!");
log.log("goes to stdout!");
log.info("goes to stdout!");
log.warn("goes to stderr");
log.error("goes to stderr");


var stdout = require('..').config({ levels: { warn: { fd: 1 }, error: { fd: 1 } } })('stdoutapp');

stdout.warn("goes to stdout!");
stdout.error("goes to stdout!");
