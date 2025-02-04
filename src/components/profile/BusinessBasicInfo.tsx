import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessBasicInfoProps {
  businessName: string;
  industry: string;
  onBusinessNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIndustryChange: (value: string) => void;
}

export function BusinessBasicInfo({
  businessName,
  industry,
  onBusinessNameChange,
  onIndustryChange,
}: BusinessBasicInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="business_name">Business Name *</Label>
        <Input
          id="business_name"
          name="business_name"
          value={businessName}
          onChange={onBusinessNameChange}
          required
          placeholder="Enter your business name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry *</Label>
        <Select value={industry} onValueChange={onIndustryChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="hospitality">Hospitality</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}