import dotenv from 'dotenv';
import path from 'path';

console.debug = (...args) => {
  console.log.apply(this, args);
};

require('console-stamp')(console, {
  pattern : 'dd/mm/yyyy HH:MM:ss.l',
  extend  : { debug: 5 },
  include : [ 'info', 'debug', 'error' ],
  level   : 'debug'
});

dotenv.config({
  path : path.join(__dirname, `./.env`)
});

const DEBUG = process.env.DEBUG || 'true';
console.info('process.env.DEBUG:', process.env.DEBUG);
console.info('DEBUG:', DEBUG);
if (DEBUG == 'false') {
  // console.info('--step here--');
  // if (!window.console) window.console = {};
  var methods = [ 'debug', 'warn' ];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function() {};
  }
}
