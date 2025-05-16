/**
 * 用户服务API
 * 基于proto文件定义实现的用户服务API
 */

import { httpClient } from '@/utils/http-client';
import {
    CreateCreditCard,
    DeleteCreditCard,
    GetCreditCard,
    ListCreditCards,
    UpdateCreditCard,
    UpdateFavoritesRequest
} from '@/types/user';

import {
    CardsReply,
    CreditCard,
    DeleteCreditCardRequest,
    GetCreditCardReply,
    GetCreditCardRequest,
    ListCreditCardsReply
} from "@/features/dashboard/consumer/creditCard/type.ts";
import { Products } from "@/features/products/types.ts";

// 服务端的URL, 非casdoor的地址
export const userServer: string = import.meta.env.VITE_USERS_URL
/**
 * 用户服务API
 */
export const userService = {
    /**
     * 添加商品收藏
     * @param request UpdateFavoritesRequest
     */
    addFavorite: (request: UpdateFavoritesRequest) => {
        return httpClient.put<{ message: string, code: number }>(`${import.meta.env.VITE_USERS_URL}/favorites`, {
            productId: request.productId,
            merchantId: request.merchantId,
        });
    },

    /**
     * 删除当前用户收藏
     * @param request UpdateFavoritesRequest
     */
    deleteFavorites: (request: UpdateFavoritesRequest) => {
        return httpClient.delete<{ message: string, code: number }>(`${import.meta.env.VITE_USERS_URL}/favorites`, {
            params: {
                productId: request.productId,
                merchantId: request.merchantId,
            },
        });
    },

    /**
     * 获取当前用户收藏
     */
    getFavorites: (page: number, pageSize: number) => {
        return httpClient.get<Products>(`${import.meta.env.VITE_USERS_URL}/favorites`, {
            params: {page, pageSize},
        });
    },

    /**
     * 列出用户的信用卡信息
     * GET ${import.meta.env.VITE_USERS_URL}/credit_cards
     */
    listCreditCards: () => {
        return httpClient.get<ListCreditCardsReply>(`${import.meta.env.VITE_USERS_URL}/${ListCreditCards}`);
    },

    /**
     * 创建用户的信用卡信息
     * POST ${import.meta.env.VITE_USERS_URL}/creditCards
     */
    createCreditCard: (creditCard: CreditCard) => {
        return httpClient.post<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${CreateCreditCard}`, creditCard);
    },

    /**
     * 更新用户的信用卡信息
     * PATCH ${import.meta.env.VITE_USERS_URL}/creditCards
     */
    updateCreditCard: (creditCard: CreditCard) => {
        return httpClient.patch<CardsReply>(`${import.meta.env.VITE_USERS_URL}/${UpdateCreditCard}`, creditCard);
    },

    /**
     * 删除用户的信用卡信息
     * DELETE ${import.meta.env.VITE_USERS_URL}/creditCards/{id}
     */
    deleteCreditCard: (request: DeleteCreditCardRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${DeleteCreditCard}/{id}`, {
            id: request.id,
        });
        return httpClient.delete<CardsReply>(url);
    },

    /**
     * 获取用户的信用卡信息
     * GET ${import.meta.env.VITE_USERS_URL}/credit_cards/{id}
     */
    getCreditCard: (request: GetCreditCardRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_USERS_URL}/${GetCreditCard}/{id}`, {
            id: request.id
        });
        return httpClient.get<GetCreditCardReply>(url, {
            params: {userId: request.userId} as Record<string, string>,
        });
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
    },
    getUsers:()=>{
        return httpClient.get(`${import.meta.env.VITE_USERS_URL}`)
    }
};
