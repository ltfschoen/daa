import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';

const assertJump = require('zeppelin-solidity/test/helpers/assertJump');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Membership = artifacts.require('Membership.sol');
const ExpelMember = artifacts.require('ExpelMember.sol');

contract('ExpelMember', function(accounts) {

    let membership;
    let expelMember;

    const membershipFee = new web3.BigNumber(web3.toWei(0.1, 'ether'));

    const delegate = accounts[0];
    const newMember = accounts[2];
    const newWhitelister1 = accounts[3];
    const newWhitelister2 = accounts[4];

    // const name = "test";
    // const amount = new web3.BigNumber(web3.toWei(1, 'ether'));
    // const destinationAddress = accounts[5];

    // const extendedDuration = 120; // 2 mins in seconds

    const nonMember = accounts[6];

    const memberToExpel = accounts[7];


    before(async function() {
        //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function() {
        membership = await Membership.new(membershipFee, newWhitelister1, newWhitelister2);
        expelMember = await ExpelMember.new(membership.address);
        await membership.setDAA(expelMember.address, {from: delegate});

        await membership.requestMembership({from: newMember});

        await membership.whitelistMember(newMember, {from: newWhitelister1});
        await membership.whitelistMember(newMember, {from: newWhitelister2});

        await membership.payMembership({from: newMember, value: membershipFee});


        await membership.requestMembership({from: memberToExpel});

        await membership.whitelistMember(memberToExpel, {from: newWhitelister1});
        await membership.whitelistMember(memberToExpel, {from: newWhitelister2});

        await membership.payMembership({from: memberToExpel, value: membershipFee});

    });

    it('should propose expel member', async function() {
        await expelMember.proposeExpelMember(memberToExpel, {from: newMember});
        const proposal = await expelMember.getExpelMemberProposal(0);
        proposal[0].should.equal(newMember); // submitter

        const m = await expelMember.getMemberToExpel(0);
        m.should.equal(memberToExpel);
    });

    it('should propose expel member (from non-member account)', async function() {
        try {
            await expelMember.proposeExpelMember(memberToExpel, {from: nonMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should propose expel member (empty address)', async function() {
        try {
            await expelMember.proposeExpelMember(0x0, {from: newMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });


    it('should vote to expel member', async function() {
        await expelMember.proposeExpelMember(memberToExpel, {from: newMember});
        await expelMember.voteToExpelMember(0, true, {from: newMember});

        const proposal = await expelMember.getExpelMemberProposal(0);

        proposal[6].should.be.bignumber.equal(1); // votesFor
        proposal[7].should.be.bignumber.equal(0); // votesAgainst

        // proposal[8].should.equal(false); // concluded
    });

    it('should conclude expel', async function() {
        await expelMember.proposeExpelMember(memberToExpel, {from: newMember});
        await expelMember.voteToExpelMember(0, true, {from: newMember});

        const endTime =   latestTime() + duration.weeks(1); // 1 weeks
        const afterEndTime = endTime + duration.seconds(1);

        await increaseTimeTo(afterEndTime);
        await expelMember.concludeExpel(0, {from: delegate});

        const proposal = await expelMember.getExpelMemberProposal(0);

        proposal[8].should.equal(true); // concluded
        proposal[9].should.equal(true); // result

        const member = await membership.getMember(memberToExpel);
        member[0].should.be.bignumber.equal(0); // EXISTING_MEMBER = 2;
        member[1].should.be.bignumber.equal(0); // whitelisted
        member[2].should.equal(false); // paid
    });

    it('should conclude expel (less than 10 % of all members have voted)', async function() {
        // TODO:

    });

    it('should conclude expel (less than ⅔ of those voters were in favor)', async function() {
        // TODO:

    });

});
