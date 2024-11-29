"use client"

import {useState} from 'react'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ProductDetails} from "@/app/screens/productDetails";

export function ProductTracking() {
    const [productId, setProductId] = useState('')


    return (
        <div>
            <div className="flex gap-4 mb-4">
                <Input
                    type="text"
                    placeholder="Enter Product ID"
                    value={productId}
                    onChange={(e: any) => setProductId(e.target.value)}
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => setProductId(productId)}>Track Product</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Product Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about the product and its history.
                            </DialogDescription>
                        </DialogHeader>
                        <ProductDetails productID={productId}/>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

