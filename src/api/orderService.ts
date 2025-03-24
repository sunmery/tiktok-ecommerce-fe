/**
 * 订单服务API
 * 基于proto文件定义实现的订单服务API
 */

import { httpClient } from '@/utils/http-client';
import {
  PlaceOrderReq,
  PlaceOrderResp,
  ListOrderReq,
  ListOrderResp, MarkOrderPaidReq, MarkOrderPaidResp,
} from '@/types/orders';

/**
 * 订单服务API
 */
export const orderService = {
  /**
   * 创建订单
   * POST /v1/orders
   */
  placeOrder: (request: PlaceOrderReq) => {
    return httpClient.post<PlaceOrderResp>(
      `${import.meta.env.VITE_ORDERS_URL}`,
      {
        currency: request.currency,
        address: request.address,
        email: request.email,
        orderItems: request.orderItems.map(item => ({
          item: item.item,
          cost: item.cost
        }))
      }
    );
  },

  /**
   * 查询订单列表（带分页参数）
   * GET /v1/orders
   */
  listOrder: (request: ListOrderReq) => {
    return httpClient.get<ListOrderResp>(
      `${import.meta.env.VITE_ORDERS_URL}`, 
      {
        params: {
          page: request.page?.toString(),
          pageSize: request.pageSize?.toString()
        }
      }
    );
  },

  /**
   * 标记订单为已支付
   * POST /v1/orders/{orderId}/paid
   */
  markOrderPaid: (request: MarkOrderPaidReq) => {
    const url = httpClient.replacePathParams(
      `${import.meta.env.VITE_ORDERS_URL}/{orderId}`,
      { orderId: request.orderId }
    );
    return httpClient.post<MarkOrderPaidResp>(url, {
      orderId: request.orderId
    });
  },
};
