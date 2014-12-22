debug-logger
============

A thin wrapper for visionmedia's debug logger

## Overview
[visionmedia/debug](https://github.com/visionmedia/debug) is a ubitiquous logging library with 1000+ dependants. Given how spreadily used it is and the convenience of namespaces it is a great logger for library modules.
`debug-logger` is a convenicence wrapper around `debug` that adds level based coloured output. Each instance of `debug-logger` contains 2 instances of `debug`, one for general purpose log and another using `namespace:debug` for debug logs.

## Example
```javascript
var log = require('debug-logger')('myapp');

log.debug("I'm a debug output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");
```

## Methods
#### `log.debug(message, [Error|Object])`
#### `log.debug(message, [Error|Object])`
#### `log.debug(message, [Error|Object])`
#### `log.debug(message, [Error|Object])`
