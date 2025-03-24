/**
 * 购物车API封装
 * 提供购物车相关的操作函数
 */

import { cartService } from './cartService';
import type { CartItem as ApiCartItem } from '@/types/cart';
import { cartStore } from '@/store/cartStore';
import type { CartItem } from '@/types/cart';

/**
 * 获取购物车商品列表
 * @returns 购物车商品列表
 */
/**
 * 获取购物车商品列表
 * @async
 * @returns {Promise<CartItem[]>} 购物车商品列表
 * @example
 * const items = await getCartItems();
 * console.log(items);
 */
export const getCartItems = async () => {
  const response = await cartService.getCart();
  return response.items || [];
};

/**
 * 添加商品到购物车
 * @param item 要添加的商品信息
 */
/**
 * 添加商品到购物车
 * @async
 * @param {CartItem} item - 要添加的商品信息
 * @property {string} item.productId - 商品ID
 * @property {string} item.merchantId - 商家ID
 * @property {number} item.quantity - 商品数量
 * @returns {Promise<void>}
 * @throws {Error} 当添加失败时抛出错误
 * @example
 * await addToCart({
 *   productId: 'p123',
 *   merchantId: 'm456',
 *   quantity: 2
 * });
 */
export const addToCart = async (item: CartItem) => {
  return await cartService.upsertItem({
    productId: item.productId,
    merchantId: item.merchantId,
    quantity: item.quantity
  });
};

/**
 * 从购物车移除商品
 * @param productId 要移除的商品ID
 * @param merchantId 商家ID
 */
/**
 * 从购物车移除商品
 * @async
 * @param {string} productId - 要移除的商品ID
 * @param {string} merchantId - 商家ID
 * @returns {Promise<void>}
 * @throws {Error} 当移除失败时抛出错误
 * @example
 * await removeFromCart('p123', 'm456');
 */
export const removeFromCart = async (productId: string, merchantId: string) => {
  return await cartService.removeCartItem({ 
    productId: productId,
    merchantId: merchantId
  });
};

/**
 * 更新购物车商品数量
 * @param productId 商品ID
 * @param quantity 新的数量
 */
/**
 * 更新购物车商品数量
 * @async
 * @param {string} productId - 商品ID
 * @param {number} quantity - 新的数量（必须大于0）
 * @returns {Promise<void>}
 * @throws {Error} 当商品不存在或更新失败时抛出错误
 * @example
 * await updateCartItemQuantity('p123', 3);
 */
export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  // 从本地购物车中查找商品，获取merchantId
  const localItem = cartStore.items.find(item => item.productId === productId);
  if (!localItem) {
    throw new Error('商品不存在于购物车中');
  }
  
  return await cartService.upsertItem({
    productId: productId,
    merchantId: localItem.merchantId,
    quantity: quantity
  });
};

/**
 * 清空购物车
 */
/**
 * 清空购物车
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 当清空操作失败时抛出错误
 * @example
 * await clearCart();
 */
export const clearCart = async () => {
  return await cartService.emptyCart();
};
