/**
 * 购物车服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 空请求类型（对应google.protobuf.Empty）
export interface Empty {}

// 购物车商品
export interface CartItem {
    merchantId: string; // 商家ID
    productId: string;  // 商品ID
    quantity: number;   // 商品数量
    price: number;      // 商品价格
}

// 购物车信息
export interface Cart {
    items: CartItem[];   // 购物车商品列表
}

// 新增购物车商品请求
export interface UpsertItemReq {
    item: CartItem;
}

// 新增购物车商品响应
export interface UpsertItemResp {
    success: boolean;  // 操作是否成功
}

// 获取购物车请求
export interface GetCartReq {
    userId: string;
}

// 获取购物车响应
export interface GetCartResp {
    cart: Cart;
}

// 清空购物车请求
export interface EmptyCartReq {}

// 清空购物车响应
export interface EmptyCartResp {
    success: boolean;  // 操作是否成功
}

// 删除购物车商品请求
export interface RemoveCartItemReq {
    merchantId: string;
    productId: string;
}

// 删除购物车商品响应
export interface RemoveCartItemResp {
    success: boolean;  // 操作是否成功
}
