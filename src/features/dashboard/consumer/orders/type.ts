// 创建订单请求

import { CartItem } from "@/types/cart.ts";
import { PaymentStatus, ShippingStatus } from "@/types/status.ts";
import { MerchantAddress } from "@/features/dashboard/merchant/addresses/types.ts";


export interface PlaceOrderReq {
    currency: string
    address: MerchantAddress
    email: string
    orderItems: OrderItem[]
}

// 创建订单响应
export interface PlaceOrderResp {
    order: {
        orderId: string
    }
}

// 订单列表请求
export interface ListOrderReq {
    page: number
    pageSize: number
    shippingStatus?: ShippingStatus // 新增：按货运状态筛选
}

// 订单列表请求
export interface GetAllOrdersReq {
    page: number
    pageSize: number
}

// 订单项
export interface OrderItem {
    item: CartItem
    cost: number
}

// 消费者订单项
export interface ConsumerOrderItem {
    item: CartItem
    cost: number
}

// 子订单项
export interface SubOrderItem {
    item: CartItem
    cost: number
}

// 子订单
export interface SubOrder {
    orderId: number
    subOrderId: number
    totalAmount: number
    consumerId: string
    address: ConsumerAddress
    consumerEmail: string
    currency: string
    subOrderItems: SubOrderItem[]
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    createdAt: string
    updatedAt: string
}

// 消费者地址
export interface ConsumerAddress {
    userId: string
    streetAddress: string
    city: string
    state: string
    country: string
    zipCode: string
}

// 消费者订单列表响应
export interface ConsumerOrders {
    orders: ConsumerOrder[]
}

// 管理员订单列表响应
export interface AdminOrderReply {
    orders: SubOrder[]
}

// 订单列表响应
export interface ListOrderResp {
    orders: Order[]
}

// 订单项
export interface OrderItem {
    item: CartItem
    cost: number
    id: string
}

// 物流信息
export interface ShippingInfo {
    shippingFee: number;
    shippingAddress: Partial<MerchantAddress>;
    trackingNumber: string
    carrier: string
    updates?: ShippingUpdate[]
    orderId: string
    subOrderId: number
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
}

// 订单详情
export interface Order {
    items: OrderItem[]
    orderId: string
    subOrderId?: number
    userId: string
    currency: string
    address: MerchantAddress
    email: string
    createdAt: string
    paymentStatus: PaymentStatus
    shippingStatus: string // 货运状态
    shippingInfo?: ShippingInfo    // 物流信息
    orderItems?: OrderItem[]
}

// 订单列表
export interface Type {
    orders: Order[]
}

export interface MarkOrderPaidReq {
    orderId: string
}

export interface MarkOrderPaidResp {

}

export interface ConsumerAddress {
    city: string
    country: string
    createdAt: string
    email: string
    id: number
    paymentStatus: string
    shippingStatus: string
    state: string
    streetAddress: string
    updatedAt: string
    userId: string
    zipCode: string  // 修正拼写错误：zipCod -> zipCode
}

export interface GetSubOrderShippingReply {
    trackingNumber: string
    carrier: string
    updates?: ShippingUpdate[]
    orderId: string
    subOrderId: number
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    shippingAddress: Partial<MerchantAddress>
    receiverAddress: Partial<ConsumerAddress>
    shippingFee: number // 运费
    delivery: string // 送达日期
}

// 物流更新记录
export interface ShippingUpdate {
    location: string
    status: string
    timestamp: string
    description: string
}

// 更新订单物流状态请求
export interface updateOrderShippingStatusReq {
    subOrderId: string | number;
    shippingStatus: ShippingStatus;
    trackingNumber?: string;
    carrier?: string;
    shippingAddress?: Partial<MerchantAddress>;
    shippingFee?: number;
    delivery?: string; // 送达日期
}

// 获取消费者订单请求
export interface GetConsumerOrdersReq {
    userId?: string
    page: number
    pageSize: number
}

// 消费者订单响应
export interface ConsumerOrders {
    orders: ConsumerOrder[]
}

// 消费者订单项
export interface ConsumerOrderItem {
    item: CartItem
    cost: number
}

// 消费者订单
export interface ConsumerOrder {
    items: ConsumerOrderItem[]
    orderId: number
    subOrderId: number
    userId?: string
    currency: string
    address: {
        streetAddress: string
        city: string
        state: string
        country: string
        zipCode: string
    }
    email: string
    createdAt: string
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    updatedAt: string
}

// 合并后的订单类型（用于前端显示）
export interface MergedOrder {
    orderId: number
    items: ConsumerOrderItem[]
    userId: string
    currency: string
    address: ConsumerAddress
    email: string
    createdAt: string
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    totalAmount: number
    subOrders: ConsumerOrder[] // 包含原始子订单
}
