import {httpClient} from '@/utils/http-client';

export interface MerchantAddress {
    id: number;
    merchantId: string;
    addressType: 'WAREHOUSE' | 'RETURN' | 'STORE' | 'BILLING' | 'HEADQUARTERS';
    contactPerson: string;
    contactPhone: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    remarks?: string;
}

export interface ListAddressesRequest {
    addressType?: MerchantAddress['addressType'];
    onlyDefault?: boolean;
    page?: number;
    pageSize?: number;
}

export interface ListAddressesResponse {
    addresses: MerchantAddress[];
    totalCount: number;
}

export const merchantService = {
    /**
     * 获取商家地址列表
     */
    listAddresses: (request: ListAddressesRequest) => {
        return httpClient.get<ListAddressesResponse>(
            `${import.meta.env.VITE_MERCHANTS_URL}/addresses`,
            {
                params: {
                    addressType: request.addressType,
                    onlyDefault: request.onlyDefault,
                    page: request.page,
                    pageSize: request.pageSize
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },
};