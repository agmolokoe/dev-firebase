
import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { ProductForm } from "./ProductForm"
import { formSchema, FormValues } from "./ProductFormFields"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/supabase/types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSubmit: (data: FormValues) => Promise<void>
  onUpdate: (id: number, data: FormValues) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  onUpdate,
  onDelete
}: ProductDialogProps) {
  const [businessId, setBusinessId] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Get business ID on mount
  useEffect(() => {
    const getBusinessId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setBusinessId(session?.user?.id || null);
    };
    getBusinessId();
  }, []);

  const handleCreateProduct = useCallback(async (values: FormValues) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "You must be logged in to create products",
        variant: "destructive",
      })
      return
    }
    
    try {
      await onSubmit(values)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    }
  }, [businessId, onSubmit, onOpenChange, toast])

  const handleUpdateProduct = useCallback(async (id: number, values: FormValues) => {
    if (!businessId) {
      toast({
        title: "Error",
        description: "You must be logged in to update products",
        variant: "destructive",
      })
      return
    }
    
    try {
      await onUpdate(id, values)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }, [businessId, onUpdate, onOpenChange, toast])

  const handleDeleteProduct = useCallback(async (id: number) => {
    if (!onDelete) return
    
    if (!businessId) {
      toast({
        title: "Error",
        description: "You must be logged in to delete products",
        variant: "destructive",
      })
      return
    }
    
    try {
      await onDelete(id)
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }, [businessId, onDelete, onOpenChange, toast])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below.
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          handleCreateProduct={handleCreateProduct}
          handleUpdateProduct={handleUpdateProduct}
          handleDeleteProduct={handleDeleteProduct}
          isDialogOpen={open}
          setIsDialogOpen={onOpenChange}
          selectedProduct={product}
          setSelectedProduct={() => {}}
          product={product}
        />
      </DialogContent>
    </Dialog>
  )
}
