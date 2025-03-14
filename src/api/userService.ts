/**
 * 用户服务API
 * 基于proto文件定义实现的用户服务API
 */

import { httpClient } from '@/utils/http-client';
import {
  CardsReply,
  CreditCard,
  DeleteAddressReply,
  DeleteAddressRequest,
  DeleteCreditCardRequest,
  GetAddressesReply,
  GetCreditCardReply,
  GetCreditCardRequest,
  GetProfileResponse,
  ListCreditCardsReply,
  // API方法名常量导入
  GetProfile,
  CreateAddress,
  UpdateAddress,
  DeleteAddress,
  GetAddresses,
  ListCreditCards,
  CreateCreditCard,
  UpdateCreditCard,
  DeleteCreditCard,
  GetCreditCard
} from '@/types/user';
import {Address} from '@/types/addresses.ts'

/**
 * 用户服务API
 */
export const userService = {
  /**
   * 获取用户个人资料
   * GET /v1/users/profile
   */
  getUserProfile: () => {
    return httpClient.get<GetProfileResponse>(`${import.meta.env.VITE_USERS_URL}/${GetProfile}`);
  },

  /**
   * 创建用户地址
   * POST /v1/users/address
   */
  createAddress: (address: Address) => {
    return httpClient.post<Address>(`${import.meta.env.VITE_USERS_URL}/${CreateAddress}`, {
      id: address.id,
      user_id: address.user_id,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      country: address.country,
      zip_code: address.zip_code
    });
  },

  /**
   * 更新用户地址
   * PATCH /v1/users/address
   */
  updateAddress: (address: Address) => {
    return httpClient.patch<Address>(`${import.meta.env.VITE_USERS_URL}/${UpdateAddress}`, {
      id: address.id,
      user_id: address.user_id,
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      country: address.country,
      zip_code: address.zip_code
    });
  },

  /**
   * 删除用户地址
   * DELETE /v1/users/address
   */
  deleteAddress: (request: DeleteAddressRequest) => {
    return httpClient.delete<DeleteAddressReply>(`${import.meta.env.VITE_USERS_URL}/${DeleteAddress}`, {
      params: {
        addresses_id: request.addresses_id,
        user_id: request.user_id
      } as unknown as Record<string, string>,
    });
  },

  /**
   * 获取用户地址列表
   * GET /v1/users/address
   */
  getAddresses: () => {
    const token = localStorage.getItem('token');
    return httpClient.get<GetAddressesReply>(`${import.meta.env.VITE_USERS_URL}/${GetAddresses}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  },

  /**
   * 列出用户的信用卡信息
   * GET /v1/users/credit_cards/all
   */
  listCreditCards: () => {
    return httpClient.get<ListCreditCardsReply>(`${import.meta.env.VITE_USERS_URL}/${ListCreditCards}`);
  },

  /**
   * 创建用户的信用卡信息
   * POST /v1/users/credit_cards
   */
  createCreditCard: (creditCard: CreditCard) => {
    return httpClient.post<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${CreateCreditCard}`, creditCard);
  },

  /**
   * 更新用户的信用卡信息
   * PATCH /v1/users/credit_cards
   */
  updateCreditCard: (creditCard: CreditCard) => {
    return httpClient.patch<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${UpdateCreditCard}`, creditCard);
  },

  /**
   * 删除用户的信用卡信息
   * DELETE /v1/users/credit_cards/{id}
   */
  deleteCreditCard: (request: DeleteCreditCardRequest) => {
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${DeleteCreditCard}/{id}`, {
      id: request.id,
    });
    return httpClient.delete<CardsReply>(url);
  },

  /**
   * 获取用户的信用卡信息
   * GET /v1/users/credit_cards/{number}
   */
  getCreditCard: (request: GetCreditCardRequest) => {
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${GetCreditCard}/{number}`, {
      number: request.number,
    });
    return httpClient.get<GetCreditCardReply>(url, {
      params: { user_id: request.user_id } as Record<string, string>,
    });
  },
};
