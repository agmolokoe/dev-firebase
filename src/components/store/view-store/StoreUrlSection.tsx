
import { Button } from "@/components/ui/button";
import { Copy, CheckCheck, QrCode } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
        className: "bg-[#25F4EE]/10 border-[#25F4EE]/20",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-md p-4 rounded-lg mt-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      whileHover={{ boxShadow: "0 8px 25px rgba(37, 244, 238, 0.15)" }}
    >
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <span className="text-white/90">Store URL</span>
        <div className="px-2 py-0.5 bg-[#25F4EE]/10 text-[#25F4EE] text-xs rounded">Public</div>
      </h3>
      <div className="flex items-center gap-2">
        <motion.code 
          className="bg-black/50 p-3 rounded-md flex-1 overflow-x-auto font-mono text-white/80 border border-white/10"
          whileHover={{ borderColor: "rgba(37, 244, 238, 0.3)" }}
        >
          www.baseti.co.za/shopapp/{businessProfile.id}
        </motion.code>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopyUrl}
            className="border-white/10 hover:bg-[#25F4EE]/10 hover:border-[#25F4EE]/30 transition-all duration-300"
          >
            {copied ? <CheckCheck className="h-4 w-4 text-[#25F4EE]" /> : <Copy className="h-4 w-4" />}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="outline" 
            size="icon"
            className="border-white/10 hover:bg-[#25F4EE]/10 hover:border-[#25F4EE]/30 transition-all duration-300"
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      <p className="text-xs text-white/60 mt-2">
        Share this URL with your customers to let them access your online store.
      </p>
    </motion.div>
  );
}
