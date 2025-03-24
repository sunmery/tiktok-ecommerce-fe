/**
 * 结账服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入信用卡类型
import { CreditCard } from './creditCards';

// 结账请求
export interface CheckoutReq {
  userId?: number; // 用户 ID（可选），如果用户未注册，则可以为空
  firstname: string; // 用户的名字（必填），允许非注册用户直接填写信息下单
  lastname: string; // 用户的姓氏（必填）
  email: string; // 用户的邮箱地址（必填），用于接收订单确认邮件等
  creditCard?: CreditCard; // 用户的信用卡信息，可选，如果提供了creditCardId则不需要
  addressId?: number; // 用户的地址ID，用于关联用户地址
  creditCardId?: number; // 用户的信用卡ID，用于关联用户信用卡
}

// 结账响应
export interface CheckoutResp {
  orderId: string; // 唯一标识订单，用于后续查询、退换货等操作
  transactionId: string; // 支付事务唯一标识，用于与支付网关对账或处理支付相关问题
}

// API路径常量
export const Checkout = 'checkout';
