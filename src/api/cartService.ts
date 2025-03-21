/**
 * 购物车服务API
 * 基于proto文件定义实现的购物车服务API
 */

import {
    Cart,
    EmptyCartResp,
    RemoveCartItemReq,
    RemoveCartItemResp,
    UpsertItemReq,
    UpsertItemResp,
} from '@/types/carts';
import { api } from './config';

/**
 * 购物车服务API
 */
export const cartService = {
    /**
     * 新增购物车商品
     * POST /v1/carts
     */
    upsertItem: async (request: UpsertItemReq): Promise<UpsertItemResp> => {
        return api.post<UpsertItemResp>(`${import.meta.env.VITE_CARTS_URL}`, request);
    },

    /**
     * 获取购物车信息
     * GET /v1/carts
     */
    getCart: async (): Promise<Cart> => {
        return api.get<Cart>(`${import.meta.env.VITE_CARTS_URL}`);
    },

    /**
     * 清空购物车
     * DELETE /v1/carts
     */
    emptyCart: async (): Promise<EmptyCartResp> => {
        return api.delete<EmptyCartResp>(`${import.meta.env.VITE_CARTS_URL}`);
    },

    /**
     * 删除购物车商品
     * DELETE /v1/carts/item
     */
    removeCartItem: async (request: RemoveCartItemReq): Promise<RemoveCartItemResp> => {
        // 使用查询参数而不是请求体传递参数，因为DELETE请求通常不应该有请求体
        const params = new URLSearchParams({
            productId: request.productId,
            merchantId: request.merchantId
        });
        return api.delete<RemoveCartItemResp>(`${import.meta.env.VITE_CARTS_URL}/item?${params}`);
    }
};
