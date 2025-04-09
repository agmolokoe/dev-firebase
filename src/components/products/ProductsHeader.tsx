
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

interface ProductsHeaderProps {
  onAddProduct: () => void
}

export function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <motion.div 
      className="flex justify-between items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold tracking-tight text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]">
          Products
        </span>
      </motion.h1>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button 
          onClick={onAddProduct}
          className="bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </motion.div>
    </motion.div>
  )
}
