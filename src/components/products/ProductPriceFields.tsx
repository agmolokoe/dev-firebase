
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./ProductFormFields"
import { useMemo } from "react"
import { AlertTriangle } from "lucide-react"

interface ProductPriceFieldsProps {
  form: UseFormReturn<FormValues>
}

export function ProductPriceFields({ form }: ProductPriceFieldsProps) {
  const costPrice = parseFloat(form.watch("cost_price") as unknown as string) || 0
  const sellingPrice = parseFloat(form.watch("selling_price") as unknown as string) || 0
  
  const profit = useMemo(() => {
    return sellingPrice - costPrice
  }, [costPrice, sellingPrice])

  const profitMargin = useMemo(() => {
    if (sellingPrice <= 0) return 0
    return (profit / sellingPrice) * 100
  }, [profit, sellingPrice])

  const isPriceError = useMemo(() => {
    return sellingPrice < costPrice
  }, [sellingPrice, costPrice])

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cost_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Cost price" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  className={isPriceError ? "border-destructive" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Selling price" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  className={isPriceError ? "border-destructive" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="bg-muted p-3 rounded-md">
        {isPriceError && (
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">Selling price should be greater than cost price</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">Profit per unit:</p>
        <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          ${profit.toFixed(2)} ({profitMargin.toFixed(0)}% margin)
        </p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Stock" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="taxable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Taxable</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Determine whether the product is taxable
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
