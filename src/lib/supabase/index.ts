
import { supabase } from './client'
import { customers } from './customers'
import { products } from './products'
import { orders } from './orders'
import { getShareUrl } from './utils'
import { Customer, Product, Order } from './types'

// Re-export everything
export { supabase }
export type { Customer, Product, Order }

// Export database utilities
export const db = {
  customers,
  products,
  orders,
  getShareUrl
}
