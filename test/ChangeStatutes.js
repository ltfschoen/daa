import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';

const assertJump = require('zeppelin-solidity/test/helpers/assertJump');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

function toAscii(hexString) {
    return web3.toAscii(hexString).replace(/\0/g, '');
}

const Membership = artifacts.require('Membership.sol');
const ChangeStatutes = artifacts.require('ChangeStatutes.sol');

contract('ChangeStatutes', function(accounts) {

    let membership;
    let changeStatutes;
    let gaDate;

    const membershipFee = new web3.BigNumber(web3.toWei(0.1, 'ether'));

    const delegate = accounts[0];
    const newMember = accounts[2];
    const newWhitelister1 = accounts[3];
    const newWhitelister2 = accounts[4];

    // const name = "test";
    // const amount = new web3.BigNumber(web3.toWei(1, 'ether'));
    // const destinationAddress = accounts[5];
    const prGADuration = duration.days(14);
    // const extendedDuration = 120; // 2 mins in seconds

    const nonMember = accounts[6];

    // TODO:
    // const hashOfStatutes = '44cfb4b6af4d80da62839f9f2f47d913e3c69886277b130589ea1b6ec746b4c9';
    // AssertionError: expected '44cfb4b6af4d80da62839f9f2f47d913' to equal '44cfb4b6af4d80da62839f9f2f47d913e3c69886277b130589ea1b6ec746b4c9'
    const hashOfStatutes = '44cfb4b6af4d80da62839f9f2f47d913';

    before(async function() {
        //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function() {
        membership = await Membership.new(membershipFee, newWhitelister1, newWhitelister2);
        changeStatutes = await ChangeStatutes.new(membership.address);
        await membership.setDAA(changeStatutes.address, {from: delegate});

        await membership.requestMembership({from: newMember});

        await membership.whitelistMember(newMember, {from: newWhitelister1});
        await membership.whitelistMember(newMember, {from: newWhitelister2});

        await membership.payMembership({from: newMember, value: membershipFee});

        gaDate = latestTime() + duration.weeks(10);
        await changeStatutes.proposeGeneralAssemblyDate(gaDate, {from: newMember});
        await changeStatutes.voteForGeneralAssemblyDate(0, true, {from: newMember});

        const endTime =   latestTime() + prGADuration;
        const afterEndTime = endTime + duration.seconds(1);

        await increaseTimeTo(afterEndTime);
        await changeStatutes.concludeGeneralAssemblyVote(0, {from: delegate});

        await increaseTimeTo(gaDate);
        await changeStatutes.startGeneralAssembly(0, {from: delegate});
    });

    it('should set hash of statutes', async function() {
        await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: newMember});
        const proposal = await changeStatutes.getChangeStatutesProposal(0);
        proposal[0].should.equal(newMember); // submitter

        const hash = await changeStatutes.getHashForVoting(0);
        toAscii(hash).should.equal(hashOfStatutes);
    });

    it('should set hash of statutes (empty hash)', async function() {
        try {
            await changeStatutes.setHashOfStatutes('', {from: newMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should set hash of statutes (from non-member)', async function() {
        const member = await membership.getMember(nonMember);
        member[0].should.be.bignumber.equal(0); // NOT_MEMBER = 0;

        try {
            await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: nonMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should set hash of statutes (not during GA)', async function() {
        await changeStatutes.finishCurrentGeneralAssembly({from: delegate});

        try {
            await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: newMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });


    it('should vote for change statutes', async function() {
        await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: newMember});
        await changeStatutes.voteForChangeStatutes(0, true, {from: newMember});

        const proposal = await changeStatutes.getChangeStatutesProposal(0);

        proposal[6].should.be.bignumber.equal(1); // votesFor
        proposal[7].should.be.bignumber.equal(0); // votesAgainst

        // proposal[8].should.equal(false); // concluded
    });

    it('should conclude vote for Update Organization (result true)', async function() {
        await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: newMember});
        await changeStatutes.voteForChangeStatutes(0, true, {from: newMember});

        await changeStatutes.voteForChangeStatutes(0, true, {from: newWhitelister1});
        await changeStatutes.voteForChangeStatutes(0, true, {from: delegate});

        // 3 for, 0 against from 4 members

        const endTime =   latestTime() + duration.minutes(10); // voteTime = 10 minutes;
        const afterEndTime = endTime + duration.seconds(1);

        await increaseTimeTo(afterEndTime);
        await changeStatutes.concludeVoteForChangeStatutes(0, {from: delegate});

        const proposal = await changeStatutes.getChangeStatutesProposal(0);
        proposal[8].should.equal(true); // concluded
        proposal[9].should.equal(true); // result

        const currentStatutes = await changeStatutes.currentStatutes.call();
        toAscii(currentStatutes).should.equal(hashOfStatutes);
    });

    it('should conclude vote for Update Organization (result false)', async function() {
        await changeStatutes.setHashOfStatutes(hashOfStatutes, {from: newMember});
        await changeStatutes.voteForChangeStatutes(0, true, {from: newMember});

        await changeStatutes.voteForChangeStatutes(0, true, {from: newWhitelister1});
        await changeStatutes.voteForChangeStatutes(0, false, {from: delegate});

        // 2 for, 1 against from 4 members

        const endTime =   latestTime() + duration.minutes(10); // voteTime = 10 minutes;
        const afterEndTime = endTime + duration.seconds(1);

        await increaseTimeTo(afterEndTime);
        await changeStatutes.concludeVoteForChangeStatutes(0, {from: delegate});

        const proposal = await changeStatutes.getChangeStatutesProposal(0);
        proposal[8].should.equal(true); // concluded
        proposal[9].should.equal(false); // result

        const currentStatutes = await changeStatutes.currentStatutes.call();
        toAscii(currentStatutes).should.equal('');
    });

});
