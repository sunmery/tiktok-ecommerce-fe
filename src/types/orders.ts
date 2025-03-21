// 订单状态枚举
export enum OrderStatus {
  notPaid = 'notPaid',       // 未支付
  processing = 'processing',   // 处理中
  paid = 'paid',              // 已支付
  failed = 'failed',          // 支付失败
  cancelled = 'cancelled',    // 取消支付
  shipped = 'shipped',        // 已发货
  outOfStock = 'outOfStock' // 无库存
}

// 为了保持兼容性，保留原有的PaymentStatus
export type PaymentStatus = OrderStatus

// 地址接口
export interface Address {
  province: string
  city: string
  district: string
  detail: string
}

// 订单商品项接口
export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  picture?: string
}

// 订单接口
export interface Order {
  orderId: string
  userId: string
  items: OrderItem[]
  currency: string
  address: Address
  email: string
  createdAt: string
  paymentStatus: PaymentStatus
}

// 订单列表响应接口
export interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  pageSize: number
}
