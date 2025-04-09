
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, ArrowUpRight } from "lucide-react";
import { StoreUrlSection } from "./StoreUrlSection";
import { motion } from "framer-motion";

type BusinessProfileCardProps = {
  businessProfile: any;
};

export function BusinessProfileCard({ businessProfile }: BusinessProfileCardProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              {businessProfile.business_name || 'Your Business'}
            </span>
            <motion.div 
              className="h-6 w-6 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] flex items-center justify-center text-black text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✓
            </motion.div>
          </h2>
          <p className="text-white/70 mb-4 max-w-xl">
            {businessProfile.business_description || 'No business description available.'}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/5"
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(37, 244, 238, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              {businessProfile.industry || 'Industry not set'}
            </motion.div>
            {businessProfile.subscription_tier && (
              <motion.div 
                className={`px-3 py-1 rounded-full text-sm border ${
                  businessProfile.subscription_tier === 'premium' 
                    ? 'bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 text-white border-[#25F4EE]/30' 
                    : 'bg-white/10 text-white/90 border-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {businessProfile.subscription_tier.charAt(0).toUpperCase() + businessProfile.subscription_tier.slice(1)} Plan
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="flex items-center gap-2 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white"
              onClick={() => navigate('/dashboard/products/new')}
            >
              <span>Add New Product</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-white/10 hover:bg-[#25F4EE]/10 hover:border-[#25F4EE]/30"
              onClick={() => navigate('/dashboard/settings/store')}
            >
              <Palette className="h-4 w-4" />
              <span>Customize Store</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <StoreUrlSection businessProfile={businessProfile} />
    </>
  );
}
