require('babel-register');
require('babel-polyfill');

module.exports = {
    copyNodeModules: true,
    norpc: true,
    testrpcOptions: '--gasPrice 21 --gas 4712388 --port 8555'
};
