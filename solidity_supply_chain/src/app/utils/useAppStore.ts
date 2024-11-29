import {create} from "zustand";
import { ethers } from "ethers";
import {CONTRACT_ADDRESS, LOCAL_RPC_URL} from "@/app/utils/supplyChain";
import {RolesEnum} from "@/app/utils/Enums";

interface AppState {
    roles: Record<string, string>;
    setRoles: () => void;
    selectedRole: RolesEnum | null;
    setSelectedRole: (role: RolesEnum) => void;
    fetchedRoles: boolean;
    contractAddress: string;
    adminWallet: string;
    rolesLoading: boolean;
    name: string;
    setName: (name: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    roles: {},
    setRoles: async () => {
        set({rolesLoading: true});
        try {
            const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
            // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

            // const adminRole = await contract.DEFAULT_ADMIN_ROLE();
            const accounts = await provider.listAccounts();

            // const roles = {
            //     SUPPLIER_ROLE: await contract.SUPPLIER_ROLE(),
            //     MANUFACTURER_ROLE: await contract.MANUFACTURER_ROLE(),
            //     LOGISTICS_ROLE: await contract.LOGISTICS_ROLE(),
            //     RETAILER_ROLE: await contract.RETAILER_ROLE(),
            //     CONSUMER_ROLE: await contract.CONSUMER_ROLE(),
            // };
            // console.log('roles', roles)

            const roleAccounts = {
                SUPPLIER_ROLE: accounts[1],
                MANUFACTURER_ROLE: accounts[2],
                LOGISTICS_ROLE: accounts[3],
                RETAILER_ROLE: accounts[4],
                CONSUMER_ROLE: accounts[5],
            };
            //
            // for (const [role, account] of Object.entries(roleAccounts)) {
            //     // @ts-ignore
            //     const hasRole = await contract.hasRole(roles[role], account);
            //     if (!hasRole) {
            //         // @ts-ignore
            //         await contract.assignRole(roles[role], account);
            //     }
            // }
            set({roles: roleAccounts, contractAddress: CONTRACT_ADDRESS, adminWallet: accounts[0], fetchedRoles: true, rolesLoading: false});
        } catch (error) {
            console.error("Error initializing roles:", error);
        }
    },
    selectedRole: null,
    setSelectedRole: (role) => set({selectedRole: role}),
    fetchedRoles: false,
    contractAddress: CONTRACT_ADDRESS,
    adminWallet: "",
    rolesLoading: false,
    name: "",
    setName: (name) => set({name}),
    logout: () => set({name: "", selectedRole: null}),
}));
