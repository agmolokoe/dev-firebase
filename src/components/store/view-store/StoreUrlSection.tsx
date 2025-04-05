
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, QrCode } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type StoreUrlSectionProps = {
  businessProfile: any;
};

export function StoreUrlSection({ businessProfile }: StoreUrlSectionProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyUrl = () => {
    if (businessProfile?.id) {
      navigator.clipboard.writeText(`www.baseti.co.za/shopapp/${businessProfile.id}`);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Store URL has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg mt-6 border border-white/10">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <span className="text-white/90">Store URL</span>
        <div className="px-2 py-0.5 bg-[#25F4EE]/10 text-[#25F4EE] text-xs rounded">Public</div>
      </h3>
      <div className="flex items-center gap-2">
        <code className="bg-black/50 p-3 rounded-md flex-1 overflow-x-auto font-mono text-white/80 border border-white/10">
          www.baseti.co.za/shopapp/{businessProfile.id}
        </code>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleCopyUrl}
          className="border-white/10 hover:bg-white/5 transition-all duration-300"
        >
          {copied ? <CheckCheck className="h-4 w-4 text-[#25F4EE]" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="border-white/10 hover:bg-white/5 transition-all duration-300"
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-white/60 mt-2">
        Share this URL with your customers to let them access your online store.
      </p>
    </div>
  );
}
