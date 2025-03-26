
import { DashboardLayout } from "@/components/DashboardLayout"
import { ProductDialog } from "@/components/products/ProductDialog"
import { ProductStats } from "@/components/products/ProductStats"
import { ProductList } from "@/components/products/ProductList"
import { ProductSearch } from "@/components/products/ProductSearch"
import { ProductsHeader } from "@/components/products/ProductsHeader"
import { ProductsLoading } from "@/components/products/ProductsLoading"
import { ProductsAuthError } from "@/components/products/ProductsAuthError"
import { useProducts } from "@/hooks/useProducts"

export default function ProductsPage() {
  const { 
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
    isDialogOpen,
    setIsDialogOpen,
    openAddDialog,
    openEditDialog
  } = useProducts()

  // If we have an authentication error and no userId, show a message
  if (error && !userId) {
    return <ProductsAuthError />
  }

  const handleFormSubmit = async (productData: any) => {
    const success = await handleCreateProduct(productData)
    if (success) setIsDialogOpen(false)
  }

  const handleFormUpdate = async (id: number, productData: any) => {
    const success = await handleUpdateProduct(id, productData)
    if (success) setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <ProductsHeader onAddProduct={openAddDialog} />

        <ProductStats
          totalProducts={stats.totalProducts}
          totalValue={stats.totalValue}
          totalProfit={stats.totalProfit}
          lowStockProducts={stats.lowStockProducts}
        />

        <ProductSearch
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {isLoading ? (
          <ProductsLoading />
        ) : (
          <ProductList
            products={products}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={handleDeleteProduct}
          />
        )}

        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onUpdate={handleFormUpdate}
        />
      </div>
    </DashboardLayout>
  )
}
