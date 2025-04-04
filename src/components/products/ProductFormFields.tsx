
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { Sparkles } from "lucide-react"

// Export the form schema so it can be reused
export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  cost_price: z.number(),
  selling_price: z.number(),
  stock: z.number(),
  description: z.string().optional(),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive"]),
  taxable: z.boolean().default(false),
  image_url: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

interface ProductFormFieldsProps {
  form: UseFormReturn<FormValues>
}

export function ProductFormFields({ form }: ProductFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Product name" 
                  {...field} 
                  className="pl-3 focus:border-[#25F4EE] transition-all duration-300"
                />
                {field.value && field.value.length >= 2 && (
                  <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#25F4EE] animate-pulse" />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Product description" 
                {...field} 
                className="min-h-[100px] focus:border-[#25F4EE] transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input 
                placeholder="Category" 
                {...field} 
                className="focus:border-[#25F4EE] transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="focus:border-[#25F4EE] focus:ring-[#25F4EE] transition-all duration-300">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active" className="hover:bg-[#25F4EE]/10 cursor-pointer">Active</SelectItem>
                <SelectItem value="inactive" className="hover:bg-[#FE2C55]/10 cursor-pointer">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Image URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="Image URL" 
                {...field} 
                value={field.value || ''} 
                className="focus:border-[#25F4EE] transition-all duration-300"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
