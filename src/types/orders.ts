// 创建订单请求

import {Address} from "@/types/addresses.ts";
import {CartItem} from "@/types/cart.ts";

export interface PlaceOrderReq {
    currency: string
    address: Address
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
    userId: string
    page: number
    pageSize: number
}
// 订单列表请求
export interface ListAllOrderReq {
    page?: number
    pageSize?: number
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
    name: string
    price: number
    quantity: number
}

// 订单详情
export interface Order {
    items: OrderItem[]
    orderId: string
    userId: string
    currency: string
    address: Address
    email: string
    createdAt: string
    paymentStatus: PaymentStatus
    orderItems?: OrderItem[]
}

// 订单列表
export interface Orders {
    orders: Order[]
}

export interface MarkOrderPaidReq {
    orderId: string
}

export interface MarkOrderPaidResp {

}

// 支付状态枚举
export enum PaymentStatus {
    NotPaid = 'NOT_PAID',
    Processing = 'PROCESSING',
    Paid = 'PAID',
    Failed = 'FAILED',
    Cancelled = 'CANCELLED'
}
