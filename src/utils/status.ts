import { PaymentMethod, PaymentStatus, ShippingStatus } from "@/types/status.ts";
import {ProductStatus} from "@/types/status.ts";
import {DefaultColorPalette} from "@mui/joy/styles/types";
import {t} from "i18next";

// 商品状态
export const translateProductStatus = (status: ProductStatus): string => {
    switch (status) {
        case ProductStatus.PRODUCT_STATUS_DRAFT:
            return t('products.status.draft');
        case ProductStatus.PRODUCT_STATUS_PENDING:
            return t('products.status.pending');
        case ProductStatus.PRODUCT_STATUS_APPROVED:
            return t('products.status.approved');
        case ProductStatus.PRODUCT_STATUS_REJECTED:
            return t('products.status.rejected');
        case ProductStatus.PRODUCT_STATUS_SOLD_OUT:
            return t('products.status.soldOut');
        default:
            return t('products.status.unknown', {status});
    }
}


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
            return 'neutral';
        case PaymentStatus.Cancelled:
            return 'neutral';
    }
};

// 物流状态映射
export const getShippingStatusColor = (shippingStatus: string): DefaultColorPalette => {
    switch (shippingStatus) {
        case ShippingStatus.ShippingWaitCommand:
            return 'primary';
        case ShippingStatus.ShippingPending:
            return 'primary';
        case ShippingStatus.ShippingShipped:
            return 'success';
        case ShippingStatus.ShippingInTransit:
            return 'primary';
        case ShippingStatus.ShippingDelivered:
            return 'success';
        case ShippingStatus.ShippingConfirmed:
            return 'success';
        case ShippingStatus.ShippingCancelled:
            return 'primary';
        default:
            return 'primary';
    }
}

// 获取状态文本
export const getStatusText = (status: string | PaymentStatus) => {
    // 如果是前端的OrderStatus（字符串枚举）
    switch (status) {
        case 'NOT_PAID':
            return t('orders.status.notPaid')
        case 'PENDING':
            return t('orders.status.pending')
        case 'PROCESSING':
            return t('orders.status.processing')
        case 'PAID':
            return t('orders.status.paid')
        case 'FAILED':
            return t('orders.status.failed')
        case 'CANCELLED':
            return t('orders.status.cancelled')
        default:
            return t('orders.status.unknown')
    }
}

// 物流状态映射
export const shippingStatus = (shippingStatus: string): string => {
    switch (shippingStatus) {
        case ShippingStatus.ShippingWaitCommand:
            return t('merchant.orders.shippingWaitCommand')
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
            return t('merchant.orders.unknown')
    }
}

export const transactionType = (type: string): string => {
    switch (type) {
        case 'RECHARGE':
            return t('transaction.type.RECHARGE')
        case 'PAYMENT':
            return t('transaction.type.PAYMENT')
        case 'REFUND':
            return t('transaction.type.REFUND')
        case 'WITHDRAW':
            return t('transaction.type.WITHDRAW')
        default:
            return t('common.unknown')
    }
}

export const paymentMethod = (method: string): string => {
    switch (method) {
        case PaymentMethod.PaymentMethodAliPay:
            return t('payment.method.ALIPAY')
        case PaymentMethod.PaymentMethodBalance:
            return t('payment.method.BALANCE')
        case PaymentMethod.PaymentMethodBankCard:
            return t('payment.method.BANK_CARD')
        default:
            return t('common.unknown')
    }
}
