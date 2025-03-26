
import { Product } from "./ProductForm"
import { ProductShareButton } from "./ProductShareButton"

interface ProductShareSectionProps {
  product: Product
}

export function ProductShareSection({ product }: ProductShareSectionProps) {
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
}
