
import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ProductImageUpload } from "./ProductImageUpload"
import { ProductFormFields, formSchema } from "./ProductFormFields"
import * as z from "zod"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      
      form.reset()
      setPreviewUrl(null)
      onOpenChange(false)
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
        
        <div className="flex-1 overflow-auto min-h-0">
          <Form {...form}>
            <form className="space-y-4 pr-3">
              <div className="flex justify-center mb-4">
                <ProductImageUpload
                  previewUrl={previewUrl}
                  onImageUpload={setPreviewUrl}
                  disabled={isSubmitting}
                />
              </div>
              
              <ProductFormFields form={form} />
            </form>
          </Form>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-[#FFFFFF]/10 mt-4 bg-black sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-[#FFFFFF] border-[#FFFFFF]/10 hover:bg-[#FFFFFF]/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : product ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
