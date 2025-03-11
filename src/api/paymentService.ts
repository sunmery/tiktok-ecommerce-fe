/**
 * 支付服务API
 * 基于proto文件定义实现的支付服务API
 */

import { httpClient } from '@/utils/http-client';
import {
  CreatePaymentReq,
  GetPaymentReq,
  PaymentCallbackReq,
  PaymentCallbackResp,
  PaymentNotifyReq,
  PaymentNotifyResp,
  PaymentResp
} from '@/types/payment';

/**
 * 支付服务API
 */
export const paymentService = {
  /**
   * 创建支付记录
   * POST /v1/payments
   */
  createPayment: (request: CreatePaymentReq) => {
    return httpClient.post<PaymentResp>('/v1/payments', request);
  },

  /**
   * 异步通知接口
   * POST /v1/payments/notify
   */
  paymentNotify: (request: PaymentNotifyReq) => {
    return httpClient.post<PaymentNotifyResp>('/v1/payments/notify', request);
  },

  /**
   * 支付宝回调处理接口
   * POST /v1/payments/callback
   */
  processPaymentCallback: (request: PaymentCallbackReq) => {
    return httpClient.post<PaymentCallbackResp>('/v1/payments/callback', request);
  },

  /**
   * 获取支付信息接口
   * GET /v1/payments/{paymentId}
   */
  getPayment: (request: GetPaymentReq) => {
    const url = httpClient.replacePathParams('/v1/payments/{paymentId}', {
      paymentId: request.paymentId
    });
    return httpClient.get<PaymentResp>(url);
  }
};
