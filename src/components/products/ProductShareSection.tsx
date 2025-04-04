
import { memo } from "react"
import { Product } from "@/lib/supabase/types"
import { ProductShareButton } from "./ProductShareButton"

interface ProductShareSectionProps {
  product: Product
}

export const ProductShareSection = memo(function ProductShareSection({ product }: ProductShareSectionProps) {
  console.log("Rendering ProductShareSection for product:", product.id)
  
  return (
    <div className="border-t border-[#FFFFFF]/10 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#FFFFFF]">Share Product</h3>
        <ProductShareButton product={product} />
      </div>
      <p className="text-xs text-[#FFFFFF]/50 mt-1">
        Share this product on social media or via direct link
      </p>
    </div>
  )
})
