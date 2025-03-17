
import { useState } from "react";
import { Image, ZoomIn, ZoomOut } from "lucide-react";

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
        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${isZoomed ? 'shadow-2xl border-[#FE2C55]' : 'shadow-md border-white/10'}`}
        onClick={handleZoomToggle}
      >
        {imageUrl && !imageError ? (
          <div className="w-full h-full overflow-hidden bg-gradient-to-b from-black/5 to-black/20">
            <img 
              src={imageUrl} 
              alt={productName} 
              className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'} ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} hover:scale-110`}
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 p-4">
            <Image className="h-12 w-12 text-white/30 mb-4" />
            <span className="text-white/50 text-center">No image available</span>
          </div>
        )}
        
        {/* Zoom indicator with icon */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white/90 text-xs px-3 py-2 rounded-full flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
          {isZoomed ? (
            <>
              <ZoomOut className="h-3 w-3" />
              <span>Zoom out</span>
            </>
          ) : (
            <>
              <ZoomIn className="h-3 w-3" />
              <span>Zoom in</span>
            </>
          )}
        </div>
        
        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          <div className="bg-[#FE2C55] text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
            POPULAR
          </div>
        </div>
      </div>
      
      {/* Thumbnail grid with improved styling */}
      <div className="grid grid-cols-4 gap-2">
        <div className="aspect-square rounded-md bg-black overflow-hidden shadow-md border-2 border-[#FE2C55]">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={productName} 
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/50 text-xs">No image</span>
            </div>
          )}
        </div>
        
        {/* Placeholder thumbnails with improved styling */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="aspect-square rounded-md bg-black/40 border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
            <span className="text-white/30 text-xs">More views</span>
          </div>
        ))}
      </div>
    </div>
  );
}
