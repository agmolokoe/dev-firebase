
import { useCallback, memo } from "react"
import { Form } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductFormFields } from "./ProductFormFields"
import { ProductImageSection } from "./ProductImageSection"
import { ProductShareSection } from "./ProductShareSection"
import { ProductStoreLink } from "./ProductStoreLink"
import { ProductDialogActions } from "./ProductDialogActions"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./ProductFormFields"
import { useTenant } from "@/middleware/TenantMiddleware"

// Define proper TypeScript interfaces
export interface Product {
  id: number
  name: string
  description: string | null
  cost_price: number
  selling_price: number
  stock: number
  image_url?: string | null
  business_id: string
}

interface ProductFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
  product: Product | null
  previewUrl: string | null
  setPreviewUrl: (url: string | null) => void
  isSubmitting: boolean
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  onOpenChange: (open: boolean) => void
  businessId: string | null
}

export const ProductForm = memo(function ProductForm({
  form,
  product,
  previewUrl,
  setPreviewUrl,
  isSubmitting,
  onSubmit,
  onOpenChange,
  businessId
}: ProductFormProps) {
  // Get tenant information for more context-aware rendering
  const { currentTenantId, isAdmin } = useTenant();
  
  // Determine which business ID to use - important for admin impersonation mode
  const effectiveBusinessId = businessId || currentTenantId;
  
  const handleFormSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  }, [onSubmit]);

  return (
    <ScrollArea className="flex-1 overflow-auto pr-4">
      <Form {...form}>
        <form className="space-y-4">
          <ProductImageSection 
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            isSubmitting={isSubmitting}
          />
          
          <ProductFormFields form={form} />

          {product && (
            <ProductShareSection product={product} />
          )}
          
          {effectiveBusinessId && (
            <ProductStoreLink businessId={effectiveBusinessId} />
          )}
          
          {/* Add additional context for admin users */}
          {isAdmin && product && product.business_id !== currentTenantId && (
            <div className="mt-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-yellow-300 text-sm">
              <p>
                <strong>Admin Notice:</strong> You are editing a product that belongs to another business.
                Any changes will affect their store.
              </p>
            </div>
          )}
        </form>
      </Form>
      
      <ProductDialogActions
        isSubmitting={isSubmitting}
        onOpenChange={onOpenChange}
        form={form}
        onSubmit={handleFormSubmit}
        isEditMode={!!product}
      />
    </ScrollArea>
  )
})
