import {proxy, subscribe} from 'valtio'
import type {Order} from '@/types/orders'
import {PaymentStatus} from '@/types/orders'

// 订单状态管理接口
export interface OrderState {
    orders: Order[]
    setOrders: (orders: Order[]) => void
    updateOrderStatus: (orderId: string, status: PaymentStatus) => void
    addOrder: (order: Order) => void
    removeOrder: (orderId: string) => void
}

// 初始化订单状态
export const orderStore = proxy<OrderState>({
    orders: [],
    setOrders(orders) {
        orderStore.orders = orders
    },
    updateOrderStatus(orderId, status) {
        const order = orderStore.orders.find(o => o.orderId === orderId)
        if (order) {
            order.paymentStatus = status
            // 不使用 updatedAt，因为 Order 接口中没有这个属性
        }
    },
    addOrder(order) {
        orderStore.orders.push(order)
    },
    removeOrder(orderId) {
        orderStore.orders = orderStore.orders.filter(o => o.orderId !== orderId)
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
