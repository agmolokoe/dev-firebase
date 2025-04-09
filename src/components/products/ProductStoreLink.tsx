
import { Button } from "@/components/ui/button"
import { ExternalLink, Store } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface ProductStoreLinkProps {
  businessId: string | null;
  variant?: 'default' | 'outline' | 'subtle';
  className?: string;
}

export function ProductStoreLink({ 
  businessId, 
  variant = 'outline',
  className = ''
}: ProductStoreLinkProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const getStoreUrl = () => {
    return `/shopapp/${businessId}`;
  };

  // Different styles based on variant
  const getButtonStyles = () => {
    if (variant === 'default') {
      return `bg-[#25F4EE] text-black hover:bg-[#25F4EE]/90 ${isHovering ? 'bg-[#25F4EE]/90' : ''}`;
    } else if (variant === 'subtle') {
      return `bg-transparent text-[#25F4EE] hover:bg-[#25F4EE]/10 ${isHovering ? 'bg-[#25F4EE]/10' : ''}`;
    } else {
      return `text-[#FFFFFF] border-[#25F4EE]/40 relative overflow-hidden ${isHovering ? 'bg-[#25F4EE]/10' : 'hover:bg-[#25F4EE]/10'}`;
    }
  };

  return (
    <div className={`${variant !== 'subtle' ? 'mt-6 pt-4 border-t border-[#FFFFFF]/10' : ''} ${className}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="button"
          variant={variant === 'default' ? 'default' : 'outline'}
          className={`w-full group transition-all duration-300 ${getButtonStyles()}`}
          onClick={() => window.open(getStoreUrl(), '_blank')}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#25F4EE]/0 via-[#25F4EE]/10 to-[#25F4EE]/0 animate-shimmer opacity-0 group-hover:opacity-100" 
               style={{ backgroundSize: '200% 100%' }} />
          
          <motion.div
            animate={isHovering ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Store className="mr-2 h-4 w-4" />
          </motion.div>
          <span>View Your Store</span>
          <motion.div
            animate={isHovering ? { x: [0, 3, 0], y: [0, -3, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <ExternalLink className="ml-2 h-4 w-4" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
