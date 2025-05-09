// 商品状态枚举
export enum ProductStatus {
    PRODUCT_STATUS_DRAFT = 0,     // 草稿状态
    PRODUCT_STATUS_PENDING = 1,  // 待审核
    PRODUCT_STATUS_APPROVED = 2, // 审核通过
    PRODUCT_STATUS_REJECTED = 3,  // 审核驳回
    PRODUCT_STATUS_SOLD_OUT = 4   // 下架
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
