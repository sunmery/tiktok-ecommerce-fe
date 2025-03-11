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

// 获取购物车API基础URL
const CARTS_URL = `${import.meta.env.VITE_URL}${import.meta.env.VITE_CARTS_URL}`;

/**
 * 购物车服务API
 */
export const cartService = {
    /**
     * 新增购物车商品
     * POST /v1/carts
     */
    upsertItem: async (request: UpsertItemReq): Promise<UpsertItemResp> => {
        const response = await fetch(`${CARTS_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },

    /**
     * 获取购物车信息
     * GET /v1/carts
     */
    getCart: async (): Promise<GetCartResp> => {
        const response = await fetch(`${CARTS_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },

    /**
     * 清空购物车
     * DELETE /v1/carts
     */
    emptyCart: async (): Promise<EmptyCartResp> => {
        const response = await fetch(`${CARTS_URL}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    },

    /**
     * 删除购物车商品
     * DELETE /v1/carts/item
     */
    removeCartItem: async (request: RemoveCartItemReq): Promise<RemoveCartItemResp> => {
        const response = await fetch(`${CARTS_URL}/item`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }
};
