/**
 * 用户服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

import { Address } from "@/types/addresses";

// 时间戳类型（对应google.protobuf.Timestamp）
export interface Timestamp {
  seconds: number;
  nanos: number;
}

// 空请求类型（对应google.protobuf.Empty）
export interface Empty {}

// 信用卡信息
export interface CreditCard {
  number: string;
  cvv: string;
  expYear: string;
  expMonth: string;
  owner: string;
  name: string;
  id: number;
  type: string;
  brand: string;
  country: string;
  createdTime: string;
}

// 卡片操作响应
export interface CardsReply {
  message: string;
  code: number;
}

// 删除信用卡请求
export interface DeleteCreditCardRequest {
  id: number;
}

// 获取信用卡请求
export interface GetCreditCardRequest {
  userId: string;
  number: string;
}

// 获取信用卡响应
export interface GetCreditCardReply {
  creditCards: CreditCard;
}

// 搜索信用卡响应
export interface SearchCreditCardsReply {
  creditCards: CreditCard[];
}

// 列出信用卡响应
export interface ListCreditCardsReply {
  creditCards: CreditCard[];
}


// 更新地址请求
export interface UpdateAddressRequest {
  addresses: Address;
}

// 更新地址请求（proto定义）
export interface UpdateAddressesRequest {
  addresses: Address;
}

// 删除地址请求
export interface DeleteAddressRequest {
  addressesId: number;
  userId: string;
}

// 删除地址请求（proto定义）
export interface DeleteAddressesRequest {
  addressesId: number;
  userId: string;
}

// 地址响应
export interface AddressReply {
  id: number;
  address: Address;
}

// 获取地址列表响应
export interface GetAddressesReply {
  addresses: Address[];
}

// 删除地址响应
export interface DeleteAddressReply {
  message: string;
  id: number;
  code: number;
}

// 删除地址响应（proto定义）
export interface DeleteAddressesReply {
  message: string;
  id: number;
  code: number;
}

// 获取用户个人资料请求
export interface GetProfileRequest {}

// 获取用户个人资料响应
export interface GetProfileResponse {
  owner: string;
  name: string;
  avatar: string;
  email: string;
  id: string;
  role: string;
  displayName: string;
  isDeleted: boolean;
  createdTime: Timestamp;
  updatedTime: Timestamp;
}
