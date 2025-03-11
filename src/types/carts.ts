// 定义购物车项的类型
export interface CartItem {
  id: string
  name: string
  merchantId: string
  description?: string
  images?: string[]
  price: number
  quantity: number
  categories?: string[]
}

