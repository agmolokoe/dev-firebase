
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className={`border-white/10 transition-all duration-300 tiktok-card relative overflow-hidden group ${hoverBorderColorClass}`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${bgColorClass}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-md ${bgColorClass}`}>
            <Icon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <p className="text-white/70 mb-6">{description}</p>
        <Button 
          onClick={() => navigate(route)}
          className={cn(
            "w-full bg-black hover:bg-white/5 border border-white/10 transition-all duration-300 flex items-center justify-between", 
            hoverBorderColorClass.replace("hover:border-", "group-hover:border-")
          )}
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
