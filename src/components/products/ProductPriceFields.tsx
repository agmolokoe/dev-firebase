import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"

type ProductPriceFieldsProps = {
  form: UseFormReturn<any>
  profit: number
}

export function ProductPriceFields({ form, profit }: ProductPriceFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cost_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#FFFFFF]">Cost Price (ZAR)</FormLabel>
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
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#FFFFFF]">Selling Price (ZAR)</FormLabel>
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
      </div>
      <div className="bg-[#FFFFFF]/5 p-3 rounded-md">
        <p className="text-sm text-[#FFFFFF]/70">Profit per unit:</p>
        <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          ZAR {profit.toFixed(2)}
        </p>
      </div>
    </>
  )
}