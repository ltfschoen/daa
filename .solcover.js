require('babel-register');
require('babel-polyfill');

module.exports = {
    port: 8555,
    copyNodeModules: true,
    norpc: true,
    testrpcOptions: '-p 8555'
};
