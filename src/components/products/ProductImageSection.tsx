
import { memo, useCallback } from "react"
import { ProductImageUpload } from "./ProductImageUpload"

interface ProductImageSectionProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string) => void;
  isSubmitting: boolean;
}

export const ProductImageSection = memo(function ProductImageSection({ 
  previewUrl, 
  setPreviewUrl, 
  isSubmitting 
}: ProductImageSectionProps) {
  
  const handleImageUpload = useCallback((url: string) => {
    setPreviewUrl(url);
  }, [setPreviewUrl]);
  
  return (
    <div className="flex justify-center mb-4">
      <ProductImageUpload
        previewUrl={previewUrl}
        onImageUpload={handleImageUpload}
        disabled={isSubmitting}
      />
    </div>
  );
})
