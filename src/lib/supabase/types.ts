
export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  lastPurchase: string
  totalOrders: number
  business_id: string
  created_at?: string
}

export type Product = {
  id: number
  name: string
  price?: number
  stock?: number
  category?: string
  status?: string
  business_id: string
  created_at?: string
  description?: string
  image_url?: string
  cost_price?: number
  selling_price?: number
  taxable?: boolean
}

export type Order = {
  id: string
  customer_id: string
  date: string
  status: string
  total: number
  items: number
  business_id: string
  created_at?: string
}
