/**
 * 订单服务API
 * 基于proto文件定义实现的订单服务API
 */

import { httpClient } from '@/utils/http-client';
import {
  PlaceOrderReq,
  PlaceOrderResp,
  ListOrderReq,
  ListOrderResp,
  MarkOrderPaidReq,
  MarkOrderPaidResp,
  PaymentStatus
} from '@/types/order';

/**
 * 订单服务API
 */
export const orderService = {
  /**
   * 创建订单
   * POST /v1/orders
   */
  placeOrder: (request: PlaceOrderReq) => {
    return httpClient.post<PlaceOrderResp>('/v1/orders', request);
  },

  /**
   * 查询订单列表
   * GET /v1/orders
   */
  listOrder: (request: ListOrderReq) => {
    return httpClient.get<ListOrderResp>('/v1/orders', {
      params: request as unknown as Record<string, string>
    });
  },

  /**
   * 标记订单为已支付
   * POST /v1/orders/{orderId}/paid
   */
  markOrderPaid: (request: MarkOrderPaidReq) => {
    const url = httpClient.replacePathParams('/v1/orders/{orderId}/paid', {
      orderId: request.orderId
    });
    return httpClient.post<MarkOrderPaidResp>(url, {});
  },

  /**
   * 更新订单状态
   * PUT /v1/orders/{orderId}/status
   */
  updateOrderStatus: (orderId: string, status: PaymentStatus) => {
    const url = httpClient.replacePathParams('/v1/orders/{orderId}/status', {
      orderId: orderId
    });
    return httpClient.put(url, { status });
  }
};
