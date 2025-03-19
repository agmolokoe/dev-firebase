
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
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: string
  business_id: string
  created_at?: string
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
