// 创建订单请求

import {CartItem} from "@/types/cart.ts";
import {MerchantAddress} from "@/api/merchant/addressService.ts";

// 支付状态枚举
export enum PaymentStatus {
    NotPaid = 'NOT_PAID',
    Processing = 'PROCESSING',
    Paid = 'PAID',
    Failed = 'FAILED',
    Cancelled = 'CANCELLED'
}

// 货运状态枚举
export enum ShippingStatus {
    ShippingWaitCommand = "WAIT_COMMAND", // 等待操作
    ShippingPending = "PENDING_SHIPMENT", // 待发货
    ShippingShipped = "SHIPPED", // 已发货
    ShippingInTransit = "IN_TRANSIT", // 运输中
    ShippingDelivered = "DELIVERED", // 已送达
    ShippingConfirmed = "CONFIRMED", // 确认收货
    ShippingCancelled = "CANCELLED" // 已取消
}


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

// 订单列表请求
export interface GetMerchantOrdersRequest {
    page: number
    pageSize: number
    merchantId?: string
}

// 商家订单项
export interface MerchantOrderItem {
    subOrderId: number
    item: {
        merchantId: string
        productId: string
        quantity: number
        name: string
        picture: string
    }
    cost: number
    email: string
    userId: string
    address: {
        id: number
        userId: string
        city: string
        state: string
        country: string
        zipCode: string
        streetAddress: string
    }
    currency: string
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
    createdAt: string
    updatedAt: string
}

// 商家订单
export interface MerchantOrder {
    items: MerchantOrderItem[]
    orderId: string
    createdAt: string
}

// 商家订单列表响应
export interface GetMerchantOrdersReply {
    orders: MerchantOrder[]
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

// 确认收货请求
export interface ConfirmReceivedReq {
    subOrderId: string | number;
}

// 确认收货响应 (通常为空)
export interface ConfirmReceivedResp {}


// 获取消费者订单请求
export interface GetConsumerOrdersReq {
    userId: string;
    page: number;
    pageSize: number;
}

// 消费者订单响应
export interface ConsumerOrders {
    items: ConsumerOrder[]
    orderId: number
}

// 消费者订单
export interface ConsumerOrder {
    items: OrderItem[]
    orderId: string
    subOrderId?: number
    userId: string
    currency: string
    address: MerchantAddress
    email: string
    createdAt: string
    paymentStatus: PaymentStatus
    shippingStatus: ShippingStatus
}

