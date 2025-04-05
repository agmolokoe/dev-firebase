
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";

type StoreHeaderProps = {
  businessProfile: any;
  handleViewStore: () => void;
};

export function StoreHeader({ businessProfile, handleViewStore }: StoreHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Your Store</h1>
        <p className="text-muted-foreground mt-2">Manage your online store presence</p>
      </div>
      {businessProfile && (
        <Button 
          onClick={handleViewStore}
          className="flex items-center gap-2 bg-gradient-to-r from-[#25F4EE] to-[#25F4EE]/80 hover:from-[#25F4EE]/90 hover:to-[#25F4EE]/70 text-black font-medium"
          size="lg"
        >
          <Eye className="h-5 w-5" />
          <span>View Your Store</span>
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
