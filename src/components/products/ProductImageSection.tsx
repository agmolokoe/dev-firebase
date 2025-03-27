
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
  console.log("Rendering ProductImageSection. Has image:", !!previewUrl)
  
  const handleImageUpload = useCallback((url: string) => {
    console.log("Image uploaded:", url.substring(0, 50) + "...")
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
