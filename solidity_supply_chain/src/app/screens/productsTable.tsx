import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Product} from "@/app/utils/useProductStore";


export const ProductsTable = ({products}: {products: Product[]}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Origin</TableHead>
                    {/*<TableHead>Current holder</TableHead>*/}
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((status, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell>{status.productName}</TableCell>
                            <TableCell>{status.productID}</TableCell>
                            <TableCell className="break-all">{status.status}</TableCell>
                            <TableCell>{status.origin}</TableCell>
                            {/*<TableCell>{status.currentHolder}</TableCell>*/}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
