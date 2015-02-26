

/**
 * Hooking into Node.js stdout
 * Based on: https://gist.github.com/pguillory/729616 by @pguillory
 * 
 * @param {Object} callback
 */
function hook_stream(stream, callback) {
  var old_write = stream.write;

  stream.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(stream, arguments);
      callback(string, encoding, fd);
    };
  })(stream.write);

  return function() {
    stream.write = old_write;
  };
};


module.exports.lastCharacter = '\n';
function getLastCharacter(string, encoding, fd){
  module.exports.lastCharacter = string.slice(-1);
}

var unhook;
var unhookStderr;
module.exports.enable = function enable(){
  if(!unhook){
    unhook = hook_stream(process.stdout, getLastCharacter);
  }
  if(!unhookStderr){
    unhookStderr = hook_stream(process.stderr, getLastCharacter);
  }
};

module.exports.disable = function disable(){
  if(unhook){
    unhook();
    unhook = undefined;
  }
  if(unhookStderr){
    unhookStderr();
    unhookStderr = undefined;
  }
};
