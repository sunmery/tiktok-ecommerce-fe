/**
 * 订单服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入时间戳类型
import { Timestamp } from './category';
// 导入购物车商品类型
import { CartItem } from './cart';
// 导入用户地址类型
import { Address } from "@/types/addresses";

// 订单项
export interface OrderItem {
  item: CartItem; // 购物车中的商品项
  cost: number; // 商品单价
}

// 支付状态枚举
export enum PaymentStatus {
  NOT_PAID = 0, // 未支付
  PROCESSING = 1, // 处理中
  PAID = 2, // 已支付
  FAILED = 3, // 支付失败
  CANCELLED = 4 // 取消支付
}

// 订单信息
export interface Order {
  order_items: OrderItem[]; // 订单项列表
  order_id: string; // 订单 ID
  user_id: string; // 用户 ID
  currency: string; // 货币代码（如 USD、CNY）
  address: Address; // 用户地址信息
  email: string; // 用户邮箱
  created_at: Timestamp; // 订单创建时间
  payment_status: PaymentStatus; // 支付状态
}

// 订单结果
export interface OrderResult {
  order_id: string; // 订单 ID
}

// 创建订单请求
export interface PlaceOrderReq {
  currency: string; // 货币代码（如 USD、CNY）
  address: Address; // 用户地址信息
  email: string; // 用户邮箱
  order_items: OrderItem[]; // 订单项列表
}

// 创建订单响应
export interface PlaceOrderResp {
  order: OrderResult; // 订单结果
  url: string; // 支付跳转 URL
}

// 查询订单列表请求
export interface ListOrderReq {
  page: number; // 分页参数：当前页码
  page_size: number; // 分页参数：每页大小
}

// 查询订单列表响应
export interface ListOrderResp {
  orders: Order[]; // 订单列表
}

// 标记订单为已支付请求
export interface MarkOrderPaidReq {
  order_id: string; // 订单 ID
}

// 标记订单为已支付响应
export interface MarkOrderPaidResp {}

// API路径常量
export const PlaceOrder = 'orders';
export const ListOrder = 'orders';
export const MarkOrderPaid = 'orders/paid';
export const UpdateOrderStatus = 'orders/status';