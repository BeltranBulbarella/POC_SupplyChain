import {create} from "zustand";
import {ABI, CONTRACT_ADDRESS, fetchProducts, LOCAL_RPC_URL} from "@/app/utils/supplyChain";
import {ethers} from "ethers";
import {ProductStatusEnum} from "@/app/utils/Enums";
import {toast} from "@/hooks/use-toast";

export interface Product {
    productID: string;
    origin: string;
    currentHolder: string;
    status: ProductStatusEnum;
    productName: string;
    actor: string;
}

export interface ProductHistory {
    status: string;
    timestamp: any;
    updatedBy: string;
    location: string;
    actor: string;
}


export interface CreateProduct {
    productID: string
    productName: string
    origin: string
    location: string
    actor: string
}

interface ProductStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
    productsFetched: boolean;
    setProductsFetched: (fetched: boolean) => void;
    fetchProducts: () => Promise<void>;
    productsLoading: boolean;
    setProductsLoading: (loading: boolean) => void;
    createProduct: (product: CreateProduct, selectedRole: string, roles: Record<string, string>) => Promise<void>;
    getProductHistory: (productID: string) => Promise<void>
    productHistory: ProductHistory[];
    updateProductStatus: (productID: string, newStatus: ProductStatusEnum, selectedRole: string, roles: Record<string, string>, location: string, actor: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    setProducts: (products) => set({products}),
    productsFetched: false,
    setProductsFetched: (fetched) => set({productsFetched: fetched}),
    fetchProducts: async () => {
        set({productsLoading: true});
        try {
            const fetchedProducts = await fetchProducts();
            set({products: fetchedProducts, productsFetched: true, productsLoading: false});
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },
    productsLoading: false,
    setProductsLoading: (loading) => set({productsLoading: loading}),
    createProduct: async (product, selectedRole, roles) => {
        if (!selectedRole || selectedRole !== "SUPPLIER_ROLE") {
            alert("Only a supplier can create products!");
            return;
        }
        try {
            const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
            const signer = provider.getSigner(roles[selectedRole]);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.createProduct(product.productID, product.productName, product.origin, product.location, product.actor);
            await tx.wait();
            set({productsFetched: false});
            toast({
                title: "Transaction Submitted",
                description: `Product created}`,
                variant: 'success',
                className: "bg-green-100 text-green-800",
                position: 'top'
            })
            await fetchProducts();
        } catch (error: any) {
            console.error("Error creating product:", error);
            toast({
                title: "Transaction Failed",
                description: `Error updating product status: ${error.message}`,
                variant: 'destructive',
                className: "bg-red-100 text-red-800",
                position: 'top'
            })
        }
    },
    getProductHistory: async (product) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
            const history = await contract.getProductHistory(product);
            set({productHistory: history});
        } catch (error) {
            console.error("Error fetching product history:", error);
        }
    },
    productHistory: [],
    updateProductStatus: async (productID, newStatus, selectedRole, roles, location, actor) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
            const signer = provider.getSigner(roles[selectedRole]);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const tx = await contract.updateStatus(productID, newStatus, location, actor);
            await tx.wait();

            // Refresh the state
            set({productsFetched: false});
            toast({
                title: "Transaction Submitted",
                description: `Product status updated to ${newStatus}`,
                variant: 'success',
                className: "bg-green-100 text-green-800",
                position: 'top'
            })
            await fetchProducts();
        } catch (error: any) {
            console.error("Error updating product status:", error);
            toast({
                title: "Transaction Failed",
                description: `Error updating product status: ${error.message}`,
                variant: 'destructive',
                className: "bg-red-100 text-red-800",
                position: 'top'
            })
        }
    }
}));
