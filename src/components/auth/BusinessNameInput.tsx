import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const BusinessNameInput = ({ value, onChange }: BusinessNameInputProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor="businessName" className="text-white">
        Business Name
      </Label>
      <Input
        id="businessName"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border-white/10 text-white"
        placeholder="Enter your business name"
        required
      />
    </div>
  );
};