/**
 * 购物车服务API
 * 基于proto文件定义实现的购物车服务API
 */

import {
    EmptyCartReq,
    EmptyCartResp,
    GetCartReq,
    GetCartResp,
    RemoveCartItemReq,
    RemoveCartItemResp,
    UpsertItemReq,
    UpsertItemResp
} from '@/types/cart';
import { api } from './config';

// 获取购物车API基础URL
const CARTS_URL = `${import.meta.env.VITE_CARTS_URL}`;

/**
 * 购物车服务API
 */
export const cartService = {
    /**
     * 新增购物车商品
     * POST /v1/carts
     */
    upsertItem: async (request: UpsertItemReq): Promise<UpsertItemResp> => {
        return api.post<UpsertItemResp>(CARTS_URL, request);
    },

    /**
     * 获取购物车信息
     * GET /v1/carts
     */
    getCart: async (): Promise<GetCartResp> => {
        return api.get<GetCartResp>(CARTS_URL);
    },

    /**
     * 清空购物车
     * DELETE /v1/carts
     */
    emptyCart: async (): Promise<EmptyCartResp> => {
        return api.delete<EmptyCartResp>(CARTS_URL);
    },

    /**
     * 删除购物车商品
     * DELETE /v1/carts/item
     */
    removeCartItem: async (request: RemoveCartItemReq): Promise<RemoveCartItemResp> => {
        return api.delete<RemoveCartItemResp>(`${CARTS_URL}/item`, {
            body: JSON.stringify(request)
        });
    }
};
