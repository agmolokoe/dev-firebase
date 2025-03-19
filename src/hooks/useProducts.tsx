
import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useProducts() {
  const [userId, setUserId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
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
      return true
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
      return false
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
      return true
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
      return false
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

  return {
    userId,
    products: filteredProducts,
    isLoading,
    error,
    stats: {
      totalProducts,
      totalValue,
      totalProfit,
      lowStockProducts
    },
    searchTerm,
    setSearchTerm,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
  }
}
