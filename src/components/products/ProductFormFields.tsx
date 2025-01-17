import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"

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
})

type ProductFormFieldsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>
}

export function ProductFormFields({ form }: ProductFormFieldsProps) {
  return (
    <>
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
        name="cost_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#FFFFFF]">Cost Price</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                step="0.01"
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
        name="selling_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#FFFFFF]">Selling Price</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...field}
                className="bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
              />
            </Control>
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
    </>
  )
}

export { formSchema }