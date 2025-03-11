/**
 * 结账服务API
 * 基于proto文件定义实现的结账服务API
 */

import { httpClient } from '@/utils/http-client';
import { CheckoutReq, CheckoutResp } from '@/types/checkout';

/**
 * 结账服务API
 */
export const checkoutService = {
  /**
   * 结账
   * POST /v1/checkout
   */
  checkout: (request: CheckoutReq) => {
    return httpClient.post<CheckoutResp>('/v1/checkout', request);
  }
};
