
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ProductStoreLinkProps {
  businessId: string | null;
}

export function ProductStoreLink({ businessId }: ProductStoreLinkProps) {
  const getStoreUrl = () => {
    return `/store/${businessId}`;
  };

  return (
    <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10">
      <Button
        type="button"
        variant="outline"
        className="w-full text-[#FFFFFF] border-[#25F4EE]/40 hover:bg-[#25F4EE]/10"
        onClick={() => window.open(getStoreUrl(), '_blank')}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        View Your Store
      </Button>
    </div>
  );
}
