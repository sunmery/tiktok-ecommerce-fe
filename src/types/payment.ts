/**
 * 支付服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入时间戳类型
import {Timestamp} from './user';

// 字符串列表类型
export interface StringList {
    values: string[];
}

// 支付异步通知请求
export interface PaymentNotifyReq {
    values: Record<string, StringList>;
}

// 支付异步通知响应
export interface PaymentNotifyResp {
    code: string;
    msg: string;
}

// 创建支付请求
export interface CreatePaymentReq {
    orderId: string;
    currency: string;
    amount: string;
    paymentMethod: string;
}

// 支付响应
export interface PaymentResp {
    paymentId: string;
    status: string;
    paymentUrl: string;
    createdAt: Timestamp;
}

// 获取支付信息请求
export interface GetPaymentReq {
    paymentId: string;
}

// 支付回调请求
export interface PaymentCallbackReq {
    paymentId: string;
    status: string;
    gatewayResponse: string;
    processedAt: Timestamp;
    requestForm: Record<string, StringList>;
}

// 支付回调响应
export interface PaymentCallbackResp {
    // 目前为空
}

// API路径常量
export const CreatePayment = 'payments';
export const PaymentNotify = 'payments/notify';
export const ProcessPaymentCallback = 'payments/callback';
export const GetPayment = 'payments';
