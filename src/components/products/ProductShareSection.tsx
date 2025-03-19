
import { ShareLinks } from "@/components/social/ShareLinks"

interface ProductShareSectionProps {
  product: {
    name: string;
    description: string | null;
  };
}

export function ProductShareSection({ product }: ProductShareSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10">
      <h4 className="text-sm font-medium mb-2">Share this product</h4>
      <ShareLinks 
        title={product.name}
        description={product.description || ""}
      />
    </div>
  );
}
