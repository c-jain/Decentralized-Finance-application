const TokenGenerator = artifacts.require("TokenGenerator");
const Bank = artifacts.require("Bank");

module.exports = function(deployer) {
  deployer.deploy(TokenGenerator).then(function(f) {
    return deployer.deploy(Bank, TokenGenerator.address)
  });
};

