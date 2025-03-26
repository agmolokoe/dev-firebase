
import { useState, useCallback } from "react"
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
  
  const openAddDialog = useCallback(() => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }, [])
  
  const openEditDialog = useCallback((product: any) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }, [])
  
  const setIsDialogOpenCallback = useCallback((isOpen: boolean) => {
    setIsDialogOpen(isOpen);
  }, []);
  
  const setSelectedProductCallback = useCallback((product: any) => {
    setSelectedProduct(product);
  }, []);

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
    setSelectedProduct: setSelectedProductCallback,
    isDialogOpen,
    setIsDialogOpen: setIsDialogOpenCallback,
    openAddDialog,
    openEditDialog
  }
}
