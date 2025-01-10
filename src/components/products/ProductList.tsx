import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

type Product = {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
}

type ProductListProps = {
  products: Product[]
  isLoading: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductList({ products, isLoading, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="rounded-md border border-[#FFFFFF]/10">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FFFFFF]/10">
            <TableHead className="text-[#FFFFFF]">Name</TableHead>
            <TableHead className="text-[#FFFFFF]">Description</TableHead>
            <TableHead className="text-[#FFFFFF]">Price</TableHead>
            <TableHead className="text-[#FFFFFF]">Stock</TableHead>
            <TableHead className="text-right text-[#FFFFFF]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-[#FFFFFF]">
                Loading...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-[#FFFFFF]">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="border-[#FFFFFF]/10">
                <TableCell className="text-[#FFFFFF]">{product.name}</TableCell>
                <TableCell className="text-[#FFFFFF]">{product.description}</TableCell>
                <TableCell className="text-[#FFFFFF]">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-[#FFFFFF]">{product.stock}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(product)}
                    className="text-[#25F4EE] hover:text-[#25F4EE]/90 hover:bg-[#FFFFFF]/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(product.id)}
                    className="text-[#FE2C55] hover:text-[#FE2C55]/90 hover:bg-[#FFFFFF]/5"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}