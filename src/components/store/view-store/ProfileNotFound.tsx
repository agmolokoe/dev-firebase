
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileNotFound() {
  const navigate = useNavigate();
  
  return (
    <Card className="border-white/10">
      <CardContent className="pt-6 text-center py-12">
        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Store className="h-10 w-10 text-white/40" />
        </div>
        <h3 className="text-xl font-medium mb-4">Profile Not Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Please complete your business profile setup to access your store.
        </p>
        <Button 
          onClick={() => navigate('/dashboard/profile/setup')}
          className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] hover:from-[#25F4EE]/90 hover:to-[#FE2C55]/90 text-white font-medium"
        >
          Complete Profile Setup
        </Button>
      </CardContent>
    </Card>
  );
}
