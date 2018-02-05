/**
 * Truffle configuration
 */

require('babel-register');
require('babel-polyfill');

const cnf = require('./cnf.json');

module.exports = {
    mocha: {
        useColors: true
    },
    solc: {
        optimizer: {
            enabled:    true,
            runs:       200
        }
    },
    networks: {
        develop: {
            host:       cnf.network.develop.host,
            port:       cnf.network.develop.port,
            network_id: cnf.network.develop.chainId,
            gas:        cnf.network.develop.gas,
            gasPrice:   cnf.network.develop.gasPrice
        },
        coverage: {
            host:       'localhost',
            network_id: 4447, // eslint-disable-line
            port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
            gas: 0xfffffffffff, // <-- Use this high gas value
            gasPrice: 0x01      // <-- Use this low gas price
        }
    }
};
