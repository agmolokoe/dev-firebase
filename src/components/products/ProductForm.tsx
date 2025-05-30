
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/supabase/types"
import { ProductDeleteAlert } from "./ProductDeleteAlert"
import { ProductFormFields, formSchema, FormValues } from "./ProductFormFields"
import { ProductPriceFields } from "./ProductPriceFields"
import { ProductImageSection } from "./ProductImageSection"
import { ProductStoreLink } from "./ProductStoreLink"

export interface ProductFormProps {
  product?: Product | null;
  handleCreateProduct: (values: FormValues) => Promise<void>;
  handleUpdateProduct: (id: number, values: FormValues) => Promise<void>;
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
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      cost_price: product?.cost_price || 0,
      selling_price: product?.selling_price || 0,
      stock: product?.stock || 0,
      description: product?.description || "",
      category: product?.category || "",
      status: (product?.status as "active" | "inactive") || "active",
      taxable: product?.taxable || false,
      image_url: product?.image_url || "",
    },
  })

  useEffect(() => {
    if (selectedProduct) {
      form.reset({
        name: selectedProduct.name,
        cost_price: selectedProduct.cost_price || 0,
        selling_price: selectedProduct.selling_price || 0,
        stock: selectedProduct.stock || 0,
        description: selectedProduct.description || "",
        category: selectedProduct.category,
        status: (selectedProduct.status as "active" | "inactive"),
        taxable: selectedProduct.taxable,
        image_url: selectedProduct.image_url || "",
      });
      setPreviewUrl(selectedProduct.image_url || null);
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
        image_url: "",
      });
      setPreviewUrl(null);
    }
  }, [selectedProduct, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Add image URL from preview if it exists
      if (previewUrl) {
        values.image_url = previewUrl;
      }
      
      if (product) {
        await handleUpdateProduct(product.id, values);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await handleCreateProduct(values);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      });
    }
  }

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await handleDeleteProduct(product.id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductImageSection 
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          isSubmitting={form.formState.isSubmitting}
        />
        
        <div className="space-y-6">
          <ProductFormFields form={form} />
          <ProductPriceFields form={form} />
        </div>
        
        {selectedProduct?.business_id && (
          <ProductStoreLink businessId={selectedProduct.business_id} />
        )}
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {product && (
            <ProductDeleteAlert
              onDelete={handleDelete}
              isDisabled={form.formState.isSubmitting}
            />
          )}
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 
              "Saving..." : 
              product ? "Update" : "Create"
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
