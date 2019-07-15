var EventManagement = artifacts.require("./EventManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(EventManagement);
};
