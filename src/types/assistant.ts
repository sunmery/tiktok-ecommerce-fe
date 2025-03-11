/**
 * 助手服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 处理请求
export interface ProcessRequest {
  question: string;
}

// 订单响应
export interface OrderResponse {
  id: string;
  product: string;
  status: string;
  createdAt: number;
}

// 订单列表
export interface OrderList {
  orders: OrderResponse[];
}

// 处理响应
export interface ProcessResponse {
  order?: OrderResponse;
  orders?: OrderList;
  message?: string;
}