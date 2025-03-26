
import { supabase } from './client';

export const getShareUrl = (businessId: string, productId: string) => {
  return `/shopapp/${businessId}/product/${productId}`;
};

// Utility function to check authentication
export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return { 
    isAuthenticated: !!session?.user, 
    userId: session?.user?.id || null 
  };
};

// Utility function to safely parse JSON
export const safeJsonParse = (jsonString: string | null, fallback: any = {}) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Format currency for display
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
