
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductFormFields, formSchema } from "./ProductFormFields"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { ProductImageSection } from "./ProductImageSection"
import { ProductShareSection } from "./ProductShareSection"
import { ProductStoreLink } from "./ProductStoreLink"
import { ProductDialogActions } from "./ProductDialogActions"

type ProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: {
    id: number
    name: string
    description: string | null
    cost_price: number
    selling_price: number
    stock: number
    image_url?: string | null
  } | null
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>
  onUpdate: (id: number, data: z.infer<typeof formSchema>) => Promise<void>
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  onUpdate,
}: ProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url || null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  
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
      })
      setPreviewUrl(product.image_url || null)
    } else {
      form.reset({
        name: "",
        description: "",
        cost_price: "",
        selling_price: "",
        stock: "0",
      })
      setPreviewUrl(null)
    }
  }, [product, open])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      cost_price: product?.cost_price?.toString() || "",
      selling_price: product?.selling_price?.toString() || "",
      stock: product?.stock?.toString() || "0",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
    } finally {
      setIsSubmitting(false)
    }
  }

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
        
        <ScrollArea className="flex-1 overflow-auto pr-4">
          <Form {...form}>
            <form className="space-y-4">
              <ProductImageSection 
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                isSubmitting={isSubmitting}
              />
              
              <ProductFormFields form={form} />

              {product && (
                <ProductShareSection product={product} />
              )}
              
              {businessId && (
                <ProductStoreLink businessId={businessId} />
              )}
            </form>
          </Form>
        </ScrollArea>
        
        <ProductDialogActions
          isSubmitting={isSubmitting}
          onOpenChange={onOpenChange}
          form={form}
          onSubmit={handleSubmit}
          isEditMode={!!product}
        />
      </DialogContent>
    </Dialog>
  )
}
