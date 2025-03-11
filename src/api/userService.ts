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
    return httpClient.get<GetProfileResponse>('/v1/users/profile');
  },

  /**
   * 创建用户地址
   * POST /v1/users/address
   */
  createAddress: (address: Address) => {
    // 确保使用下划线命名格式发送请求，与后端接口匹配
    return httpClient.post<Address>('/v1/users/address', {
      id: address.id,
      userId: address.userId,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode
    });
  },

  /**
   * 更新用户地址
   * PATCH /v1/users/address
   */
  updateAddress: (address: Address) => {
    // 确保使用下划线命名格式发送请求，与后端接口匹配
    return httpClient.patch<Address>('/v1/users/address', {
      id: address.id,
      userId: address.userId,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode
    });
  },

  /**
   * 删除用户地址
   * DELETE /v1/users/address
   */
  deleteAddress: (request: DeleteAddressRequest) => {
    return httpClient.delete<DeleteAddressReply>('/v1/users/address', {
      params: {
        addressesId: request.addressesId,
        userId: request.userId
      } as unknown as Record<string, string>,
    });
  },

  /**
   * 获取用户地址列表
   * GET /v1/users/address
   */
  getAddresses: () => {
    const token = localStorage.getItem('token');
    return httpClient.get<GetAddressesReply>('/v1/users/address', {
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
    return httpClient.get<ListCreditCardsReply>('/v1/users/credit_cards/all');
  },

  /**
   * 创建用户的信用卡信息
   * POST /v1/users/credit_cards
   */
  createCreditCard: (creditCard: CreditCard) => {
    return httpClient.post<CardsReply>('/v1/users/credit_cards', creditCard);
  },

  /**
   * 更新用户的信用卡信息
   * PATCH /v1/users/credit_cards
   */
  updateCreditCard: (creditCard: CreditCard) => {
    return httpClient.patch<CardsReply>('/v1/users/credit_cards', creditCard);
  },

  /**
   * 删除用户的信用卡信息
   * DELETE /v1/users/credit_cards/{id}
   */
  deleteCreditCard: (request: DeleteCreditCardRequest) => {
    const url = httpClient.replacePathParams('/v1/users/credit_cards/{id}', {
      id: request.id,
    });
    return httpClient.delete<CardsReply>(url);
  },

  /**
   * 获取用户的信用卡信息
   * GET /v1/users/credit_cards/{number}
   */
  getCreditCard: (request: GetCreditCardRequest) => {
    const url = httpClient.replacePathParams('/v1/users/credit_cards/{number}', {
      number: request.number,
    });
    return httpClient.get<GetCreditCardReply>(url, {
      params: { userId: request.userId } as Record<string, string>,
    });
  },
};
