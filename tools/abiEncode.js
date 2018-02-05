/**
 * ABIencode constructor parameters for contract verification
 * @TODO: Implement dynamic address retrieval (currently only hardcoded addresses used)
 */

require('babel-register');
require('babel-polyfill');

import cnf from '../cnf.json';
import abi from 'ethereumjs-abi';
import {logger as log} from './logger';

// =============================================

// uint256 _fee, address _whitelister1, address _whitelister2
let parameterTypes    = ['uint256', 'address', 'address'];
let parametersRinkeby = [
    cnf.membershipFee,
    cnf.network.rinkeby.whitelister1,
    cnf.network.rinkeby.whitelister2
];

let bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('Membership:');
log.info(bin.toString('hex'));

// =============================================

// address _membership
parameterTypes    = ['address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('ExtraordinaryGA:');
log.info(bin.toString('hex'));

// =============================================

// address _membership
parameterTypes    = ['address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('SimpleProposals:');
log.info(bin.toString('hex'));

// =============================================

// address _membership, address _extraordinaryGA
parameterTypes    = ['address', 'address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71',
    '0x3E9e2871091dE041213005FB89b89d08740e80f0'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('Discharge:');
log.info(bin.toString('hex'));

// =============================================

// address _membership, address _extraordinaryGA
parameterTypes    = ['address', 'address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71',
    '0x3E9e2871091dE041213005FB89b89d08740e80f0'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('DelegateCandidacy:');
log.info(bin.toString('hex'));

// =============================================

// address _membership
parameterTypes    = ['address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('ExpelMember:');
log.info(bin.toString('hex'));

// =============================================

// address _membership, address _extraordinaryGA
parameterTypes    = ['address', 'address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71',
    '0x3E9e2871091dE041213005FB89b89d08740e80f0'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('Dissolution:');
log.info(bin.toString('hex'));

// =============================================

// address _membership, address _extraordinaryGA
parameterTypes    = ['address', 'address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71',
    '0x3E9e2871091dE041213005FB89b89d08740e80f0'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('ChangeStatutes:');
log.info(bin.toString('hex'));

// =============================================

// address _membership, address _extraordinaryGA
parameterTypes    = ['address', 'address'];
parametersRinkeby = [
    '0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71',
    '0x3E9e2871091dE041213005FB89b89d08740e80f0'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('UpdateOrganization:');
log.info(bin.toString('hex'));

// =============================================

// address _extraordinaryGA, address _simpleProposals, address _discharge, address _delegateCandidacy,
// address _expelMember, address _dissolution, address _changeStatutes, address _updateOrganization
parameterTypes    = ['address', 'address', 'address', 'address', 'address', 'address', 'address', 'address'];
parametersRinkeby = [
    '0x3E9e2871091dE041213005FB89b89d08740e80f0',
    '0xcb1d124546CcD00dEBEF81E1676EE7E2fae2A31E',
    '0xf2D332E88B79A3E1Db55D0C88880cc3cD26884d2',
    '0x63B1363F93a5cc023Ffba403F52CdD2B651d6c0D',
    '0x1C447F84F6D027B48C9b9871C1fc80E6781d332d',
    '0xA0AE24d2EDCe7273C7aC817a478f0f9171d21848',
    '0xfAC394758F16DEC3CE2Aac2b4bC008fd927B35f2',
    '0xE1b6e41513e319a21e06655890621ef5436C8BC9'
];

bin = abi.rawEncode(parameterTypes, parametersRinkeby);

log.info('DAA:');
log.info(bin.toString('hex'));

// =============================================

// 16:36:15.843 INFO  [ deploy ] Membership: https://rinkeby.etherscan.io/address/0x8Beb72b73FF5751Bb9160B634Ad9ad059AE4DE71
// 16:36:15.844 INFO  [ deploy ] ExtraordinaryGA: https://rinkeby.etherscan.io/address/0x3E9e2871091dE041213005FB89b89d08740e80f0
// 16:36:15.844 INFO  [ deploy ] SimpleProposals: https://rinkeby.etherscan.io/address/0xcb1d124546CcD00dEBEF81E1676EE7E2fae2A31E
// 16:36:15.844 INFO  [ deploy ] Discharge: https://rinkeby.etherscan.io/address/0xf2D332E88B79A3E1Db55D0C88880cc3cD26884d2
// 16:36:15.844 INFO  [ deploy ] DelegateCandidacy: https://rinkeby.etherscan.io/address/0x63B1363F93a5cc023Ffba403F52CdD2B651d6c0D
// 16:36:15.844 INFO  [ deploy ] ExpelMember: https://rinkeby.etherscan.io/address/0x1C447F84F6D027B48C9b9871C1fc80E6781d332d
// 16:36:15.844 INFO  [ deploy ] Dissolution: https://rinkeby.etherscan.io/address/0xA0AE24d2EDCe7273C7aC817a478f0f9171d21848
// 16:36:15.845 INFO  [ deploy ] ChangeStatutes: https://rinkeby.etherscan.io/address/0xfAC394758F16DEC3CE2Aac2b4bC008fd927B35f2
// 16:36:15.845 INFO  [ deploy ] UpdateOrganization: https://rinkeby.etherscan.io/address/0xE1b6e41513e319a21e06655890621ef5436C8BC9
// 16:36:15.845 INFO  [ deploy ] DAA: https://rinkeby.etherscan.io/address/0xD37D0eCf6d0b021add9C1811Eed2AD651180e376
