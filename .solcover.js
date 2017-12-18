require('babel-register');
require('babel-polyfill');

module.exports = {
    copyNodeModules: true,
    norpc: true,
    testrpcOptions: '--gasPrice 21 --port 8555'
};
