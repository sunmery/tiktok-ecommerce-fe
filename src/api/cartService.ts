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
    UpsertItemResp,
    // API方法名常量导入
    UpsertItem,
    GetCart,
    EmptyCart,
    RemoveCartItem
} from '@/types/cart';
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
        return api.post<UpsertItemResp>(`${import.meta.env.VITE_CARTS_URL}/${UpsertItem}`, request);
    },

    /**
     * 获取购物车信息
     * GET /v1/carts
     */
    getCart: async (): Promise<GetCartResp> => {
        return api.get<GetCartResp>(`${import.meta.env.VITE_CARTS_URL}/${GetCart}`);
    },

    /**
     * 清空购物车
     * DELETE /v1/carts
     */
    emptyCart: async (): Promise<EmptyCartResp> => {
        return api.delete<EmptyCartResp>(`${import.meta.env.VITE_CARTS_URL}/${EmptyCart}`);
    },

    /**
     * 删除购物车商品
     * DELETE /v1/carts/item
     */
    removeCartItem: async (request: RemoveCartItemReq): Promise<RemoveCartItemResp> => {
        return api.delete<RemoveCartItemResp>(`${import.meta.env.VITE_CARTS_URL}/${RemoveCartItem}`, {
            body: JSON.stringify(request)
        });
    }
};
