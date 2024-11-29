"use client"

import {useState} from 'react'
import {useToast} from "@/hooks/use-toast"
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {ProductStatusEnum, RolesEnum} from "@/app/utils/Enums";
import {useAppStore} from "@/app/utils/useAppStore";
import {useProductStore} from "@/app/utils/useProductStore";

type TransactionSubmissionProps = {
    selectedRole: RolesEnum
}
export function TransactionSubmission({selectedRole}: TransactionSubmissionProps) {
    const [status, setStatus] = useState<ProductStatusEnum>(ProductStatusEnum.CREATED)
    const [productElements, setProductElements] = useState({
        productId: '',
        productName: '',
        origin: '',
        location: '',
        actor: ''
    })
    const {createProduct, updateProductStatus} = useProductStore();
    const {roles} = useAppStore();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedRole) {
            if (status === ProductStatusEnum.CREATED) {
                createProduct({
                        productID: productElements.productId,
                        productName: productElements.productName,
                        origin: productElements.origin,
                        location: productElements.location,
                        actor: productElements.actor
                    },
                    selectedRole,
                    roles
                )
            } else {
                updateProductStatus(productElements.productId, status, selectedRole, roles, productElements.location, productElements.actor)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                placeholder="Product ID"
                value={productElements.productId}
                onChange={(e) => setProductElements({...productElements, productId: e.target.value})}
                required
            />
            {selectedRole === RolesEnum.SUPPLIER_ROLE &&
            <Input
                type="text"
                placeholder="Product Name"
                value={productElements.productName}
                onChange={(e) => setProductElements({...productElements, productName: e.target.value})}
                required
            />
            }
            {selectedRole === RolesEnum.SUPPLIER_ROLE &&
                <Input
                    type="text"
                    placeholder="Origin"
                    value={productElements.origin}
                    onChange={(e) => setProductElements({...productElements, origin: e.target.value})}
                    required
                />
            }
            {selectedRole !== RolesEnum.SUPPLIER_ROLE && <Input
                type="text"
                placeholder="Location"
                value={productElements.location}
                onChange={(e) => setProductElements({...productElements, location: e.target.value})}
                required
            />
            }
            <Input
                type="text"
                placeholder="Actor"
                value={productElements.actor}
                onChange={(e) => setProductElements({...productElements, actor: e.target.value})}
                required
            />
            <Select value={status} onValueChange={setStatus as any} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select status"/>
                </SelectTrigger>
                <SelectContent>
                    {selectedRole === RolesEnum.SUPPLIER_ROLE && <SelectItem key={ProductStatusEnum.CREATED}
                                                                             value={ProductStatusEnum.CREATED.toString()}>{ProductStatusEnum.CREATED}</SelectItem>
                    }
                    {
                        selectedRole === RolesEnum.MANUFACTURER_ROLE && <SelectItem key={ProductStatusEnum.MANUFACTURED}
                                                                                    value={ProductStatusEnum.MANUFACTURED.toString()}>{ProductStatusEnum.MANUFACTURED}</SelectItem>
                    }
                    {
                        selectedRole === RolesEnum.LOGISTICS_ROLE && <SelectItem key={ProductStatusEnum.IN_TRANSIT}
                                                                                 value={ProductStatusEnum.IN_TRANSIT.toString()}>{ProductStatusEnum.IN_TRANSIT}</SelectItem>
                    }
                    {
                        selectedRole === RolesEnum.RETAILER_ROLE && <SelectItem key={ProductStatusEnum.AVAILABLE}
                                                                                value={ProductStatusEnum.AVAILABLE.toString()}>{ProductStatusEnum.AVAILABLE}</SelectItem>
                    }
                </SelectContent>
            </Select>
            <Button type="submit">Submit Transaction</Button>
        </form>
    )
}

