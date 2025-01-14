import { useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductDialog } from "@/components/products/ProductDialog"
import { ProductStats } from "@/components/products/ProductStats"
import { ProductList } from "@/components/products/ProductList"
import { ProductSearch } from "@/components/products/ProductSearch"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

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

  // Calculate total value and total profit
  const totalValue = products.reduce((sum, product) => 
    sum + (product.cost_price * (product.stock || 0)), 0
  )
  const totalProfit = products.reduce((sum, product) => 
    sum + ((product.selling_price - product.cost_price) * (product.stock || 0)), 0
  )
  const totalProducts = products.length
  const lowStockProducts = products.filter((product) => (product.stock || 0) < 10).length

  const handleCreateProduct = async (productData: any) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          cost_price: Number(productData.cost_price),
          selling_price: Number(productData.selling_price),
          stock: Number(productData.stock),
          image_url: productData.image_url,
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
          cost_price: Number(productData.cost_price),
          selling_price: Number(productData.selling_price),
          stock: Number(productData.stock),
          image_url: productData.image_url,
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

        <ProductStats
          totalProducts={totalProducts}
          totalValue={totalValue}
          totalProfit={totalProfit}
          lowStockProducts={lowStockProducts}
        />

        <ProductSearch
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <ProductList
          products={filteredProducts}
          isLoading={isLoading}
          onEdit={(product) => {
            setSelectedProduct(product)
            setIsDialogOpen(true)
          }}
          onDelete={handleDeleteProduct}
        />

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