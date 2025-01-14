import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
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
import { Image, ImagePlus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
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
    price: number
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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url || null)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      stock: product?.stock?.toString() || "0",
    },
  })

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)
      
      if (error) throw error
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      
      setPreviewUrl(publicUrl)
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
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
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-[#FFFFFF]/20 rounded-lg overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Image className="w-8 h-8 text-[#FFFFFF]/40" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      await handleImageUpload(file)
                    }
                  }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
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
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#FFFFFF]">Price (ZAR)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="0.00"
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
                disabled={isSubmitting || uploadingImage}
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