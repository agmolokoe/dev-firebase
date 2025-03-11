
type ProductImagesProps = {
  imageUrl?: string | null;
  productName: string;
};

export function ProductImages({ imageUrl, productName }: ProductImagesProps) {
  return (
    <div className="aspect-square bg-accent/10 rounded-lg overflow-hidden border">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={productName} 
          className="w-full h-full object-contain" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      )}
    </div>
  );
}
