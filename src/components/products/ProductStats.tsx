import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type ProductStatsProps = {
  totalProducts: number
  totalValue: number
  lowStockProducts: number
}

export function ProductStats({ totalProducts, totalValue, lowStockProducts }: ProductStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-[#FFFFFF]/60">
            across all categories
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalValue)}
          </div>
          <p className="text-xs text-[#FFFFFF]/60">
            total stock value
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockProducts}</div>
          <p className="text-xs text-[#FFFFFF]/60">
            need attention
          </p>
        </CardContent>
      </Card>
    </div>
  )
}