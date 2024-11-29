import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {useEffect} from "react";
import {useProductStore} from "@/app/utils/useProductStore";

interface ProductDetailsProps {
    productID: string
}

export function ProductDetails({productID}: ProductDetailsProps) {
    const {getProductHistory, productHistory, products} = useProductStore();

    const product = products.find(p => p.productID === productID);

    useEffect(() => {
        if (productID) {
            getProductHistory(productID);
        }
    }, [productID]);

    if (!productID || !productHistory) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">ID:</h3>
                    <p>{product?.productID}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Origin:</h3>
                    <p>{product?.origin}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Status:</h3>
                    <p>{product?.status}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Creator:</h3>
                    <p className="break-all">{product?.actor}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Current Holder:</h3>
                    <p className="break-all">{product?.currentHolder}</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Product History</h3>
                <Table>
                    <TableHeader>
                    <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Updated By</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productHistory.map((status, index) => {
                            // @ts-ignore
                            const updatedBy = status.updatedBy._hex ? ethers.utils.getAddress(status.updatedBy) : status.updatedBy;
                            const timestamp = status.timestamp._hex ? new Date(parseInt(status.timestamp._hex, 16) * 1000).toLocaleString() : status.timestamp;

                            return (
                                <TableRow key={index}>
                                    <TableCell>{status.status}</TableCell>
                                    <TableCell className="break-all">{updatedBy}</TableCell>
                                    <TableCell>{timestamp}</TableCell>
                                    <TableCell>{status.location || product?.origin}</TableCell>
                                    <TableCell>{status.actor}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

