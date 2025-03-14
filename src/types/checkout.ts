/**
 * 结账服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入用户服务中的信用卡类型
import { CreditCard } from './user';

// 结账请求
export interface CheckoutReq {
  user_id?: number; // 用户 ID（可选），如果用户未注册，则可以为空
  firstname: string; // 用户的名字（必填），允许非注册用户直接填写信息下单
  lastname: string; // 用户的姓氏（必填）
  email: string; // 用户的邮箱地址（必填），用于接收订单确认邮件等
  credit_card: CreditCard; // 用户的信用卡信息（必填），用于支付
}

// 结账响应
export interface CheckoutResp {
  order_id: string; // 唯一标识订单，用于后续查询、退换货等操作
  transaction_id: string; // 支付事务唯一标识，用于与支付网关对账或处理支付相关问题
}

// API路径常量
export const Checkout = 'checkout';
