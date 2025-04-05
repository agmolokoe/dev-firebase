
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
import { motion } from "framer-motion";

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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="container mx-auto p-6" 
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div className="flex items-center justify-between mb-8" variants={item}>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Webstore Management</h1>
          <p className="text-muted-foreground mt-2">Customize and manage your online storefront</p>
        </div>
        {businessProfile && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleViewStore}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-medium shadow-md"
              size="lg"
            >
              <Eye className="h-5 w-5" />
              <span>Preview Store</span>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <motion.div className="space-y-4" variants={item}>
          <Skeleton className="h-40 w-full bg-gradient-to-r from-gray-800/60 to-gray-700/60 animate-pulse" />
          <Skeleton className="h-60 w-full bg-gradient-to-r from-gray-800/60 to-gray-700/60 animate-pulse" />
        </motion.div>
      ) : businessProfile ? (
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 mb-8 bg-gradient-to-r from-black to-gray-900 p-1 rounded-lg">
            <TabsTrigger value="design" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-400 data-[state=active]:text-black">
              <Palette className="h-4 w-4" />
              <span>Design & Layout</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-400 data-[state=active]:text-black">
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-400 data-[state=active]:to-gray-300 data-[state=active]:text-black">
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/10 shadow-glow-teal overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-gradient">Store Theme</CardTitle>
                  <CardDescription>Customize the look and feel of your online store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Modern", "Classic", "Bold"].map((theme) => (
                      <motion.div key={theme} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Card className={`overflow-hidden cursor-pointer transition-all ${theme === 'Modern' ? 'ring-2 ring-teal-500' : 'border-border hover:ring-1 hover:ring-teal-500/50'}`}>
                          <div className={`h-32 ${theme === 'Modern' ? 'bg-gradient-to-br from-teal-500/20 to-blue-500/20' : theme === 'Classic' ? 'bg-gradient-to-br from-gray-600/20 to-gray-400/20' : 'bg-gradient-to-br from-blue-600/20 to-purple-500/20'}`}></div>
                          <CardFooter className="flex items-center justify-between">
                            <span>{theme}</span>
                            {theme === 'Modern' && <div className="w-3 h-3 rounded-full bg-teal-500"></div>}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-white/10 shadow-glow-blue overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-gradient">Layout Options</CardTitle>
                  <CardDescription>Choose how your products are displayed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="h-auto w-full py-6 flex flex-col gap-4 justify-center items-center hover:bg-teal-500/10 hover:border-teal-500/50">
                        <LayoutGrid className="h-6 w-6 text-teal-400" />
                        <span>Grid Layout</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="h-auto w-full py-6 flex flex-col gap-4 justify-center items-center hover:bg-blue-500/10 hover:border-blue-500/50">
                        <PanelLeft className="h-6 w-6 text-blue-400" />
                        <span>Sidebar Layout</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="products">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/10 shadow-glow-teal overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-gradient">Manage Products</CardTitle>
                  <CardDescription>Organize products in your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Product Catalog</h3>
                      <p className="text-sm text-muted-foreground">View and modify products displayed in your store</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => navigate('/dashboard/products')} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-md">
                        Manage Products
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg text-center"
                    whileHover={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Store className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <p>Manage your product catalog from the Products section</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/10 shadow-glow-teal overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-gradient">Store Configuration</CardTitle>
                  <CardDescription>Set up your store details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Store URL</h3>
                    <div className="flex items-center gap-2">
                      <code className="bg-black/50 p-3 rounded-md flex-1 overflow-x-auto font-mono text-white/80 border border-white/10">
                        www.baseti.co.za/shopapp/{businessProfile.id}
                      </code>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="outline" size="icon" className="hover:bg-teal-500/10 hover:border-teal-500/50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Store Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        className="p-4 rounded-lg border border-white/10 bg-gradient-to-br from-teal-500/5 to-transparent"
                        whileHover={{ y: -5, boxShadow: '0 4px 20px rgba(45, 212, 191, 0.15)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm font-medium text-teal-400">Store Name</p>
                        <p className="font-medium">{businessProfile.business_name || 'Your Business'}</p>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/5 to-transparent"
                        whileHover={{ y: -5, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm font-medium text-blue-400">Industry</p>
                        <p className="font-medium">{businessProfile.industry || 'Not specified'}</p>
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-md"
                      onClick={() => navigate('/dashboard/settings/store')}
                    >
                      Advanced Settings
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      ) : (
        <motion.div variants={item}>
          <Card className="text-center p-8 border-white/10 shadow-glow-teal">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Globe className="h-12 w-12 mx-auto mb-4 text-teal-400" />
              <h2 className="text-2xl font-bold mb-2 gradient-text">Set Up Your Webstore</h2>
              <p className="mb-6 text-muted-foreground">Complete your business profile to get started with your online store</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate('/dashboard/profile/setup')}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-md"
                >
                  Complete Profile
                </Button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
