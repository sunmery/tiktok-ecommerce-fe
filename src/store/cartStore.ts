import {proxy, subscribe} from 'valtio'
import type {CartItem} from '@/types/carts'

// 定义购物车状态
export interface CartState {
  items: CartItem[]
  addItem: (id: number, name: string, price: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

// 恢复本地存储的数据
const savedCart = localStorage.getItem('cart')
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []

export const cartStore = proxy<CartState>({
  items: initialItems,
  addItem(id: number, name: string, price: number, quantity: number) {
    const existingItem = cartStore.items.find((item) => item.id === id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartStore.items.push({id, name, price, quantity})
    }
  },
  removeItem(id) {
    cartStore.items = cartStore.items.filter((item) => item.id !== id)
  },
  clearCart() {
    cartStore.items = []
  },
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(cartStore, () => {
  localStorage.setItem('cart', JSON.stringify(cartStore.items))
})
