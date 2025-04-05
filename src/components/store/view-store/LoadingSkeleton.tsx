
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
      <Card className="border-white/10 shadow-soft overflow-hidden">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-[250px] bg-gradient-to-r from-gray-800/60 to-gray-700/60 animate-pulse" />
            <Skeleton className="h-4 w-full max-w-[500px] bg-gradient-to-r from-gray-800/60 to-gray-700/60" />
            <Skeleton className="h-4 w-full max-w-[400px] bg-gradient-to-r from-gray-800/60 to-gray-700/60" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-teal-500/20 to-teal-400/20 animate-pulse" />
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-blue-500/20 to-blue-400/20 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
