
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

type ProductTabsProps = {
  product: {
    id: number;
    description?: string | null;
    selling_price: number;
    stock?: number | null;
  };
  businessName: string;
};

export function ProductTabs({ product, businessName }: ProductTabsProps) {
  // Handle null values gracefully
  const stock = product.stock ?? 0;
  
  const stockStatus = stock > 10 
    ? { text: "In Stock", color: "text-green-500" }
    : stock > 0 
      ? { text: "Low Stock", color: "text-amber-500" }
      : { text: "Out of Stock", color: "text-red-500" };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-6 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Product Description</h3>
        <div className="text-foreground/80 whitespace-pre-line">
          {product.description || "No detailed description available for this product."}
        </div>
      </TabsContent>
      
      <TabsContent value="details" className="mt-6 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Price</span>
            <span>{formatCurrency(product.selling_price)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Availability</span>
            <span className={stockStatus.color}>{stockStatus.text}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">ID</span>
            <span>#{product.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Seller</span>
            <span>{businessName}</span>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No reviews yet</p>
          <Button variant="outline">Write a review</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
