const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(SupplyChain);
    console.log("Contract deployed by:", accounts[0]);
};
