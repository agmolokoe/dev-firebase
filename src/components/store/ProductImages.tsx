
import { useState } from "react";
import { Image } from "lucide-react";

type ProductImagesProps = {
  imageUrl?: string | null;
  productName: string;
};

export function ProductImages({ imageUrl, productName }: ProductImagesProps) {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative aspect-square bg-black rounded-lg overflow-hidden border border-white/10 group cursor-zoom-in transition-all duration-300 ${isZoomed ? 'shadow-2xl' : 'shadow-md'}`}
        onClick={handleZoomToggle}
      >
        {imageUrl && !imageError ? (
          <div className="w-full h-full overflow-hidden">
            <img 
              src={imageUrl} 
              alt={productName} 
              className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'} ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} group-hover:scale-110`}
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 p-4">
            <Image className="h-12 w-12 text-white/30 mb-4" />
            <span className="text-white/50 text-center">No image available</span>
          </div>
        )}
        
        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white/80 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {isZoomed ? "Click to zoom out" : "Click to zoom in"}
        </div>
        
        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          <div className="bg-[#FE2C55] text-white text-xs px-3 py-1 rounded-full font-medium">
            POPULAR
          </div>
        </div>
      </div>
      
      {/* Thumbnail grid (for future gallery feature) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="aspect-square rounded bg-black/50 border border-[#FE2C55] overflow-hidden">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={productName} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/50 text-xs">No image</span>
            </div>
          )}
        </div>
        
        {/* Placeholder thumbnails */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="aspect-square rounded bg-black/40 border border-white/10 flex items-center justify-center">
            <span className="text-white/30 text-xs">More views</span>
          </div>
        ))}
      </div>
    </div>
  );
}
