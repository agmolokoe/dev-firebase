
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, ExternalLink, Copy, CheckCheck, QrCode, ArrowRight, Palette, Settings, ArrowUpRight, Eye, Package, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProductStoreLink } from "@/components/products/ProductStoreLink";

export default function ViewStorePage() {
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
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
      window.open(`/shopapp/${businessProfile.id}`, '_blank');
    }
  };

  const handleCopyUrl = () => {
    if (businessProfile?.id) {
      navigator.clipboard.writeText(`www.baseti.co.za/shopapp/${businessProfile.id}`);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Store URL has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Your Store</h1>
          <p className="text-muted-foreground mt-2">Manage your online store presence</p>
        </div>
        {businessProfile && (
          <Button 
            onClick={handleViewStore}
            className="flex items-center gap-2 bg-gradient-to-r from-[#25F4EE] to-[#25F4EE]/80 hover:from-[#25F4EE]/90 hover:to-[#25F4EE]/70 text-black font-medium"
            size="lg"
          >
            <Eye className="h-5 w-5" />
            <span>View Your Store</span>
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="border-white/10">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-[250px]" />
              <Skeleton className="h-4 w-full max-w-[500px]" />
              <Skeleton className="h-4 w-full max-w-[400px]" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : businessProfile ? (
        <Card className="border-white/10 overflow-hidden bg-gradient-to-b from-black to-[#121212]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#25F4EE]/5 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FE2C55]/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          
          <CardContent className="pt-6 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
                    {businessProfile.business_name || 'Your Business'}
                  </span>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] flex items-center justify-center text-black text-xs font-bold animate-pulse">
                    ✓
                  </div>
                </h2>
                <p className="text-white/70 mb-4 max-w-xl">
                  {businessProfile.business_description || 'No business description available.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/5">
                    {businessProfile.industry || 'Industry not set'}
                  </div>
                  {businessProfile.subscription_tier && (
                    <div className={`px-3 py-1 rounded-full text-sm border ${
                      businessProfile.subscription_tier === 'premium' 
                        ? 'bg-gradient-to-r from-[#25F4EE]/20 to-[#FE2C55]/20 text-white border-[#25F4EE]/30' 
                        : 'bg-white/10 text-white/90 border-white/10'
                    }`}>
                      {businessProfile.subscription_tier.charAt(0).toUpperCase() + businessProfile.subscription_tier.slice(1)} Plan
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  className="flex items-center gap-2 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white"
                  onClick={() => navigate('/dashboard/products/new')}
                >
                  <span>Add New Product</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-white/10 hover:bg-white/5"
                  onClick={() => navigate('/dashboard/settings/store')}
                >
                  <Palette className="h-4 w-4" />
                  <span>Customize Store</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg mt-6 border border-white/10">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-white/90">Store URL</span>
                <div className="px-2 py-0.5 bg-[#25F4EE]/10 text-[#25F4EE] text-xs rounded">Public</div>
              </h3>
              <div className="flex items-center gap-2">
                <code className="bg-black/50 p-3 rounded-md flex-1 overflow-x-auto font-mono text-white/80 border border-white/10">
                  www.baseti.co.za/shopapp/{businessProfile.id}
                </code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyUrl}
                  className="border-white/10 hover:bg-white/5 transition-all duration-300"
                >
                  {copied ? <CheckCheck className="h-4 w-4 text-[#25F4EE]" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-white/10 hover:bg-white/5 transition-all duration-300"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Share this URL with your customers to let them access your online store.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
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
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
            Store Management
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-white/10 hover:border-[#25F4EE]/30 transition-all duration-300 tiktok-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#25F4EE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-[#25F4EE]/10">
                  <Package className="h-5 w-5 text-[#25F4EE]" />
                </div>
                <h3 className="text-xl font-medium">Manage Products</h3>
              </div>
              <p className="text-white/70 mb-6">
                Add, edit, or remove products from your store inventory. Update pricing, images, and availability.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/products')}
                className="w-full bg-black hover:bg-white/5 border border-white/10 group-hover:border-[#25F4EE]/50 transition-all duration-300 flex items-center justify-between"
              >
                <span>Go to Products</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 hover:border-[#FE2C55]/30 transition-all duration-300 tiktok-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FE2C55]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-[#FE2C55]/10">
                  <ShoppingCart className="h-5 w-5 text-[#FE2C55]" />
                </div>
                <h3 className="text-xl font-medium">Manage Orders</h3>
              </div>
              <p className="text-white/70 mb-6">
                View and process customer orders from your store. Track order status and manage fulfillment.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/orders')}
                className="w-full bg-black hover:bg-white/5 border border-white/10 group-hover:border-[#FE2C55]/50 transition-all duration-300 flex items-center justify-between"
              >
                <span>Go to Orders</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 hover:border-white/30 transition-all duration-300 tiktok-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-white/10">
                  <Settings className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-xl font-medium">Store Settings</h3>
              </div>
              <p className="text-white/70 mb-6">
                Configure your store settings, payment methods, shipping options, and other preferences.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/settings/store')}
                className="w-full bg-black hover:bg-white/5 border border-white/10 group-hover:border-white/50 transition-all duration-300 flex items-center justify-between"
              >
                <span>Manage Settings</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 hover:border-white/30 transition-all duration-300 tiktok-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-white/10">
                  <QrCode className="h-5 w-5 text-white/80" />
                </div>
                <h3 className="text-xl font-medium">Promote Your Store</h3>
              </div>
              <p className="text-white/70 mb-6">
                Create marketing campaigns, generate QR codes, and share your store on social media platforms.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/marketing')}
                className="w-full bg-black hover:bg-white/5 border border-white/10 group-hover:border-white/50 transition-all duration-300 flex items-center justify-between"
              >
                <span>Marketing Tools</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
