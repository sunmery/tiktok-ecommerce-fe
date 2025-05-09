/**
 * 购物车服务API
 * 基于proto文件定义实现的购物车服务API
 */

import {Cart, EmptyCartResp, RemoveCartItemReq, RemoveCartItemResp, UpsertItemReq, UpsertItemResp,} from '@/types/cart';
import {api} from '@/api/config';

/**
 * 购物车服务API
 */
export const cartService = {
    /**
     * 新增购物车商品
     * POST /v1/carts
     */
    /**
     * 添加/更新购物车商品
     * @async
     * @param {UpsertItemReq} request - 商品更新请求参数
     * @property {string} request.productId - 商品ID
     * @property {string} request.merchantId - 商家ID
     * @property {number} request.quantity - 商品数量（必须大于0）
     * @returns {Promise<UpsertItemResp>} 包含操作结果的响应对象
     * @throws {Error} 当网络请求失败或返回错误状态码时抛出
     * @example
     * await cartService.upsertItem({
     *   productId: 'p123',
     *   merchantId: 'm456',
     *   quantity: 2
     * });
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
    /**
     * 清空整个购物车
     * @async
     * @returns {Promise<EmptyCartResp>} 包含操作结果的响应对象
     * @throws {Error} 当网络请求失败时抛出
     * @example
     * await cartService.emptyCart();
     */
    emptyCart: async (): Promise<EmptyCartResp> => {
        return api.delete<EmptyCartResp>(`${import.meta.env.VITE_CARTS_URL}`);
    },

    /**
     * 删除购物车商品
     * DELETE /v1/carts/item
     */
    /**
     * 从购物车移除指定商品
     * @async
     * @param {RemoveCartItemReq} request - 商品移除请求参数
     * @property {string} request.productId - 要移除的商品ID
     * @property {string} request.merchantId - 关联商家ID
     * @returns {Promise<RemoveCartItemResp>} 包含操作结果的响应对象
     * @throws {Error} 当商品不存在或网络请求失败时抛出
     * @example
     * await cartService.removeCartItem({
     *   productId: 'p123',
     *   merchantId: 'm456'
     * });
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
