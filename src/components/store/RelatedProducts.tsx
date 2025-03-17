
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  selling_price: number;
  image_url?: string | null;
  description?: string | null;
  business_id: string;
  stock?: number | null;
};

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  
  // Don't render anything if no related products
  if (!products || products.length === 0) return null;
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  const visibleProducts = products.slice(
    currentPage * productsPerPage, 
    (currentPage + 1) * productsPerPage
  );
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-[#FE2C55]" />
          <h2 className="text-2xl font-bold">You may also like</h2>
        </div>
        
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPage}
              className="border-white/10 hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPage}
              className="border-white/10 hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
          {visibleProducts.map((product) => (
            <div key={product.id} className="transform transition-all duration-500 hover:translate-y-[-5px]">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.selling_price}
                image_url={product.image_url}
                description={product.description}
                business_id={product.business_id}
                stock={product.stock ?? 0}
                isFeatured={Math.random() > 0.7} // Randomly mark some as featured
              />
            </div>
          ))}
        </div>
        
        {/* Gradient overlay on sides */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button className="bg-[#25F4EE] hover:bg-[#25F4EE]/80 text-black font-medium">
          View All Related Products
        </Button>
      </div>
    </div>
  );
}
