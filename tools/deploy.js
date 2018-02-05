/**
 * Deployment script for Rinkeby and MainNet
 */

require('babel-register');
require('babel-polyfill');

import {logger as log} from './logger';
import cnf from '../cnf.json';
import Web3 from 'web3';

import * as MembershipModule from '../build/bundle/Membership.sol.js';
import * as ExtraordinaryGAModule from '../build/bundle/ExtraordinaryGA.sol.js';
import * as SimpleProposalsModule from '../build/bundle/SimpleProposals.sol.js';
import * as DischargeModule from '../build/bundle/Discharge.sol.js';
import * as DelegateCandidacyModule from '../build/bundle/DelegateCandidacy.sol.js';
import * as ExpelMemberModule from '../build/bundle/ExpelMember.sol.js';
import * as DissolutionModule from '../build/bundle/Dissolution.sol.js';
import * as ChangeStatutesModule from '../build/bundle/ChangeStatutes.sol.js';
import * as UpdateOrganizationModule from '../build/bundle/UpdateOrganization.sol.js';
import * as DAAModule from '../build/bundle/DAA.sol.js';

/**
 * Deployment procedure
 * @returns {void}
 */
async function deploy() {
    const network               = process.env.NODE_ENV;
    const subEsDom              = network === 'rinkeby' ? 'rinkeby.' : '';
    const provider              = `http://${cnf.network[network].host}:${cnf.network[network].port}`;
    const web3                  = new Web3(new Web3.providers.HttpProvider(provider));
    const from                  = cnf.network[network].from;

    log.info(`[ ${network} ]`);

    /**
     * Membership
     */
    log.info('Membership');
    const membershipContract  = new web3.eth.Contract(
        MembershipModule.MembershipAbi,
        null,
        {
            data:       MembershipModule.MembershipByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // uint256 _fee, address _whitelister1, address _whitelister2
    const membershipInstance = await membershipContract.deploy({
        data: MembershipModule.MembershipByteCode,
        arguments: [
            cnf.membershipFee,
            cnf.network[network].whitelister1,
            cnf.network[network].whitelister2
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    membershipContract.options.address = membershipInstance.options.address;

    /**
     * ExtraordinaryGA
     */
    log.info('ExtraordinaryGA');
    const extraordinaryGAContract  = new web3.eth.Contract(
        ExtraordinaryGAModule.ExtraordinaryGAAbi,
        null,
        {
            data:       ExtraordinaryGAModule.ExtraordinaryGAByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // log.warn(membershipContract.options.address);
    // address _membership
    const extraordinaryGAInstance = await extraordinaryGAContract.deploy({
        data: ExtraordinaryGAModule.ExtraordinaryGAByteCode,
        arguments: [
            membershipContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    extraordinaryGAContract.options.address = extraordinaryGAInstance.options.address;

    /**
     * SimpleProposals
     */
    log.info('SimpleProposals');
    const simpleProposalsContract  = new web3.eth.Contract(
        SimpleProposalsModule.SimpleProposalsAbi,
        null,
        {
            data:       SimpleProposalsModule.SimpleProposalsByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // uint256 proposalId
    const simpleProposalsInstance = await simpleProposalsContract.deploy({
        data: SimpleProposalsModule.SimpleProposalsByteCode,
        arguments: [
            membershipContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    simpleProposalsContract.options.address = simpleProposalsInstance.options.address;

    /**
     * Discharge
     */
    log.info('Discharge');
    const dischargeContract  = new web3.eth.Contract(
        DischargeModule.DischargeAbi,
        null,
        {
            data:       DischargeModule.DischargeByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership, address _extraordinaryGA
    const dischargeInstance = await dischargeContract.deploy({
        data: DischargeModule.DischargeByteCode,
        arguments: [
            membershipContract.options.address,
            extraordinaryGAContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    dischargeContract.options.address = dischargeInstance.options.address;

    /**
     * DelegateCandidacy
     */
    log.info('DelegateCandidacy');
    const delegateCandidacyContract  = new web3.eth.Contract(
        DelegateCandidacyModule.DelegateCandidacyAbi,
        null,
        {
            data:       DelegateCandidacyModule.DelegateCandidacyByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership, address _extraordinaryGA
    const delegateCandidacyInstance = await delegateCandidacyContract.deploy({
        data: DelegateCandidacyModule.DelegateCandidacyByteCode,
        arguments: [
            membershipContract.options.address,
            extraordinaryGAContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    delegateCandidacyContract.options.address = delegateCandidacyInstance.options.address;

    /**
     * ExpelMember
     */
    log.info('ExpelMember');
    const expelMemberContract  = new web3.eth.Contract(
        ExpelMemberModule.ExpelMemberAbi,
        null,
        {
            data:       ExpelMemberModule.ExpelMemberByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership
    const expelMemberInstance = await expelMemberContract.deploy({
        data: ExpelMemberModule.ExpelMemberByteCode,
        arguments: [
            membershipContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    expelMemberContract.options.address = expelMemberInstance.options.address;

    /**
     * Dissolution
     */
    log.info('Dissolution');
    const dissolutionContract  = new web3.eth.Contract(
        DissolutionModule.DissolutionAbi,
        null,
        {
            data:       DissolutionModule.DissolutionByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership, address _extraordinaryGA
    const dissolutionInstance = await dissolutionContract.deploy({
        data: DissolutionModule.DissolutionByteCode,
        arguments: [
            membershipContract.options.address,
            extraordinaryGAContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    dissolutionContract.options.address = dissolutionInstance.options.address;

    /**
     * ChangeStatutes
     */
    log.info('ChangeStatutes');
    const changeStatutesContract  = new web3.eth.Contract(
        ChangeStatutesModule.ChangeStatutesAbi,
        null,
        {
            data:       ChangeStatutesModule.ChangeStatutesByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership, address _extraordinaryGA
    const changeStatutesInstance = await changeStatutesContract.deploy({
        data: ChangeStatutesModule.ChangeStatutesByteCode,
        arguments: [
            membershipContract.options.address,
            extraordinaryGAContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    changeStatutesContract.options.address = changeStatutesInstance.options.address;

    /**
     * UpdateOrganization
     */
    log.info('UpdateOrganization');
    const updateOrganizationContract  = new web3.eth.Contract(
        UpdateOrganizationModule.UpdateOrganizationAbi,
        null,
        {
            data:       UpdateOrganizationModule.UpdateOrganizationByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _membership, address _extraordinaryGA
    const updateOrganizationInstance = await updateOrganizationContract.deploy({
        data: UpdateOrganizationModule.UpdateOrganizationByteCode,
        arguments: [
            membershipContract.options.address,
            extraordinaryGAContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    updateOrganizationContract.options.address = updateOrganizationInstance.options.address;

    /**
     * DAA
     */
    log.info('DAA');
    const daaContract  = new web3.eth.Contract(
        DAAModule.DAAAbi,
        null,
        {
            data:       DAAModule.DAAByteCode,
            from:       from,
            gas:        cnf.network[network].gas,
            gasPrice:   cnf.network[network].gasPrice
        }
    );

    // address _extraordinaryGA, address _simpleProposals, address _discharge, address _delegateCandidacy,
    // address _expelMember, address _dissolution, address _changeStatutes, address _updateOrganization
    const daaInstance = await daaContract.deploy({
        data: DAAModule.DAAByteCode,
        arguments: [
            extraordinaryGAContract.options.address,
            simpleProposalsContract.options.address,
            dischargeContract.options.address,
            delegateCandidacyContract.options.address,
            expelMemberContract.options.address,
            dissolutionContract.options.address,
            changeStatutesContract.options.address,
            updateOrganizationContract.options.address
        ]
    }).send({
        gas:        cnf.network[network].gas,
        gasPrice:   cnf.network[network].gasPrice,
        from: from
    }).catch((error) => {
        log.error('Exception thrown:');
        log.error(error);
    });

    daaContract.options.address = daaInstance.options.address;

    /*
     * Output
     */
    log.info(`Finished deployment on ${subEsDom} :)`);
    log.info(`Membership: https://${subEsDom}etherscan.io/address/${membershipContract.options.address}`);
    log.info(`ExtraordinaryGA: https://${subEsDom}etherscan.io/address/${extraordinaryGAContract.options.address}`);
    log.info(`SimpleProposals: https://${subEsDom}etherscan.io/address/${simpleProposalsContract.options.address}`);
    log.info(`Discharge: https://${subEsDom}etherscan.io/address/${dischargeContract.options.address}`);
    log.info(`DelegateCandidacy: https://${subEsDom}etherscan.io/address/${delegateCandidacyContract.options.address}`);
    log.info(`ExpelMember: https://${subEsDom}etherscan.io/address/${expelMemberContract.options.address}`);
    log.info(`Dissolution: https://${subEsDom}etherscan.io/address/${dissolutionContract.options.address}`);
    log.info(`ChangeStatutes: https://${subEsDom}etherscan.io/address/${changeStatutesContract.options.address}`);
    log.info(`UpdateOrganization: https://${subEsDom}etherscan.io/address/${updateOrganizationContract.options.address}`);
    log.info(`DAA: https://${subEsDom}etherscan.io/address/${daaContract.options.address}`);
}

/**
 * Sanity check and start deployment
 */
(async () => {
    if (process.env.NODE_ENV !== 'rinkeby' && process.env.NODE_ENV !== 'mainnet') {
        log.error('Network for deployment not found');
        process.exit(1);
    } else {
        deploy();
    }
})();
