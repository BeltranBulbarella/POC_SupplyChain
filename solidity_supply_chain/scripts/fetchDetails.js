const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function(callback) {
    try {
        const supplyChain = await SupplyChain.deployed();
        const adminRole = await supplyChain.DEFAULT_ADMIN_ROLE();
        const accounts = await web3.eth.getAccounts();

        console.log("Contract Address:", supplyChain.address);
        console.log("Admin Wallet (accounts[0]):", accounts[0]);

        const isAdmin = await supplyChain.hasRole(adminRole, accounts[0]);
        console.log("Is accounts[0] admin?:", isAdmin);

        // Define roles
        const roles = {
            SUPPLIER_ROLE: await supplyChain.SUPPLIER_ROLE(),
            MANUFACTURER_ROLE: await supplyChain.MANUFACTURER_ROLE(),
            LOGISTICS_ROLE: await supplyChain.LOGISTICS_ROLE(),
            RETAILER_ROLE: await supplyChain.RETAILER_ROLE(),
            CONSUMER_ROLE: await supplyChain.CONSUMER_ROLE(),
        };

        // Assign accounts to roles
        const roleAccounts = {
            SUPPLIER_ROLE: accounts[1],
            MANUFACTURER_ROLE: accounts[2],
            LOGISTICS_ROLE: accounts[3],
            RETAILER_ROLE: accounts[4],
            CONSUMER_ROLE: accounts[5],
        };

        // Assign roles to accounts
        for (const [role, account] of Object.entries(roleAccounts)) {
            await supplyChain.assignRole(roles[role], account);
            console.log(`Assigned ${role} to account: ${account}`);
        }

        console.log("Contract Address:", supplyChain.address);
        console.log("Admin Wallet (accounts[0]):", accounts[0]);


        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};
