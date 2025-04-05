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
    UpdateCreditCard,
    Users
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

import SDK from 'casdoor-js-sdk'
import {CASDOOR_CONF} from '@/core/conf/casdoor.ts'

// 服务端的URL, 非casdoor的地址
export const userServer: string = import.meta.env.VITE_USERS_URL

// 读取配置
export const CASDOOR_SDK = new SDK(CASDOOR_CONF)


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

    // 获取登录接口的URL
    getSigninUrl: () => {
        return CASDOOR_SDK.getSigninUrl()
    },
    // 设置token
    setToken: (token: string) => {
        localStorage.setItem('token', token)
    },
    // 判断是否登录
    isLoggedIn: () => {
        const token = localStorage.getItem('token')
        return token !== null && token.length > 0
    },
    // 使用React Router进行导航，避免页面刷新
    goToLink: (link: string) => {
        // 检查是否在React Router环境中
        if (typeof window !== 'undefined' && window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE) {
            // 使用React Router的导航API
            const router = window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE.router;
            if (router) {
                router.navigate({to: link, replace: true});
                return;
            }
        }

        // 如果不在React Router环境中，则使用传统方式
        window.location.replace(link);
    },
    // 获取用户信息
    getUserinfo: async () => {
        try {
            const baseUrl = import.meta.env.VITE_URL;
            if (!baseUrl || !userServer) {
                new Error('环境变量VITE_URL或VITE_USERS_URL未配置');
            }

            const res = await fetch(`${baseUrl}${userServer}/profile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            // 检查响应内容类型
            const contentType = res.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                return await res.json()
            } else {
                // 非JSON响应，可能是HTML或其他格式
                const text = await res.text()
                console.error('获取用户信息失败：非JSON响应', text)
                new Error(`预期JSON响应但获得了${contentType || '未知内容类型'}`)
            }
        } catch (error) {
            console.error('获取用户信息时出错:', error)
            // 返回一个空对象，避免在UI层出现更多错误
            return {}
        }
    },
    // 登出
    logout: () => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    }
};
