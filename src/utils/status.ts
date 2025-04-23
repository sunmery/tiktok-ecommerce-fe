import {PaymentStatus, ShippingStatus} from "@/types/orders";
import {ProductStatus} from "@/types/products.ts";
import {t} from "i18next";

// 获取状态颜色
export const getStatusColor = (status: PaymentStatus | ProductStatus) => {
    switch (status) {
        case PaymentStatus.NotPaid:
            return 'warning';
        case PaymentStatus.Processing:
            return 'primary';
        case PaymentStatus.Paid:
            return 'success';
        case PaymentStatus.Failed:
            return 'danger';
        case PaymentStatus.Cancelled:
            return 'neutral';
        default:
            return 'neutral';
    }
};

// 获取状态文本
export const getStatusText = (status: string | PaymentStatus) => {
    // 如果是前端的OrderStatus（字符串枚举）
    switch (status) {
        case 'NOT_PAID':
            return t('orders.status.notPaid')
        case 'PROCESSING':
            return t('orders.status.processing')
        case 'PAID':
            return t('orders.status.paid')
        case 'FAILED':
            return t('orders.status.failed')
        case 'CANCELLED':
            return t('orders.status.cancelled')
        case 'SHIPPED':
            return t('orders.status.shipped')
        case 'OUT_OF_STOCK':
            return t('orders.status.outOfStock')
        default:
            return t('orders.status.unknown')
    }
}

// 物流状态映射
export const shippingStatus = (shippingStatus: string):string => {
    switch (shippingStatus) {
        case ShippingStatus.ShippingPending:
            return t('merchant.orders.shippingPending')
        case ShippingStatus.ShippingShipped:
            return t('merchant.orders.shippingShipped')
        case ShippingStatus.ShippingInTransit:
            return t('merchant.orders.shippingInTransit')
        case ShippingStatus.ShippingDelivered:
            return t('merchant.orders.shippingDelivered')
        case ShippingStatus.ShippingConfirmed:
            return t('merchant.orders.shippingConfirmed')
        case ShippingStatus.ShippingCancelled:
            return t('merchant.orders.shippingCancelled')
        default:
            return t('merchant.orders.shippingPending')
    }
}
