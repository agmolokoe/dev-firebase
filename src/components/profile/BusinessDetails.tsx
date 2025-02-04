import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessDetailsProps {
  businessDescription: string;
  websiteUrl: string;
  onBusinessDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onWebsiteUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BusinessDetails({
  businessDescription,
  websiteUrl,
  onBusinessDescriptionChange,
  onWebsiteUrlChange,
}: BusinessDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="business_description">Business Description</Label>
        <Textarea
          id="business_description"
          name="business_description"
          value={businessDescription}
          onChange={onBusinessDescriptionChange}
          placeholder="Describe your business"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          name="website_url"
          value={websiteUrl}
          onChange={onWebsiteUrlChange}
          placeholder="Enter website URL"
        />
      </div>
    </>
  );
}