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
  exp_year: string;
  exp_month: string;
  owner: string;
  name: string;
  id: number;
  type: string;
  brand: string;
  country: string;
  created_time: string;
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
  user_id: string;
  number: string;
}

// 获取信用卡响应
export interface GetCreditCardReply {
  credit_cards: CreditCard;
}

// 搜索信用卡响应
export interface SearchCreditCardsReply {
  credit_cards: CreditCard[];
}

// 列出信用卡响应
export interface ListCreditCardsReply {
  credit_cards: CreditCard[];
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
  addresses_id: number;
  user_id: string;
}

// 删除地址请求（proto定义）
export interface DeleteAddressesRequest {
  addresses_id: number;
  user_id: string;
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
  display_name: string;
  is_deleted: boolean;
  created_time: Timestamp;
  updated_time: Timestamp;
}

// API路径常量
export const GetProfile = 'users/profile';
export const CreateAddress = 'users/address';
export const UpdateAddress = 'users/address';
export const DeleteAddress = 'users/address';
export const GetAddresses = 'users/address';
export const ListCreditCards = 'users/credit_cards/all';
export const CreateCreditCard = 'users/credit_cards';
export const UpdateCreditCard = 'users/credit_cards';
export const DeleteCreditCard = 'users/credit_cards';
export const GetCreditCard = 'users/credit_cards';
