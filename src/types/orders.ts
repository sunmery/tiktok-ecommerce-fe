// 创建订单请求

import {CartItem} from "@/types/cart.ts";
import {MerchantAddress} from "@/api/merchant/addressService.ts";

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
    zipCod: string
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
    // receiverAddress: Partial<ConsumerAddress>
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
export interface Orders {
    orders: Order[]
}

export interface MarkOrderPaidReq {
    orderId: string
}

export interface MarkOrderPaidResp {

}

// 商家发货请求
export interface ShipOrderReq {
    subOrderId: number
    trackingNumber: string
    carrier: string
    shippingAddress: Partial<MerchantAddress>
    shippingFee: number // 运费
}

// 商家发货响应
export interface ShipOrderResp {
}


/**
 * 更新订单货运状态请求
 */
export interface updateOrderShippingStatusReq {
    subOrderId: number;
    trackingNumber: string;
    carrier: string;
    shippingAddress: Partial<MerchantAddress>; // 发货地址
    shippingFee: number; // 运费
    shippingStatus: ShippingStatus; // 货运状态
    delivery: string; // 送达日期
}

// 移除 ShipOrderReq 接口
// export interface ShipOrderReq {
//     subOrderId: number;
//     trackingNumber: string;
//     carrier: string;
//     shippingAddress: Partial<MerchantAddress>;
//     shippingFee: number;
// }

// 用户确认收货请求
export interface ConfirmReceivedReq {
    orderId: string
}

// 用户确认收货响应
export interface ConfirmReceivedResp {
}

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

