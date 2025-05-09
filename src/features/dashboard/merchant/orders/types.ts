
// 商家订单
import { PaymentStatus, ShippingStatus } from "@/types/status.ts";

export interface MerchantOrder {
    items: MerchantOrderItem[]
    orderId: string
    createdAt: string
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
// 订单列表请求
export interface GetMerchantOrdersRequest {
    page: number
    pageSize: number
    merchantId?: string
}

// 商家订单列表响应
export interface GetMerchantOrdersReply {
    orders: MerchantOrder[]
}
