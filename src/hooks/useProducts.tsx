
import { useState } from "react"
import { useProductData } from "./useProductData"
import { useProductActions } from "./useProductActions"

export function useProducts() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const {
    userId,
    products,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm
  } = useProductData()
  
  const {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
  } = useProductActions(userId)
  
  const openAddDialog = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }
  
  const openEditDialog = (product: any) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  return {
    userId,
    products,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    selectedProduct,
    setSelectedProduct,
    isDialogOpen,
    setIsDialogOpen,
    openAddDialog,
    openEditDialog
  }
}
