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
  PaymentStatus,
  // API方法名常量导入
  PlaceOrder,
  ListOrder,
  MarkOrderPaid,
  UpdateOrderStatus
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
    return httpClient.post<PlaceOrderResp>(`${import.meta.env.VITE_ORDERS_URL}/${PlaceOrder}`, request);
  },

  /**
   * 查询订单列表
   * GET /v1/orders
   */
  listOrder: (request: ListOrderReq) => {
    return httpClient.get<ListOrderResp>(`${import.meta.env.VITE_ORDERS_URL}/${ListOrder}`, {
      params: request as unknown as Record<string, string>
    });
  },

  /**
   * 标记订单为已支付
   * POST /v1/orders/{orderId}/paid
   */
  markOrderPaid: (request: MarkOrderPaidReq) => {
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_ORDERS_URL}/${MarkOrderPaid}/{order_id}`, {
      order_id: request.order_id
    });
    return httpClient.post<MarkOrderPaidResp>(url, {});
  },

  /**
   * 更新订单状态
   * PUT /v1/orders/{orderId}/status
   */
  updateOrderStatus: (order_id: string, status: PaymentStatus) => {
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_ORDERS_URL}/${UpdateOrderStatus}/{order_id}`, {
      order_id: order_id
    });
    return httpClient.put(url, { status });
  }
};
