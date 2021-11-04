import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'test';

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
  let methods = [ 'debug', 'warn' ];
  for (let i = 0; i < methods.length; i++) {
    console[methods[i]] = function() {};
  }
}

const configs = {
  base : {
    env,
    name : process.env.APP_NAME || 'kiki-did',
    host : process.env.APP_HOST || '0.0.0.0',
    port : 3303
  },
  test : {
    port : 4012
  }
};

export const config = Object.assign(configs.base, configs[env]);

