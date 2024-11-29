const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function (callback) {
    try {
        const supplyChain = await SupplyChain.deployed();
        const adminRole = await supplyChain.DEFAULT_ADMIN_ROLE();
        const supplierRole = await supplyChain.SUPPLIER_ROLE();
        const accounts = await web3.eth.getAccounts();

        const isAdmin = await supplyChain.hasRole(adminRole, accounts[0]); // True if the account is an admin
        const isSupplier = await supplyChain.hasRole(supplierRole, accounts[1]); // True if the account is a supplier
        console.log({isAdmin, isSupplier});
        callback();
    } catch (error) {
        console.error("Error checking roles:", error);
        callback(error);
    }
};
