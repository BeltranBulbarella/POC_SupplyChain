const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function (callback) {
    try {
        const supplyChain = await SupplyChain.deployed();
        const accounts = await web3.eth.getAccounts();

        // Define roles
        const roles = {
            SUPPLIER_ROLE: await supplyChain.SUPPLIER_ROLE(),
            MANUFACTURER_ROLE: await supplyChain.MANUFACTURER_ROLE(),
            LOGISTICS_ROLE: await supplyChain.LOGISTICS_ROLE(),
            RETAILER_ROLE: await supplyChain.RETAILER_ROLE(),
            CONSUMER_ROLE: await supplyChain.CONSUMER_ROLE(),
        };

        // Define accounts for roles
        const roleAccounts = {
            SUPPLIER_ROLE: accounts[1],
            MANUFACTURER_ROLE: accounts[2],
            LOGISTICS_ROLE: accounts[3],
            RETAILER_ROLE: accounts[4],
            CONSUMER_ROLE: accounts[5],
        };

        // Ensure each account has its role
        for (const [role, account] of Object.entries(roleAccounts)) {
            const hasRole = await supplyChain.hasRole(roles[role], account);
            if (!hasRole) {
                await supplyChain.assignRole(roles[role], account, { from: accounts[0] });
                console.log(`Assigned ${role} to account: ${account}`);
            }
        }

        // Define the products and their transitions
        const productTransitions = [
            {
                productID: "product_supplier",
                productName: "Widget A", // New field
                origin: "USA",
                location: "New York",  // New field
                actor: "Supplier Inc.", // New field
                transitions: ["Created"],
                role: "SUPPLIER_ROLE",
            },
            {
                productID: "product_manufacturer",
                productName: "Gadget B",
                origin: "Germany",
                location: "Berlin",
                actor: "Manufacturing GmbH",
                transitions: ["Created", "Manufactured"],
                role: "MANUFACTURER_ROLE",
            },
            {
                productID: "product_logistics",
                productName: "Device C",
                origin: "Japan",
                location: "Tokyo",
                actor: "Logistics Co.",
                transitions: ["Created", "Manufactured", "In Transit"],
                role: "LOGISTICS_ROLE",
            },
            {
                productID: "product_retailer",
                productName: "Tool D",
                origin: "France",
                location: "Paris",
                actor: "Retailer SA",
                transitions: ["Created", "Manufactured", "In Transit", "Available for Sale"],
                role: "RETAILER_ROLE",
            },
        ];

        // Process each product through its required transitions
        for (const product of productTransitions) {
            console.log(`Processing product: ${product.productID}`);

            // Create the product
            await supplyChain.createProduct(
                product.productID,
                product.productName,
                product.origin,
                product.location,
                product.actor,
                { from: roleAccounts.SUPPLIER_ROLE }
            );
            console.log(`Product created: ${product.productID}, Origin: ${product.origin}`);

            // Process each state transition
            for (const status of product.transitions) {
                let requiredRole = null;

                if (status === "Manufactured") requiredRole = "MANUFACTURER_ROLE";
                else if (status === "In Transit") requiredRole = "LOGISTICS_ROLE";
                else if (status === "Available for Sale") requiredRole = "RETAILER_ROLE";

                if (requiredRole) {
                    await supplyChain.updateStatus(
                        product.productID,
                        status,
                        product.location,
                        product.actor,
                        { from: roleAccounts[requiredRole] }
                    );
                    console.log(`Product updated: ${product.productID}, Status: ${status}`);
                }
            }
        }

        callback();
    } catch (error) {
        console.error("Error adding products:", error);
        callback(error);
    }
};


