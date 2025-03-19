
export const getShareUrl = (productId: string | number) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/products/${productId}`;
}
