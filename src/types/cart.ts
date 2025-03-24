/**
 * 购物车相关类型定义
 */

export interface CartItem {
    merchantId: string;
    productId: string;
    quantity: number;
    price?: number;        // 可选字段（兼容服务端数据）
    totalPrice?: number;  // 可选字段（前端计算字段）
    name?: string;        // 商品名称（前端扩展）
    picture?: string;     // 商品图片（前端扩展）
    selected?: boolean;   // 选择状态（前端特有）
}

// 购物车操作响应类型
/**
 * 购物车数据结构
 * @property {CartItem[]} items - 购物车中的商品项列表
 * @example
 * {
 *   items: [
 *     {
 *       merchantId: 'm123',
 *       productId: 'p456',
 *       quantity: 2,
 *       selected: true
 *     }
 *   ]
 * }
 */
export interface Cart {
    items: CartItem[];
}

/**
 * 添加/更新购物车商品请求类型
 * @property {string} merchantId - 商家ID
 * @property {string} productId - 商品ID
 * @property {number} quantity - 商品数量（必须大于0）
 */
export interface UpsertItemReq {
    merchantId: string;
    productId: string;
    quantity: number;
}

/**
 * 购物车操作响应类型
 * @property {boolean} success - 操作是否成功
 * @property {string} [message] - 可选，操作结果消息
 * @property {number} [code] - 可选，状态码
 * @example
 * {
 *   success: true,
 *   message: '商品已加入购物车',
 *   code: 200
 * }
 */
export interface CartResponse {
    success: boolean
    message?: string
    code?: number
}