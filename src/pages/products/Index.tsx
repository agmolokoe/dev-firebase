
import { useState, useEffect } from "react"
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
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Check user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUserId = session?.user?.id || null
        setUserId(currentUserId)
        
        if (!currentUserId) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view products",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking session:", error)
        toast({
          title: "Error",
          description: "Failed to verify authentication",
          variant: "destructive",
        })
      }
    }
    
    checkSession()
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUserId = session?.user?.id || null
      setUserId(currentUserId)
    })
    
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [toast])

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', userId],
    queryFn: async () => {
      if (!userId) return []
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        console.log("Products fetched:", data)
        return data || []
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
        return []
      }
    },
    enabled: !!userId,
  })

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to create products",
          variant: "destructive",
        })
        return
      }

      console.log("Creating product with business_id:", userId)
      console.log("Product data:", productData)

      const { error, data } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          cost_price: Number(productData.cost_price),
          selling_price: Number(productData.selling_price),
          stock: Number(productData.stock),
          image_url: productData.image_url,
          business_id: userId
        }])
        .select()
      
      if (error) {
        console.error("Supabase error creating product:", error)
        throw error
      }
      
      console.log("Product created successfully:", data)
      await queryClient.invalidateQueries({ queryKey: ['products', userId] })
      
      toast({
        title: "Success",
        description: "Product created successfully",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async (id: number, productData: any) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to update products",
          variant: "destructive",
        })
        return
      }

      console.log("Updating product ID:", id)
      console.log("Update data:", productData)

      const { error, data } = await supabase
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
        .eq('business_id', userId)
        .select()
      
      if (error) {
        console.error("Supabase error updating product:", error)
        throw error
      }
      
      console.log("Product updated successfully:", data)
      await queryClient.invalidateQueries({ queryKey: ['products', userId] })
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to delete products",
          variant: "destructive",
        })
        return
      }

      console.log("Deleting product ID:", id)

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('business_id', userId)
      
      if (error) {
        console.error("Supabase error deleting product:", error)
        throw error
      }
      
      console.log("Product deleted successfully")
      await queryClient.invalidateQueries({ queryKey: ['products', userId] })
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  // If we have an authentication error and no userId, show a message
  if (error && !userId) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Authentication Required</h2>
            <p className="text-[#FFFFFF]/70 mb-6">
              You need to be logged in to view and manage products.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
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

        {isLoading ? (
          <div className="text-center p-8">
            <p className="text-[#FFFFFF]/70">Loading products...</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            isLoading={isLoading}
            onEdit={(product) => {
              setSelectedProduct(product)
              setIsDialogOpen(true)
            }}
            onDelete={handleDeleteProduct}
          />
        )}

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
