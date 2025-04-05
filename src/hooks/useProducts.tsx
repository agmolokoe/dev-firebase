
import { useState, useCallback } from "react"
import { useProductData } from "./useProductData"
import { useProductActions } from "./useProductActions"
import { useTenant } from "@/middleware"

export function useProducts(options?: { forWebstore?: boolean }) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Get tenant information
  const { currentTenantId, isAdmin } = useTenant();
  
  // Pass tenant information to useProductData
  const {
    userId,
    products,
    isLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm
  } = useProductData(currentTenantId, isAdmin)
  
  // Pass tenant information to useProductActions
  const {
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct
  } = useProductActions(currentTenantId || userId, isAdmin)
  
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

  // Filter products for webstore if needed
  const webstoreProducts = options?.forWebstore 
    ? products.filter(product => product.published !== false)
    : products;

  return {
    userId: currentTenantId || userId,
    products: options?.forWebstore ? webstoreProducts : products,
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
    openEditDialog,
    isAdmin
  }
}
