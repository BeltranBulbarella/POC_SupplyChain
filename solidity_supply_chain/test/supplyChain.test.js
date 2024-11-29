const SupplyChain = artifacts.require("supplyChain");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("supplyChain", accounts => {
    const [admin, supplier, manufacturer, logistics, retailer, consumer, unauthorized] = accounts;

    let supplyChain;

    before(async () => {
        supplyChain = await SupplyChain.deployed();

        // Assign roles
        await supplyChain.assignRole(web3.utils.keccak256("SUPPLIER_ROLE"), supplier, { from: admin });
        await supplyChain.assignRole(web3.utils.keccak256("MANUFACTURER_ROLE"), manufacturer, { from: admin });
        await supplyChain.assignRole(web3.utils.keccak256("LOGISTICS_ROLE"), logistics, { from: admin });
        await supplyChain.assignRole(web3.utils.keccak256("RETAILER_ROLE"), retailer, { from: admin });
        await supplyChain.assignRole(web3.utils.keccak256("CONSUMER_ROLE"), consumer, { from: admin });
    });

    it("should allow supplier to create a product", async () => {
        const receipt = await supplyChain.createProduct("PROD001", "New York", { from: supplier });
        const product = await supplyChain.getProduct("PROD001");

        assert.equal(product.productID, "PROD001", "Product ID mismatch");
        assert.equal(product.origin, "New York", "Product origin mismatch");
        assert.equal(product.currentHolder, supplier, "Current holder mismatch");
        assert.equal(product.status, "Created", "Initial status mismatch");

        // Check event
        const event = receipt.logs.find(log => log.event === "ProductCreated");
        assert.exists(event, "ProductCreated event should exist");
        assert.equal(event.args.productID, "PROD001", "Event productID mismatch");
        assert.equal(event.args.origin, "New York", "Event origin mismatch");
        assert.equal(event.args.supplier, supplier, "Event supplier mismatch");
    });

    it("should not allow unauthorized accounts to create a product", async () => {
        await expectRevert(
            supplyChain.createProduct("PROD002", "Los Angeles", { from: unauthorized }),
            "AccessControl: account " + unauthorized.toLowerCase() + " is missing role " + web3.utils.keccak256("SUPPLIER_ROLE")
        );
    });

    it("should allow manufacturer to update product status to 'Manufactured'", async () => {
        await supplyChain.createProduct("PROD003", "Chicago", { from: supplier });
        const receipt = await supplyChain.updateStatus("PROD003", "Manufactured", { from: manufacturer });
        const product = await supplyChain.getProduct("PROD003");

        assert.equal(product.status, "Manufactured", "Status update mismatch");
        assert.equal(product.currentHolder, manufacturer, "Current holder after update mismatch");

        // Check event
        const event = receipt.logs.find(log => log.event === "ProductStatusUpdated");
        assert.exists(event, "ProductStatusUpdated event should exist");
        assert.equal(event.args.productID, "PROD003", "Event productID mismatch");
        assert.equal(event.args.status, "Manufactured", "Event status mismatch");
        assert.equal(event.args.updater, manufacturer, "Event updater mismatch");
    });

    it("should not allow manufacturer to update status to 'In Transit'", async () => {
        await expectRevert(
            supplyChain.updateStatus("PROD003", "In Transit", { from: manufacturer }),
            "Caller is not Logistics Provider"
        );
    });

    it("should allow logistics to update product status to 'In Transit'", async () => {
        const receipt = await supplyChain.updateStatus("PROD003", "In Transit", { from: logistics });
        const product = await supplyChain.getProduct("PROD003");

        assert.equal(product.status, "In Transit", "Status update mismatch");
        assert.equal(product.currentHolder, logistics, "Current holder after update mismatch");

        // Check event
        const event = receipt.logs.find(log => log.event === "ProductStatusUpdated");
        assert.exists(event, "ProductStatusUpdated event should exist");
        assert.equal(event.args.productID, "PROD003", "Event productID mismatch");
        assert.equal(event.args.status, "In Transit", "Event status mismatch");
        assert.equal(event.args.updater, logistics, "Event updater mismatch");
    });

    it("should not allow unauthorized accounts to update product status", async () => {
        await expectRevert(
            supplyChain.updateStatus("PROD003", "Available for Sale", { from: unauthorized }),
            "Caller is not Retailer"
        );
    });

    it("should allow retailer to update product status to 'Available for Sale'", async () => {
        const receipt = await supplyChain.updateStatus("PROD003", "Available for Sale", { from: retailer });
        const product = await supplyChain.getProduct("PROD003");

        assert.equal(product.status, "Available for Sale", "Status update mismatch");
        assert.equal(product.currentHolder, retailer, "Current holder after update mismatch");

        // Check event
        const event = receipt.logs.find(log => log.event === "ProductStatusUpdated");
        assert.exists(event, "ProductStatusUpdated event should exist");
        assert.equal(event.args.productID, "PROD003", "Event productID mismatch");
        assert.equal(event.args.status, "Available for Sale", "Event status mismatch");
        assert.equal(event.args.updater, retailer, "Event updater mismatch");
    });

    it("should allow consumer to fetch product details", async () => {
        const product = await supplyChain.getProduct("PROD003");
        assert.equal(product.productID, "PROD003", "Product ID mismatch");
        assert.equal(product.origin, "Chicago", "Product origin mismatch");
        assert.equal(product.currentHolder, retailer, "Current holder mismatch");
        assert.equal(product.status, "Available for Sale", "Status mismatch");
    });

    it("should return product history correctly", async () => {
        const history = await supplyChain.getProductHistory("PROD003");
        assert.equal(history.length, 4, "History length mismatch");

        assert.equal(history[0].status, "Created", "First history status mismatch");
        assert.equal(history[0].updatedBy, supplier, "First history updater mismatch");

        assert.equal(history[1].status, "Manufactured", "Second history status mismatch");
        assert.equal(history[1].updatedBy, manufacturer, "Second history updater mismatch");

        assert.equal(history[2].status, "In Transit", "Third history status mismatch");
        assert.equal(history[2].updatedBy, logistics, "Third history updater mismatch");

        assert.equal(history[3].status, "Available for Sale", "Fourth history status mismatch");
        assert.equal(history[3].updatedBy, retailer, "Fourth history updater mismatch");
    });

    it("should prevent duplicate product creation", async () => {
        await expectRevert(
            supplyChain.createProduct("PROD001", "Houston", { from: supplier }),
            "Product already exists"
        );
    });
});

