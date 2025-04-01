
import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useProductActions(userId: string | null, isAdmin: boolean = false) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleCreateProduct = useCallback(async (productData: any) => {
    try {
      console.log("Creating new product:", productData)
      console.time("createProduct")
      
      if (!userId) {
        console.error("Cannot create product: No authenticated user")
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
      
      console.log("Product created successfully:", data?.[0]?.id)
      await queryClient.invalidateQueries({ queryKey: ['products', userId] })
      
      toast({
        title: "Success",
        description: "Product created successfully",
      })
      console.timeEnd("createProduct")
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
      console.log(`Updating product ${id}:`, productData)
      console.time("updateProduct")
      
      if (!userId) {
        console.error("Cannot update product: No authenticated user")
        toast({
          title: "Error",
          description: "You must be logged in to update products",
          variant: "destructive",
        })
        return false
      }

      // For admins, we allow updating products of other businesses
      let query = supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          cost_price: Number(productData.cost_price),
          selling_price: Number(productData.selling_price),
          stock: Number(productData.stock),
          image_url: productData.image_url,
        })
        .eq('id', id);
      
      // If not admin, must check business_id
      if (!isAdmin) {
        query = query.eq('business_id', userId);
      }
      
      const { error, data } = await query.select();
      
      if (error) {
        console.error("Supabase error updating product:", error)
        throw error
      }
      
      console.log("Product updated successfully")
      
      // If we're an admin, potentially need to invalidate multiple queries
      if (isAdmin) {
        // Invalidate both the admin's view and the specific business's view
        await queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['products', userId] });
      }
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      console.timeEnd("updateProduct")
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
  }, [userId, toast, queryClient, isAdmin]);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      console.log(`Deleting product ${id}`)
      console.time("deleteProduct")
      
      if (!userId) {
        console.error("Cannot delete product: No authenticated user")
        toast({
          title: "Error",
          description: "You must be logged in to delete products",
          variant: "destructive",
        })
        return false
      }

      // For admins, we allow deleting products of other businesses
      let query = supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      // If not admin, must check business_id
      if (!isAdmin) {
        query = query.eq('business_id', userId);
      }
      
      const { error } = await query;
      
      if (error) {
        console.error("Supabase error deleting product:", error)
        throw error
      }
      
      console.log("Product deleted successfully")
      
      // If we're an admin, potentially need to invalidate multiple queries
      if (isAdmin) {
        // Invalidate both the admin's view and the specific business's view
        await queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['products', userId] });
      }
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      console.timeEnd("deleteProduct")
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
  }, [userId, toast, queryClient, isAdmin]);

  return {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
  }
}
