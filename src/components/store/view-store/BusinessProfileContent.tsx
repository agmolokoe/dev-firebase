
import { Card } from "@/components/ui/card";
import { BusinessProfileCard } from "./BusinessProfileCard";
import { motion } from "framer-motion";

type BusinessProfileContentProps = {
  businessProfile: any;
};

export function BusinessProfileContent({ businessProfile }: BusinessProfileContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-white/10 overflow-hidden bg-gradient-to-b from-black to-[#121212] shadow-glow-teal card-glow">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#25F4EE]/5 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FE2C55]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <motion.div 
          className="pt-6 relative z-10 p-6"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <BusinessProfileCard businessProfile={businessProfile} />
        </motion.div>
      </Card>
    </motion.div>
  );
}
