
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, ArrowUpRight } from "lucide-react";
import { StoreUrlSection } from "./StoreUrlSection";

type BusinessProfileCardProps = {
  businessProfile: any;
};

export function BusinessProfileCard({ businessProfile }: BusinessProfileCardProps) {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              {businessProfile.business_name || 'Your Business'}
            </span>
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] flex items-center justify-center text-black text-xs font-bold animate-pulse">
              ✓
            </div>
          </h2>
          <p className="text-white/70 mb-4 max-w-xl">
            {businessProfile.business_description || 'No business description available.'}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/5">
              {businessProfile.industry || 'Industry not set'}
            </div>
            {businessProfile.subscription_tier && (
              <div className={`px-3 py-1 rounded-full text-sm border ${
                businessProfile.subscription_tier === 'premium' 
                  ? 'bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 text-white border-[#25F4EE]/30' 
                  : 'bg-white/10 text-white/90 border-white/10'
              }`}>
                {businessProfile.subscription_tier.charAt(0).toUpperCase() + businessProfile.subscription_tier.slice(1)} Plan
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button 
            className="flex items-center gap-2 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white"
            onClick={() => navigate('/dashboard/products/new')}
          >
            <span>Add New Product</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-white/10 hover:bg-white/5"
            onClick={() => navigate('/dashboard/settings/store')}
          >
            <Palette className="h-4 w-4" />
            <span>Customize Store</span>
          </Button>
        </div>
      </div>
      
      <StoreUrlSection businessProfile={businessProfile} />
    </>
  );
}
