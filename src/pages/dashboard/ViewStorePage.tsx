
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function ViewStorePage() {
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setBusinessProfile(data);
      } catch (error) {
        console.error('Error fetching business profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your business profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [navigate, toast]);

  const handleViewStore = () => {
    if (businessProfile?.id) {
      window.open(`/store/${businessProfile.id}`, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Store</h1>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      ) : businessProfile ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{businessProfile.business_name || 'Your Business'}</h2>
                <p className="text-muted-foreground mb-4">
                  {businessProfile.business_description || 'No business description available.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
                    {businessProfile.industry || 'Industry not set'}
                  </div>
                  {businessProfile.subscription_tier && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {businessProfile.subscription_tier.charAt(0).toUpperCase() + businessProfile.subscription_tier.slice(1)} Plan
                    </div>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleViewStore}
                className="flex items-center gap-2"
                size="lg"
              >
                <Store className="h-5 w-5" />
                <span>Visit Your Store</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg mt-6">
              <h3 className="font-medium mb-2">Store URL</h3>
              <div className="flex items-center gap-2">
                <code className="bg-background p-2 rounded flex-1 overflow-x-auto">
                  {window.location.origin}/store/{businessProfile.id}
                </code>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/store/${businessProfile.id}`);
                    toast({
                      title: "Copied to clipboard",
                      description: "Store URL has been copied to your clipboard",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <h3 className="text-xl font-medium mb-4">Profile Not Found</h3>
            <p className="text-muted-foreground mb-6">
              Please complete your business profile setup to access your store.
            </p>
            <Button onClick={() => navigate('/dashboard/profile/setup')}>
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Store Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-2">Manage Products</h3>
              <p className="text-muted-foreground mb-4">
                Add, edit, or remove products from your store inventory.
              </p>
              <Button onClick={() => navigate('/dashboard/products')}>
                Go to Products
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium mb-2">Manage Orders</h3>
              <p className="text-muted-foreground mb-4">
                View and process customer orders from your store.
              </p>
              <Button onClick={() => navigate('/dashboard/orders')}>
                Go to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
