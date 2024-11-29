"use client"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useAppStore} from "@/app/utils/useAppStore";
import {RolesEnum} from "@/app/utils/Enums";
import { useRouter } from 'next/navigation'


export default function Home() {
    const {name, setName, selectedRole, setSelectedRole} = useAppStore()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();  // Prevents page refresh
        router.push('/dashboard');
    };


    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Login to Supply Chain Dashboard</h1>
                <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select
                    className="w-full p-2 border rounded"
                    value={selectedRole?.toString()}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    required
                >
                    <option value="">Select Role</option>
                    <option value={RolesEnum.SUPPLIER_ROLE}>Supplier</option>
                    <option value={RolesEnum.MANUFACTURER_ROLE}>Manufacturer</option>
                    <option value={RolesEnum.LOGISTICS_ROLE}>Logistics Provider</option>
                    <option value={RolesEnum.RETAILER_ROLE}>Retailer</option>
                </select>
                <Button className="w-full" type='submit'>Login</Button>
            </form>
        </div>
    )
}


