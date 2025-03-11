
import { useState } from "react";

type ProductImagesProps = {
  imageUrl?: string | null;
  productName: string;
};

export function ProductImages({ imageUrl, productName }: ProductImagesProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="aspect-square bg-accent/10 rounded-lg overflow-hidden border">
      {imageUrl && !imageError ? (
        <img 
          src={imageUrl} 
          alt={productName} 
          className="w-full h-full object-contain" 
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      )}
    </div>
  );
}
