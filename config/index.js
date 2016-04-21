/*
 * Inspired of https://github.com/cbumgard/node-boot
 * Load the good config file of the environment based on the NODE_ENV variable
 * Else load the development.js config file
 */
var config, config_file;

config_file = './' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') + '.js';

try {
    config = require(config_file);
} catch (error) {
    if (error.code && error.code === 'MODULE_NOT_FOUND') {
        console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
        process.exit(1);
    } else {
        throw error;
    }
}

module.exports = config;
