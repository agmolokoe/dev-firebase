import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

type ProductSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-[#FFFFFF]/60" />
      <Input
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-[#FFFFFF]/5 border-[#FFFFFF]/10 text-[#FFFFFF]"
      />
    </div>
  )
}