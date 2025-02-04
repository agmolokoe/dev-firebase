import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessContactInfoProps {
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  onContactEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContactPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBusinessAddressChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function BusinessContactInfo({
  contactEmail,
  contactPhone,
  businessAddress,
  onContactEmailChange,
  onContactPhoneChange,
  onBusinessAddressChange,
}: BusinessContactInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email *</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          value={contactEmail}
          onChange={onContactEmailChange}
          required
          placeholder="Enter contact email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          value={contactPhone}
          onChange={onContactPhoneChange}
          placeholder="Enter contact phone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business_address">Business Address</Label>
        <Textarea
          id="business_address"
          name="business_address"
          value={businessAddress}
          onChange={onBusinessAddressChange}
          placeholder="Enter business address"
        />
      </div>
    </>
  );
}