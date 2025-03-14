/**
 * 支付服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入时间戳类型
import { Timestamp } from './user';

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
  order_id: string;
  currency: string;
  amount: string;
  payment_method: string;
}

// 支付响应
export interface PaymentResp {
  payment_id: string;
  status: string;
  payment_url: string;
  created_at: Timestamp;
}

// 获取支付信息请求
export interface GetPaymentReq {
  payment_id: string;
}

// 支付回调请求
export interface PaymentCallbackReq {
  payment_id: string;
  status: string;
  gateway_response: string;
  processed_at: Timestamp;
  request_form: Record<string, StringList>;
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