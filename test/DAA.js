import {advanceBlock} from './helpers/advanceToBlock';

const assertJump = require('zeppelin-solidity/test/helpers/assertJump');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Membership = artifacts.require('Membership.sol');
var DAA = artifacts.require("./DAA.sol");

contract('DAA', function(accounts) {

    let membership;
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
        daa = await DAA.new(membership.address);
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
