
import { supabase } from './client'
import { Product } from './types'

export const products = {
  getAll: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  create: async (product: Omit<Product, 'id' | 'created_at' | 'business_id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        ...product, 
        business_id: user.id,
        status: product.status || 'active',
        category: product.category || 'General',
        taxable: product.taxable !== undefined ? product.taxable : false
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  update: async (id: string | number, product: Partial<Product>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .eq('business_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  delete: async (id: string | number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('business_id', user.id)
    
    if (error) throw error
  }
}
