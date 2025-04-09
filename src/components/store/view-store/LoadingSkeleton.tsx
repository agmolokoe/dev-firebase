
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-white/10 shadow-soft overflow-hidden bg-gradient-to-b from-[#121212] to-black">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#25F4EE]/5 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#FE2C55]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-pulse"></div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="space-y-4">
            <Skeleton className="h-12 w-[250px] bg-gradient-to-r from-[#25F4EE]/10 to-[#FE2C55]/10 animate-pulse" />
            <Skeleton className="h-4 w-full max-w-[500px] bg-gradient-to-r from-[#25F4EE]/10 to-[#25F4EE]/5" />
            <Skeleton className="h-4 w-full max-w-[400px] bg-gradient-to-r from-[#25F4EE]/10 to-[#25F4EE]/5" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-[#25F4EE]/20 to-[#25F4EE]/10 animate-pulse" />
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-[#FE2C55]/20 to-[#FE2C55]/10 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
