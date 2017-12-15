const Membership = artifacts.require("./Membership.sol");
const DAA = artifacts.require("./DAA.sol");

module.exports = function(deployer, network, accounts) {
    const membershipFee = 1000000;

    deployer.deploy(Membership, membershipFee, accounts[1], accounts[2]).then(function () {
        Membership.deployed().then(function (membershipInstance) {

            deployer.deploy(DAA, membershipInstance.address);

        });
    });

};
