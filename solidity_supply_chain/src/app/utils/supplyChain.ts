import { ethers } from "ethers";
import SupplyChain from "../../../build/contracts/SupplyChain.json";

export const CONTRACT_ADDRESS = "0x3Cd77FD0C12D4d5dB8aDEc83E5446dCa32fb8c81"; // TODO: Replace with your contract address
export const ABI = SupplyChain.abi;

export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export const fetchProducts = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);

        // Connect to the contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // Fetch product count
        const productCount = await contract.getProductCount();

        if (productCount.eq(0)) {
            throw new Error("No products found in the contract.");
        }

        // Fetch all products
        const productList = [];
        for (let i = 0; i < productCount; i++) {
            const productID = await contract.getProductAtIndex(i);
            const product = await contract.getProduct(productID);
            console.log("Product:", product);
            productList.push({
                productID: product[0],
                origin: product[1],
                currentHolder: product[2],
                status: product[3],
                productName: product[4],
                actor: product[5],
            });
        }

        return productList;
    } catch (error: any) {
        console.error("Error fetching products:", error.message || error);
        throw error;
    }
};



