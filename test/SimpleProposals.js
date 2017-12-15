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
const SimpleProposals = artifacts.require('SimpleProposals.sol');

contract('SimpleProposals', function(accounts) {

    let membership;
    let simpleProposals;

    const membershipFee = new web3.BigNumber(web3.toWei(0.1, 'ether'));

    const delegate = accounts[0];
    const newMember = accounts[2];
    const newWhitelister1 = accounts[3];
    const newWhitelister2 = accounts[4];

    const name = "test";
    const amount = new web3.BigNumber(web3.toWei(1, 'ether'));
    const destinationAddress = accounts[5];
    const prDuration = duration.days(10);
    const extendedDuration = duration.days(1);
    const nonMember = accounts[6];

    before(async function() {
        //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function() {
        membership = await Membership.new(membershipFee, newWhitelister1, newWhitelister2);
        simpleProposals = await SimpleProposals.new(membership.address);
        await membership.setDAA(simpleProposals.address, {from: delegate});

        await membership.requestMembership({from: newMember});

        await membership.whitelistMember(newMember, {from: newWhitelister1});
        await membership.whitelistMember(newMember, {from: newWhitelister2});

        await membership.payMembership({from: newMember, value: membershipFee});
    });

    it('should submit proposal', async function() {
        /*
        const {
          logs
        } = await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });
        const event = logs.find(e => e.event === 'ProposalAdded');

        should.exist(event);
        event.args.proposalType.should.be.bignumber.equal(0);
        event.args.id.should.be.bignumber.equal(0);
        */

        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        const proposal = await simpleProposals.getSimpleProposal(0);
        proposal[0].should.equal(newMember); // submitter
        toAscii(proposal[1]).should.equal(name); // name
        proposal[2].should.be.bignumber.equal(amount); // amount
        proposal[3].should.equal(destinationAddress); // destinationAddress
        // proposal[4].should.be.bignumber.equal(startTime); // TODO: startTime
        proposal[5].should.be.bignumber.equal(prDuration); // duration
        proposal[6].should.be.bignumber.equal(0); // votesFor
        proposal[7].should.be.bignumber.equal(0); // votesAgainst
        proposal[8].should.equal(false); // concluded
        proposal[9].should.equal(false); // result
    });

    it('should submit proposal from non-member account', async function() {
        try {
            await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
                from: nonMember
            });
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should extend proposal duration', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        await simpleProposals.extendProposalDuration(0, extendedDuration, {
            from: newMember
        });

        const proposal = await simpleProposals.getSimpleProposal(0);
        proposal[5].minus(extendedDuration).should.be.bignumber.equal(prDuration);
    });

    it('should extend proposal duration from non-member account', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        try {
            await simpleProposals.extendProposalDuration(0, extendedDuration, {
                from: nonMember
            });
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should extend proposal duration from non-submitter (existing member) account', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        // TODO: whitelister is existing member ?
        try {
            await simpleProposals.extendProposalDuration(0, extendedDuration, {
                from: newWhitelister1
            });
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should extend proposal duration for more than 60 days', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        const extendedDuration2 = 5270400; // 61 days in seconds

        try {
            await simpleProposals.extendProposalDuration(0, extendedDuration2, {
                from: newMember
            });
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should vote for proposal', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        // TODO:
        // can delegate, whitelister, submitter vote?

        await simpleProposals.voteForProposal(0, true, {from: newMember});

        const proposal = await simpleProposals.getSimpleProposal(0);

        proposal[6].should.be.bignumber.equal(1); // votesFor
        proposal[7].should.be.bignumber.equal(0); // votesAgainst

        // proposal[8].should.equal(false); // concluded
    });

    it('should vote for proposal from non-member account', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        try {
            await simpleProposals.voteForProposal(0, true, {from: nonMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should vote twice from one account', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });

        await simpleProposals.voteForProposal(0, true, {from: newMember});

        try {
            await simpleProposals.voteForProposal(0, true, {from: newMember});
            assert.fail('should have thrown before');
        } catch (error) {
            assertJump(error);
        }
    });

    it('should conclude proposal', async function() {
        await simpleProposals.submitProposal(name, amount, destinationAddress, prDuration, {
            from: newMember
        });
        await simpleProposals.voteForProposal(0, true, {from: newMember});

        // sleep.sleep(duration);
        const endTime =   latestTime() + prDuration;
        const afterEndTime = endTime + duration.seconds(1);

        await increaseTimeTo(afterEndTime);
        await simpleProposals.concludeProposal(0, {from: delegate});

        const proposal = await simpleProposals.getSimpleProposal(0);

        proposal[8].should.equal(true); // concluded
        proposal[9].should.equal(true); // result
    });

});
