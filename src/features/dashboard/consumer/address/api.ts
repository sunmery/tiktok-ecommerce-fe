import { httpClient } from "@/utils/http-client";
import {Address, DeleteAddressReply, DeleteAddressRequest, GetAddressesReply} from "./type";

// API路径常量
export const CreateAddress = 'address';
export const UpdateAddress = 'address';
export const DeleteAddress = 'address';
export const GetAddresses = 'addresses';

export const consumerAddressService = {
    /**
     * 创建用户地址
     * POST ${import.meta.env.VITE_USERS_URL}/address
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
     * PATCH ${import.meta.env.VITE_USERS_URL}/address
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
     * DELETE ${import.meta.env.VITE_USERS_URL}/address
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
     * GET ${import.meta.env.VITE_USERS_URL}/addresses
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

}
