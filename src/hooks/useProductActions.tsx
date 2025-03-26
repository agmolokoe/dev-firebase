
import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useProductActions(userId: string | null) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleCreateProduct = useCallback(async (productData: any) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to create products",
          variant: "destructive",
        })
        return false
      }

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
  }, [userId, toast, queryClient]);

  const handleUpdateProduct = useCallback(async (id: number, productData: any) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to update products",
          variant: "destructive",
        })
        return false
      }

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
        .eq('business_id', userId)
        .select()
      
      if (error) {
        console.error("Supabase error updating product:", error)
        throw error
      }
      
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
  }, [userId, toast, queryClient]);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to delete products",
          variant: "destructive",
        })
        return false
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('business_id', userId)
      
      if (error) {
        console.error("Supabase error deleting product:", error)
        throw error
      }
      
      await queryClient.invalidateQueries({ queryKey: ['products', userId] })
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
      return false
    }
  }, [userId, toast, queryClient]);

  return {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
  }
}
