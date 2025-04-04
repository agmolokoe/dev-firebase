import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTenant } from "@/middleware";
import { Product as ProductType } from "@/lib/supabase/types"

export type Product = ProductType;

const formSchema = z.object({
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
})

export interface ProductFormProps {
  product?: Product | null;
  handleCreateProduct: (values: z.infer<typeof formSchema>) => Promise<void>;
  handleUpdateProduct: (id: number, values: z.infer<typeof formSchema>) => Promise<void>;
  handleDeleteProduct: (id: number) => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export function ProductForm({
  product,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  isDialogOpen,
  setIsDialogOpen,
  selectedProduct,
  setSelectedProduct
}: ProductFormProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      cost_price: product?.cost_price || 0,
      selling_price: product?.selling_price || 0,
      stock: product?.stock || 0,
      description: product?.description || "",
      category: product?.category || "",
      status: product?.status || "active",
      taxable: product?.taxable || false,
    },
  })

  useEffect(() => {
    if (selectedProduct) {
      form.reset(selectedProduct);
    } else {
      form.reset({
        name: "",
        cost_price: 0,
        selling_price: 0,
        stock: 0,
        description: "",
        category: "",
        status: "active",
        taxable: false,
      });
    }
  }, [selectedProduct, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (product) {
      handleUpdateProduct(product.id, values)
        .then(() => {
          toast({
            title: "Success",
            description: "Product updated successfully",
          })
          setIsDialogOpen(false)
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update product",
            variant: "destructive",
          })
        })
    } else {
      handleCreateProduct(values)
        .then(() => {
          toast({
            title: "Success",
            description: "Product created successfully",
          })
          setIsDialogOpen(false)
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to create product",
            variant: "destructive",
          })
        })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="cost_price"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Cost Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Cost price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_price"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Selling price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Stock" {...field} />
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
                <Textarea placeholder="Product description" {...field} />
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
                <Input placeholder="Category" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Taxable</FormLabel>
                <FormDescription>
                  Determine whether the product is taxable
                </FormDescription>
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
        <div className="flex justify-end">
          {product && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDeleteProduct(product.id)
                        .then(() => {
                          toast({
                            title: "Success",
                            description: "Product deleted successfully",
                          })
                          setIsDialogOpen(false)
                        })
                        .catch((error) => {
                          toast({
                            title: "Error",
                            description: error.message || "Failed to delete product",
                            variant: "destructive",
                          })
                        })
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

type FormDescriptionProps = {
  children?: React.ReactNode
}

function FormDescription({ children }: FormDescriptionProps) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}
