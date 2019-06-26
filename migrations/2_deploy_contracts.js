const TokenGenerator = artifacts.require("TokenGenerator");
module.exports = function(deployer) {
  deployer.deploy(TokenGenerator, 1000);
};
