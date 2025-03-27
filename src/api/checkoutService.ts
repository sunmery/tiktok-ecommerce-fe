/**
 * 结账服务API
 * 基于proto文件定义实现的结账服务API
 */

import {httpClient} from '@/utils/http-client';
import {CheckoutReq, CheckoutResp} from '@/types/checkout';

/**
 * 结账服务API
 */
export const checkoutService = {
    /**
     * 结账
     * POST /v1/checkout
     *
     * 支持两种方式结账：
     * 1. 通过提供完整的信用卡信息
     * 2. 通过提供地址ID和信用卡ID（推荐）
     */
    checkout: (request: CheckoutReq) => {
        return httpClient.post<CheckoutResp>(`${import.meta.env.VITE_CHECKOUT_URL}`, request);
    }
};
