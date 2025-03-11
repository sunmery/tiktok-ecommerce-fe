import { proxy, subscribe } from 'valtio'
import type { Order } from '@/types/orders'
import { PaymentStatus } from '@/types/order'

// 订单状态管理接口
export interface OrderState {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  updateOrderStatus: (orderId: number, status: PaymentStatus) => void
  addOrder: (order: Order) => void
  removeOrder: (orderId: number) => void
}

// 初始化订单状态
export const orderStore = proxy<OrderState>({
  orders: [],
  setOrders(orders) {
    orderStore.orders = orders
  },
  updateOrderStatus(orderId, status) {
    const order = orderStore.orders.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
    }
  },
  addOrder(order) {
    orderStore.orders.push(order)
  },
  removeOrder(orderId) {
    orderStore.orders = orderStore.orders.filter(o => o.id !== orderId)
  },
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(orderStore, () => {
  localStorage.setItem('orders', JSON.stringify(orderStore.orders))
})

// 初始化时从 localStorage 恢复数据
const savedOrders = localStorage.getItem('orders')
if (savedOrders) {
  try {
    orderStore.orders = JSON.parse(savedOrders)
  } catch (error) {
    console.error('恢复订单数据失败:', error)
  }
}