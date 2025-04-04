
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { ProductForm } from "./ProductForm"
import { formSchema } from "./ProductFormFields"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/supabase/types"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>
  onUpdate: (id: number, data: z.infer<typeof formSchema>) => Promise<void>
}

export const ProductDialog = memo(function ProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  onUpdate,
}: ProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => ({
      name: product?.name || "",
      description: product?.description || "",
      cost_price: product?.cost_price?.toString() || "",
      selling_price: product?.selling_price?.toString() || "",
      stock: product?.stock?.toString() || "0",
      category: product?.category || "",
      status: product?.status || "active",
      taxable: product?.taxable ?? false,
    }), [product])
  })
  
  // Get business ID on mount
  useEffect(() => {
    const getBusinessId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setBusinessId(session?.user?.id || null);
    };
    getBusinessId();
  }, []);
  
  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        description: product.description || "",
        cost_price: product.cost_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        stock: product.stock?.toString() || "0",
        category: product.category || "",
        status: product.status || "active",
        taxable: product.taxable ?? false,
      })
      setPreviewUrl(product.image_url || null)
    } else {
      form.reset({
        name: "",
        description: "",
        cost_price: "",
        selling_price: "",
        stock: "0",
        category: "",
        status: "active",
        taxable: false,
      })
      setPreviewUrl(null)
    }
  }, [product, open, form])
  
  const handleSetPreviewUrl = useCallback((url: string | null) => {
    setPreviewUrl(url);
  }, []);

  const handleSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      const formData = {
        ...values,
        image_url: previewUrl,
      }
      
      if (product) {
        await onUpdate(product.id, formData)
      } else {
        await onSubmit(formData)
      }
    } catch (error) {
      console.error("Error submitting product form:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [product, previewUrl, onSubmit, onUpdate, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10 flex flex-col overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-[#FFFFFF]">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-[#FFFFFF]/70">
            Fill in the product details below. Images will be uploaded automatically.
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          handleCreateProduct={async (values) => {
            await handleSubmit(values as any);
            return Promise.resolve();
          }}
          handleUpdateProduct={async (id, values) => {
            await onUpdate(Number(id), values as any);
            return Promise.resolve();
          }}
          handleDeleteProduct={() => Promise.resolve()}
          isDialogOpen={open}
          setIsDialogOpen={onOpenChange}
          selectedProduct={product as any}
          setSelectedProduct={() => {}}
          businessId={businessId}
        />
      </DialogContent>
    </Dialog>
  )
})
