/**
 * 用户服务API
 * 基于proto文件定义实现的用户服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    CreateAddress,
    CreateCreditCard,
    DeleteAddress,
    DeleteAddressReply,
    DeleteCreditCard,
    GetAddresses,
    GetAddressesReply,
    GetCreditCard,
    ListCreditCards,
    UpdateAddress,
    UpdateCreditCard, UserProfile, Users
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
import {EditUserForm} from "@/types/admin.ts";

/**
 * 用户服务API
 */
export const userService = {
    /**
     * 获取用户列表
     * GET /v1/users
     */
    listUsers: () => {
        return httpClient.get<Users>('/v1/users');
    },

    /**
     * 更新用户信息
     * POST /v1/users/{user_id}
     */
    updateUser: (userId: string, userData: EditUserForm) => {
        return httpClient.post<{ status: string, code: number }>(`/v1/users/${userId}`, {
            userId,
            owner: userData.owner || '',
            name: userData.name,
            avatar: userData.avatar || '',
            email: userData.email,
            displayName: userData.displayName || userData.name,
            signupApplication: userData.signupApplication || '',
            role: userData.role
        });
    },

    /**
     * 删除用户
     * POST /v1/users
     */
    deleteUser: (userId: string, owner: string, name: string) => {
        return httpClient.post<{ status: string, code: number }>('/v1/users', {
            userId,
            owner,
            name
        });
    },

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
