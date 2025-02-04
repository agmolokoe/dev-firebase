import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessBasicInfo } from "./BusinessBasicInfo";
import { BusinessContactInfo } from "./BusinessContactInfo";
import { BusinessDetails } from "./BusinessDetails";

export function BusinessProfileSetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    industry: "",
    contact_email: "",
    contact_phone: "",
    business_address: "",
    business_description: "",
    website_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const { data: existingProfile } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const profileData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (existingProfile) {
        const { error: updateError } = await supabase
          .from('business_profiles')
          .update(profileData)
          .eq('id', session.user.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('business_profiles')
          .insert([{ ...profileData, id: session.user.id }]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your business profile has been updated successfully",
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not update business profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    name: string,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BusinessBasicInfo
              businessName={formData.business_name}
              industry={formData.industry}
              onBusinessNameChange={(e) => handleChange('business_name', e.target.value)}
              onIndustryChange={(value) => handleChange('industry', value)}
            />

            <BusinessContactInfo
              contactEmail={formData.contact_email}
              contactPhone={formData.contact_phone}
              businessAddress={formData.business_address}
              onContactEmailChange={(e) => handleChange('contact_email', e.target.value)}
              onContactPhoneChange={(e) => handleChange('contact_phone', e.target.value)}
              onBusinessAddressChange={(e) => handleChange('business_address', e.target.value)}
            />

            <BusinessDetails
              businessDescription={formData.business_description}
              websiteUrl={formData.website_url}
              onBusinessDescriptionChange={(e) => handleChange('business_description', e.target.value)}
              onWebsiteUrlChange={(e) => handleChange('website_url', e.target.value)}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}