debug-logger
============

A thin wrapper for visionmedia's debug logger

## Overview
[visionmedia/debug](https://github.com/visionmedia/debug) is a ubitiquous logging library with 1000+ dependants. Given how widespread it is and the convenience of namespaces it is a great logger for library modules.
`debug-logger` is a convenicence wrapper around `debug` that adds level based coloured output. Each instance of `debug-logger` contains 2 instances of `debug`, one for general purpose logging and another using `namespace:debug` for debug logs.

`debug-logger` is the logger [waterline-orientdb](https://github.com/appscot/waterline-orientdb).

## Instalation
```javascript
npm install debug-logger -S
```

## Usage
```javascript
var log = require('debug-logger')('myapp');

log.debug("I'm a debug output");
log.info("I'm an info output");
log.warn("I'm a warn output");
log.error("I'm an error output");

log.error('Something failed:', new Error('error message'));
```
More examples in the [examples folder](https://github.com/appscot/debug-logger/blob/master/examples/index.js).

## Methods
###### `log.debug(message, [Error|Object])`
###### `log.info(message, [Error|Object])`
###### `log.warn(message, [Error|Object])`
###### `log.error(message, [Error|Object])`
Prints the message prepended by log level. If the terminal supports colors, the level will be one of: blue, green, yellow, red. If an Error is provided, the toString() and call stack will be outputted. If an Object is provided the toString() and util.inspect() will be outputted. Example:
```
  myapp:debug DEBUG  I'm a debug output +0ms
  myapp       INFO   I'm an info output +1ms
```

## Properties
###### `log.logger`
Returns the default debug instance.

###### `log.debugLogger`
Returns the debug debug instance which was instanciated with "*provided_namespace*:debug".

###### `log.isEnabled`
Boolean indicating if default logger is enabled.

###### `log.isDebugEnabled`
Boolean indicating if debug logger is enabled.

