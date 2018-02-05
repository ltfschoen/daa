/**
 * Migration script for DAA
 */
const cnf                   = require('../cnf.json');
const Membership            = artifacts.require("./Membership.sol");
const ExtraordinaryGA       = artifacts.require('ExtraordinaryGA.sol');
const SimpleProposals       = artifacts.require('SimpleProposals.sol');
const Discharge             = artifacts.require('Discharge.sol');
const DelegateCandidacy     = artifacts.require('DelegateCandidacy.sol');
const ExpelMember           = artifacts.require('ExpelMember.sol');
const Dissolution           = artifacts.require('Dissolution.sol');
const ChangeStatutes        = artifacts.require('ChangeStatutes.sol');
const UpdateOrganization    = artifacts.require('UpdateOrganization.sol');
const DAA                   = artifacts.require("./DAA.sol");

module.exports = async function(deployer, network, accounts) {
    if (network === 'rinkeby' || network === 'mainnet') {
        console.log('Truffle migration is for local dev environment only!');
        console.log('For TestNet / MeinNet deployment, please use the provided NPM run scripts');
        process.exit(1);
    }

    const membershipFee = cnf.membershipFee;

    await deployer.deploy(Membership, membershipFee, accounts[1], accounts[2]);
    const membershipInstance = await Membership.deployed();

    await deployer.deploy(ExtraordinaryGA, membershipInstance.address);
    const extraordinaryGAInstance = await ExtraordinaryGA.deployed();

    await deployer.deploy(SimpleProposals, membershipInstance.address);
    const simpleProposalsInstance = await SimpleProposals.deployed();

    await deployer.deploy(Discharge, membershipInstance.address, extraordinaryGAInstance.address);
    const dischargeInstance = await Discharge.deployed();

    await deployer.deploy(DelegateCandidacy, membershipInstance.address, extraordinaryGAInstance.address);
    const delegateCandidacyInstance = await DelegateCandidacy.deployed();

    await deployer.deploy(ExpelMember, membershipInstance.address);
    const expelMemberInstance = await ExpelMember.deployed();

    await deployer.deploy(Dissolution, membershipInstance.address, extraordinaryGAInstance.address);
    const dissolutionInstance = await Dissolution.deployed();

    await deployer.deploy(ChangeStatutes, membershipInstance.address, extraordinaryGAInstance.address);
    const changeStatutesInstance = await ChangeStatutes.deployed();

    await deployer.deploy(UpdateOrganization, membershipInstance.address, extraordinaryGAInstance.address);
    const updateOrganizationInstance = await UpdateOrganization.deployed();

    await deployer.deploy(DAA, extraordinaryGAInstance.address, simpleProposalsInstance.address, dischargeInstance.address,
        delegateCandidacyInstance.address, expelMemberInstance.address, dissolutionInstance.address,
        changeStatutesInstance.address, updateOrganizationInstance.address);
};
