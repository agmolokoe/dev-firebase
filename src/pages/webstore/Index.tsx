
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Palette, Settings, ShoppingBag, Store, PanelLeft, LayoutGrid, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ProductStoreLink } from "@/components/products/ProductStoreLink";

export default function WebstorePage() {
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
      window.open(`/shopapp/${businessProfile.id}`, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Webstore Management</h1>
          <p className="text-muted-foreground mt-2">Customize and manage your online storefront</p>
        </div>
        {businessProfile && (
          <Button 
            onClick={handleViewStore}
            className="flex items-center gap-2 bg-gradient-to-r from-[#25F4EE] to-[#25F4EE]/80 hover:from-[#25F4EE]/90 hover:to-[#25F4EE]/70 text-black font-medium"
            size="lg"
          >
            <Eye className="h-5 w-5" />
            <span>Preview Store</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : businessProfile ? (
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 mb-8">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Design & Layout</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Theme</CardTitle>
                <CardDescription>Customize the look and feel of your online store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Modern", "Classic", "Bold"].map((theme) => (
                    <Card key={theme} className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${theme === 'Modern' ? 'border-primary' : 'border-border'}`}>
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                      <CardFooter className="flex items-center justify-between">
                        <span>{theme}</span>
                        {theme === 'Modern' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout Options</CardTitle>
                <CardDescription>Choose how your products are displayed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-4 justify-center items-center">
                    <LayoutGrid className="h-6 w-6" />
                    <span>Grid Layout</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-4 justify-center items-center">
                    <PanelLeft className="h-6 w-6" />
                    <span>Sidebar Layout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Organize products in your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Product Catalog</h3>
                    <p className="text-sm text-muted-foreground">View and modify products displayed in your store</p>
                  </div>
                  <Button onClick={() => navigate('/dashboard/products')}>
                    Manage Products
                  </Button>
                </div>
                
                <div className="bg-secondary/20 p-6 rounded-lg text-center">
                  <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Manage your product catalog from the Products section</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Configuration</CardTitle>
                <CardDescription>Set up your store details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Store URL</h3>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/50 p-3 rounded-md flex-1 overflow-x-auto font-mono text-white/80 border border-white/10">
                      www.baseti.co.za/shopapp/{businessProfile.id}
                    </code>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Store Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border">
                      <p className="text-sm font-medium text-muted-foreground">Store Name</p>
                      <p className="font-medium">{businessProfile.business_name || 'Your Business'}</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <p className="text-sm font-medium text-muted-foreground">Industry</p>
                      <p className="font-medium">{businessProfile.industry || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/dashboard/settings/store')}
                >
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="text-center p-8">
          <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Set Up Your Webstore</h2>
          <p className="mb-6 text-muted-foreground">Complete your business profile to get started with your online store</p>
          <Button onClick={() => navigate('/dashboard/profile/setup')}>Complete Profile</Button>
        </Card>
      )}
    </div>
  );
}
