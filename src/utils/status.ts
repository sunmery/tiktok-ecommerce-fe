import {PaymentStatus} from "@/types/orders";
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
