
import { ProductCard } from "./ProductCard";

type Product = {
  id: number;
  name: string;
  selling_price: number;
  image_url?: string | null;
  description?: string | null;
  business_id: string;
  stock?: number;
};

type StoreProductListProps = {
  products: Product[];
  title: string;
};

export function StoreProductList({ products, title }: StoreProductListProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.selling_price}
              image_url={product.image_url}
              description={product.description}
              business_id={product.business_id}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </section>
  );
}
