/**
 * ABIencode constructor parameters for contract verification
 */

require('babel-register');
require('babel-polyfill');

import cnf from '../cnf.json';
import abi from 'ethereumjs-abi';
import {logger as log} from './logger';

// uint256 _fee, address _whitelister1, address _whitelister2
const parameterTypes    = ['uint256', 'address', 'address'];
const parametersRinkeby = [
    cnf.membershipFee,
    cnf.network.rinkeby.whitelister1,
    cnf.network.rinkeby.whitelister2
];

const parametersMainNet = [
    cnf.membershipFee,
    cnf.network.mainnet.whitelister1,
    cnf.network.mainnet.whitelister2
];

const rinkeby   = abi.rawEncode(parameterTypes, parametersRinkeby);
const mainnet   = abi.rawEncode(parameterTypes, parametersMainNet);

log.info('Rinkeby:');
log.info(rinkeby.toString('hex'));
log.info('===================================');
log.info('MainNet:');
log.info(mainnet.toString('hex'));
