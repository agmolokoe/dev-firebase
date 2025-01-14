import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { ProductImageUpload } from "./ProductImageUpload"
import { ProductPriceFields } from "./ProductPriceFields"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  cost_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Cost price must be a non-negative number",
  }),
  selling_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Selling price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  image: z.any().optional(),
})

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

  const costPrice = Number(form.watch("cost_price")) || 0
  const sellingPrice = Number(form.watch("selling_price")) || 0
  const profit = sellingPrice - costPrice

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
      <DialogContent className="sm:max-w-[425px] bg-[#000000] text-[#FFFFFF] border-[#FFFFFF]/10">
        <DialogHeader>
          <DialogTitle className="text-[#FFFFFF]">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-[#FFFFFF]/70">
            Fill in the product details below. Images will be uploaded automatically.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <ProductImageUpload
                previewUrl={previewUrl}
                onImageUpload={setPreviewUrl}
                disabled={isSubmitting}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#FFFFFF]">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Product name" 
                      {...field}
                      className="bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FE2C55]" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#FFFFFF]">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product description"
                      {...field}
                      className="bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FE2C55]" />
                </FormItem>
              )}
            />

            <ProductPriceFields form={form} profit={profit} />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#FFFFFF]">Stock</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      className="bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#FE2C55]" />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
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
                type="submit" 
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}