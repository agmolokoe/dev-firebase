import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductDialog } from "@/components/products/ProductDialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0)
  const totalProducts = products.length
  const lowStockProducts = products.filter((product) => (product.stock || 0) < 10).length

  const handleCreateProduct = async (productData: any) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          stock: Number(productData.stock),
        }])
      
      if (error) throw error
      
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: "Success",
        description: "Product created successfully",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async (id: number, productData: any) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          stock: Number(productData.stock),
        })
        .eq('id', id)
      
      if (error) throw error
      
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF]">Products</h1>
          <Button onClick={() => {
            setSelectedProduct(null)
            setIsDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

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

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#FFFFFF]/60" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
          />
        </div>

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
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-[#FFFFFF]">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-[#FFFFFF]/10">
                    <TableCell className="text-[#FFFFFF]">{product.name}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{product.description}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-[#FFFFFF]">{product.stock}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsDialogOpen(true)
                        }}
                        className="text-[#25F4EE] hover:text-[#25F4EE]/90 hover:bg-[#FFFFFF]/5"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
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

        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={selectedProduct}
          onSubmit={handleCreateProduct}
          onUpdate={handleUpdateProduct}
        />
      </div>
    </DashboardLayout>
  )
}
