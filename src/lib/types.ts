export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product: Product
}

export interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}
