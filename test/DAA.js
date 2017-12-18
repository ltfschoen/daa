import {advanceBlock} from './helpers/advanceToBlock';

const assertJump = require('zeppelin-solidity/test/helpers/assertJump');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Membership = artifacts.require('Membership.sol');

const ExtraordinaryGA = artifacts.require('ExtraordinaryGA.sol');
const SimpleProposals = artifacts.require('SimpleProposals.sol');
const Discharge = artifacts.require('Discharge.sol');
const DelegateCandidacy = artifacts.require('DelegateCandidacy.sol');
const ExpelMember = artifacts.require('ExpelMember.sol');
const Dissolution = artifacts.require('Dissolution.sol');
const ChangeStatutes = artifacts.require('ChangeStatutes.sol');
const UpdateOrganization = artifacts.require('UpdateOrganization.sol');

const DAA = artifacts.require("./DAA.sol");

contract('DAA', function(accounts) {

    let membership;

    let extraordinaryGA;
    let simpleProposals;
    let discharge;
    let delegateCandidacy;
    let expelMember;
    let dissolution;
    let changeStatutes;
    let updateOrganization;

    let daa;

    const membershipFee = new web3.BigNumber(web3.toWei(0.1, 'ether'));

    const delegate = accounts[0];
    const newMember = accounts[2];
    const newWhitelister1 = accounts[3];
    const newWhitelister2 = accounts[4];

    before(async function() {
        //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function() {
        membership = await Membership.new(membershipFee, newWhitelister1, newWhitelister2);

        extraordinaryGA = await ExtraordinaryGA.new(membership.address);
        simpleProposals = await SimpleProposals.new(membership.address);
        discharge = await Discharge.new(membership.address, extraordinaryGA.address);
        delegateCandidacy = await DelegateCandidacy.new(membership.address, extraordinaryGA.address);
        expelMember = await ExpelMember.new(membership.address);
        dissolution = await Dissolution.new(membership.address, extraordinaryGA.address);
        changeStatutes = await ChangeStatutes.new(membership.address, extraordinaryGA.address);
        updateOrganization = await UpdateOrganization.new(membership.address, extraordinaryGA.address);

        daa = await DAA.new(extraordinaryGA.address, simpleProposals.address, discharge.address, delegateCandidacy.address,
            expelMember.address, dissolution.address, changeStatutes.address, updateOrganization.address);

        await membership.setDAA(daa.address, {from: delegate});

        await membership.requestMembership({from: newMember});

        await membership.whitelistMember(newMember, {from: newWhitelister1});
        await membership.whitelistMember(newMember, {from: newWhitelister2});

        await membership.payMembership({from: newMember, value: membershipFee});
    });

    it('should test allMembersCount', async function() {
        const allMembersCount = await membership.getAllMembersCount();
        allMembersCount.should.be.bignumber.equal(4);
    });

});
