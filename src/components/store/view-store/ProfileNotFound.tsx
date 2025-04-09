
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function ProfileNotFound() {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-white/10 bg-gradient-to-b from-black to-[#121212]">
        <CardContent className="pt-6 text-center py-12">
          <motion.div 
            className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4"
            animate={{ boxShadow: ["0 0 0 rgba(37, 244, 238, 0)", "0 0 20px rgba(37, 244, 238, 0.3)", "0 0 0 rgba(37, 244, 238, 0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Store className="h-10 w-10 text-white/40" />
          </motion.div>
          <h3 className="text-xl font-medium mb-4">Profile Not Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Please complete your business profile setup to access your store.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/dashboard/profile/setup')}
              className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] hover:from-[#25F4EE]/90 hover:to-[#FE2C55]/90 text-white font-medium shadow-md"
            >
              Complete Profile Setup
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
