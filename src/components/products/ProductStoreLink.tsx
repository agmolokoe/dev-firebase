
import { Button } from "@/components/ui/button"
import { ExternalLink, Store } from "lucide-react"
import { useState } from "react"

interface ProductStoreLinkProps {
  businessId: string | null;
}

export function ProductStoreLink({ businessId }: ProductStoreLinkProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const getStoreUrl = () => {
    return `/shopapp/${businessId}`;
  };

  return (
    <div className="mt-6 pt-4 border-t border-[#FFFFFF]/10">
      <Button
        type="button"
        variant="outline"
        className={`w-full text-[#FFFFFF] border-[#25F4EE]/40 relative overflow-hidden group transition-all duration-300 ${isHovering ? 'bg-[#25F4EE]/10' : 'hover:bg-[#25F4EE]/10'}`}
        onClick={() => window.open(getStoreUrl(), '_blank')}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE]/0 via-[#25F4EE]/10 to-[#25F4EE]/0 animate-shimmer opacity-0 group-hover:opacity-100" 
             style={{ backgroundSize: '200% 100%' }} />
        
        <Store className={`mr-2 h-4 w-4 transition-transform duration-300 ${isHovering ? 'scale-110' : ''}`} />
        <span>View Your Store</span>
        <ExternalLink className={`ml-2 h-4 w-4 transition-all duration-300 ${isHovering ? 'translate-x-1 -translate-y-1' : ''}`} />
      </Button>
    </div>
  );
}
