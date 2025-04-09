
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type ManagementCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass: string;
  bgColorClass: string;
  route: string;
  buttonText: string;
  hoverBorderColorClass: string;
};

export function ManagementCard({
  title,
  description,
  icon: Icon,
  iconColorClass,
  bgColorClass,
  route,
  buttonText,
  hoverBorderColorClass
}: ManagementCardProps) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-white/10 transition-all duration-300 relative overflow-hidden group ${hoverBorderColorClass}`}>
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgColorClass}`}></div>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className={`p-2 rounded-md ${bgColorClass}`}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Icon className={`h-5 w-5 ${iconColorClass}`} />
            </motion.div>
            <h3 className="text-xl font-medium">{title}</h3>
          </div>
          <p className="text-white/70 mb-6">{description}</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => navigate(route)}
              className={cn(
                "w-full bg-black hover:bg-white/5 border border-white/10 transition-all duration-300 flex items-center justify-between group", 
                hoverBorderColorClass.replace("hover:border-", "group-hover:border-")
              )}
            >
              <span>{buttonText}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
