/**
 * 用户服务API
 * 基于proto文件定义实现的用户服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    // API方法名常量导入
    CreateAddress,
    UpdateAddress,
    DeleteAddress,
    GetAddresses,
    ListCreditCards,
    CreateCreditCard,
    UpdateCreditCard,
    DeleteCreditCard,
    GetCreditCard,
    DeleteAddressReply,
    GetAddressesReply
} from '@/types/user';
import {
    CardsReply,
    CreditCard,
    DeleteCreditCardRequest,
    GetCreditCardReply,
    GetCreditCardRequest,
    ListCreditCardsReply
} from '@/types/creditCards';
import {Address, DeleteAddressRequest} from '@/types/addresses'

/**
 * 用户服务API
 */
export const userService = {

    /**
     * 创建用户地址
     * POST /v1/users/address
     */
    createAddress: (address: Address) => {
        return httpClient.post<Address>(`${import.meta.env.VITE_USERS_URL}/${CreateAddress}`, {
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
        const token = localStorage.getItem('token');
        return httpClient.patch<Address>(`${import.meta.env.VITE_USERS_URL}/${UpdateAddress}`, {
            id: address.id,
            userId: address.userId,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * 删除用户地址
     * DELETE /v1/users/address
     */
    deleteAddress: (request: DeleteAddressRequest) => {
        return httpClient.delete<DeleteAddressReply>(`${import.meta.env.VITE_USERS_URL}/${DeleteAddress}`, {
           params: {
               addressesId: request.addressesId,
               userId: request.userId
           }
        });
    },

    /**
     * 获取用户地址列表
     * GET /v1/users/addresses
     */
    getAddresses: () => {
        const token = localStorage.getItem('token');
        return httpClient.get<GetAddressesReply>(`${import.meta.env.VITE_USERS_URL}/${GetAddresses}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * 列出用户的信用卡信息
     * GET /v1/users/credit_cards
     */
    listCreditCards: () => {
        return httpClient.get<ListCreditCardsReply>(`${import.meta.env.VITE_USERS_URL}/${ListCreditCards}`);
    },

    /**
     * 创建用户的信用卡信息
     * POST /v1/users/creditCards
     */
    createCreditCard: (creditCard: CreditCard) => {
        return httpClient.post<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${CreateCreditCard}`, creditCard);
    },

    /**
     * 更新用户的信用卡信息
     * PATCH /v1/users/creditCards
     */
    updateCreditCard: (creditCard: CreditCard) => {
        return httpClient.patch<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${UpdateCreditCard}`, creditCard);
    },

    /**
     * 删除用户的信用卡信息
     * DELETE /v1/users/creditCards/{id}
     */
    deleteCreditCard: (request: DeleteCreditCardRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${DeleteCreditCard}/{id}`, {
            id: request.id,
        });
        return httpClient.delete<CardsReply>(url);
    },

    /**
     * 获取用户的信用卡信息
     * GET /v1/users/credit_cards/{id}
     */
    getCreditCard: (request: GetCreditCardRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${GetCreditCard}/{id}`, {
            id: request.id
        });
        return httpClient.get<GetCreditCardReply>(url, {
            params: {userId: request.userId} as Record<string, string>,
        });
    },
};
