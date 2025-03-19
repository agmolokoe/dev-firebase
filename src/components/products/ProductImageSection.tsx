
import { ProductImageUpload } from "./ProductImageUpload"

interface ProductImageSectionProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string) => void;
  isSubmitting: boolean;
}

export function ProductImageSection({ 
  previewUrl, 
  setPreviewUrl, 
  isSubmitting 
}: ProductImageSectionProps) {
  return (
    <div className="flex justify-center mb-4">
      <ProductImageUpload
        previewUrl={previewUrl}
        onImageUpload={setPreviewUrl}
        disabled={isSubmitting}
      />
    </div>
  );
}
