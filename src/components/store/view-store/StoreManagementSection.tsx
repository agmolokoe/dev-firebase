
import { Package, ShoppingCart, Settings, QrCode } from "lucide-react";
import { ManagementCard } from "./ManagementCard";
import { motion } from "framer-motion";

export function StoreManagementSection() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-6 flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]">
          Store Management
        </span>
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ManagementCard
          title="Manage Products"
          description="Add, edit, or remove products from your store inventory. Update pricing, images, and availability."
          icon={Package}
          iconColorClass="text-[#25F4EE]"
          bgColorClass="bg-[#25F4EE]/10"
          route="/dashboard/products"
          buttonText="Go to Products"
          hoverBorderColorClass="hover:border-[#25F4EE]/30"
        />
        
        <ManagementCard
          title="Manage Orders"
          description="View and process customer orders from your store. Track order status and manage fulfillment."
          icon={ShoppingCart}
          iconColorClass="text-[#FE2C55]"
          bgColorClass="bg-[#FE2C55]/10"
          route="/dashboard/orders"
          buttonText="Go to Orders"
          hoverBorderColorClass="hover:border-[#FE2C55]/30"
        />
        
        <ManagementCard
          title="Store Settings"
          description="Configure your store settings, payment methods, shipping options, and other preferences."
          icon={Settings}
          iconColorClass="text-white/80"
          bgColorClass="bg-white/10"
          route="/dashboard/settings/store"
          buttonText="Manage Settings"
          hoverBorderColorClass="hover:border-white/30"
        />
        
        <ManagementCard
          title="Promote Your Store"
          description="Create marketing campaigns, generate QR codes, and share your store on social media platforms."
          icon={QrCode}
          iconColorClass="text-white/80"
          bgColorClass="bg-white/10"
          route="/dashboard/marketing"
          buttonText="Marketing Tools"
          hoverBorderColorClass="hover:border-white/30"
        />
      </div>
    </motion.div>
  );
}
