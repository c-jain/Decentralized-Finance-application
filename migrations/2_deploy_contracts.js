const ZastrinToken = artifacts.require("ZastrinToken");
const Bank = artifacts.require("Bank");

module.exports = function(deployer) {
  deployer.deploy(ZastrinToken, web3.utils.toWei('0.01', 'ether')).then(function(f) {
    return deployer.deploy(Bank, ZastrinToken.address, 0)
  });
};

