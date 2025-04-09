
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function LoadingSkeleton() {
  // Create staggered animation for skeleton elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full"
    >
      <Card className="border-white/10 shadow-soft overflow-hidden bg-gradient-to-b from-[#121212] to-black">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#25F4EE]/5 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#FE2C55]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-pulse"></div>
        
        <CardContent className="pt-6 relative z-10">
          <motion.div className="space-y-6" variants={container}>
            <motion.div variants={item}>
              <Skeleton className="h-12 w-[250px] bg-gradient-to-r from-[#25F4EE]/10 to-[#FE2C55]/10 animate-pulse" />
            </motion.div>
            
            <motion.div variants={item}>
              <Skeleton className="h-4 w-full max-w-[500px] bg-gradient-to-r from-[#25F4EE]/10 to-[#25F4EE]/5" />
            </motion.div>
            
            <motion.div variants={item}>
              <Skeleton className="h-4 w-full max-w-[400px] bg-gradient-to-r from-[#25F4EE]/10 to-[#25F4EE]/5" />
            </motion.div>
            
            <motion.div variants={item} className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-[#25F4EE]/20 to-[#25F4EE]/10 animate-pulse" />
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-[#FE2C55]/20 to-[#FE2C55]/10 animate-pulse" />
            </motion.div>
            
            <motion.div variants={item} className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton 
                    key={i}
                    className="h-40 w-full rounded-xl bg-gradient-to-br from-[#25F4EE]/5 to-[#FE2C55]/5"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
