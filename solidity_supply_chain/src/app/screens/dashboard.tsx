"use client"
import {useEffect, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {useAppStore} from "@/app/utils/useAppStore";
import {ProductTracking} from "@/app/screens/product-tracking";
import {TransactionSubmission} from "@/app/screens/transaction-submission";
import {RolesEnum} from "@/app/utils/Enums";
import {ProductsTable} from "@/app/screens/productsTable";
import {useRouter} from "next/navigation";
import {useProductStore} from "@/app/utils/useProductStore";

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('tracking')
    const {productsFetched, fetchProducts, products} = useProductStore();
    const {name, selectedRole, fetchedRoles, setRoles, logout} = useAppStore();
    const router = useRouter()

    useEffect(() => {
        if (!productsFetched) {
            fetchProducts();
        }
    }, [productsFetched]);

    useEffect(() => {
        if (!fetchedRoles) {
            setRoles();
        }
    }, [fetchedRoles]);

    const logoutUser = () => {
        logout()
        router.push('/')
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Welcome, {name}. With role: {selectedRole}</h1>
                <Button onClick={logoutUser}>Logout</Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="tracking">Product Tracking</TabsTrigger>
                    <TabsTrigger value="transaction">Transaction Submission</TabsTrigger>
                </TabsList>
                <TabsContent value="tracking" className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Tracking</CardTitle>
                            <CardDescription>Track products through the supply chain</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductTracking/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>All Products</CardTitle>
                            <CardDescription>See all products in the supply chain</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductsTable products={products}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="transaction">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Submission</CardTitle>
                            <CardDescription>Submit new transactions to the blockchain</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TransactionSubmission selectedRole={selectedRole as RolesEnum}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}


