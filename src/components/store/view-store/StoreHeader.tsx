
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

type StoreHeaderProps = {
  businessProfile: any;
  handleViewStore: () => void;
};

export function StoreHeader({ businessProfile, handleViewStore }: StoreHeaderProps) {
  return (
    <motion.div 
      className="flex items-center justify-between mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h1 
          className="text-3xl font-bold gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Your Store
        </motion.h1>
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Manage your online store presence
        </motion.p>
      </div>
      {businessProfile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleViewStore}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-medium shadow-md transition-all duration-300"
            size="lg"
          >
            <Eye className="h-5 w-5" />
            <span>View Your Store</span>
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
