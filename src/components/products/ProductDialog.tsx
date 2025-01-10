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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      stock: product?.stock?.toString() || "0",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      if (product) {
        await onUpdate(product.id, values)
      } else {
        await onSubmit(values)
      }
      form.reset()
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
                disabled={isSubmitting}
                className="bg-[#FE2C55] text-[#FFFFFF] hover:bg-[#FE2C55]/90"
              >
                {product ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
