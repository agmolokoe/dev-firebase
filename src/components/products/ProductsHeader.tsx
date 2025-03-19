
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProductsHeaderProps {
  onAddProduct: () => void
}

export function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF]">Products</h1>
      <Button onClick={onAddProduct}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  )
}
