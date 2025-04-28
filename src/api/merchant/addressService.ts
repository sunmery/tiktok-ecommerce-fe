/**
 * 商家地址管理API
 */

import { fetchApi } from '../config';

// 地址类型枚举
export enum MerchantAddressType {
  WAREHOUSE = 0,    // 仓库地址
  RETURN = 1,       // 退货地址
  STORE = 2,        // 门店地址
  BILLING = 3,      // 财务地址
  HEADQUARTERS = 4, // 总部地址
}

// 地址数据接口
export interface MerchantAddress {
  id: number;
  merchantId: string;
  addressType: MerchantAddressType;
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

// 地址列表请求参数
export interface ListAddressesRequest {
  merchantId?: string;
  page: number;
  pageSize: number;
}

// 地址过滤列表请求参数
export interface ListFilterAddressesRequest {
  merchantId: string;
  addressType?: MerchantAddressType;
  page: number;
  pageSize: number;
}

// 获取默认地址请求参数
export interface GetDefaultAddressRequest {
  merchantId: string;
  addressType: MerchantAddressType;
}

// 获取默认地址列表请求参数
export interface GetDefaultAddressesRequest {
  merchantId: string;
}

// 地址列表响应
export interface ListAddressesReply {
  addresses: MerchantAddress[];
  totalCount: number;
}

// 批量创建地址请求
export interface BatchCreateMerchantAddressesRequest {
  addresses: MerchantAddress[];
  skipDuplicates: boolean;
}

// 批量创建地址响应
export interface BatchCreateMerchantAddressesReply {
  successCount: number;
  failedItems?: MerchantAddress[];
}

/**
 * 商家地址管理API服务
 */
export const merchantAddressService = {
  /**
   * 创建地址
   * POST /v1/merchants/addresses
   */
  createMerchantAddress: (address: Omit<MerchantAddress, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>) => {
    return fetchApi<MerchantAddress>('/v1/merchants/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });
  },

  /**
   * 批量创建地址
   * POST /v1/merchants/addresses/batch
   */
  batchCreateMerchantAddresses: (request: BatchCreateMerchantAddressesRequest) => {
    return fetchApi<BatchCreateMerchantAddressesReply>('/v1/merchants/addresses/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  /**
   * 更新地址
   * PATCH /v1/merchants/addresses/{id}
   */
  updateMerchantAddress: (id: number, address: Partial<Omit<MerchantAddress, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>>) => {
    return fetchApi<MerchantAddress>(`/v1/merchants/addresses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });
  },

  /**
   * 删除地址
   * DELETE /v1/merchants/addresses/{id}
   */
  deleteMerchantAddress: (id: number) => {
    return fetchApi(`/v1/merchants/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 获取地址详情
   * GET /v1/merchants/addresses/{id}
   */
  getMerchantAddress: (id: number) => {
    return fetchApi<MerchantAddress>(`/v1/merchants/addresses/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取地址列表
   * GET /v1/merchants/addresses
   */
  listAddresses: (params: ListAddressesRequest) => {
    const searchParams = new URLSearchParams();
    if (params.merchantId) {
      searchParams.append('merchantId', params.merchantId);
    }
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());

    return fetchApi<ListAddressesReply>(`/v1/merchants/addresses?${searchParams.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * 按类型过滤地址列表
   * GET /v1/merchants/addresses/filter
   */
  listFilterAddresses: (params: ListFilterAddressesRequest) => {
    const searchParams = new URLSearchParams();
    searchParams.append('merchantId', params.merchantId);
    if (params.addressType !== undefined) {
      searchParams.append('addressType', params.addressType.toString());
    }
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());

    return fetchApi<ListAddressesReply>(`/v1/merchants/addresses/filter?${searchParams.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * 获取指定类型的默认地址
   * GET /v1/merchants/addresses/default/{addressType}
   */
  getDefaultAddress: (params: GetDefaultAddressRequest) => {
    const searchParams = new URLSearchParams();
    searchParams.append('merchantId', params.merchantId);
    
    return fetchApi<MerchantAddress>(`/v1/merchants/addresses/default/${params.addressType}?${searchParams.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * 获取所有默认地址
   * GET /v1/merchants/addresses/default/all
   */
  getDefaultAddresses: (params: GetDefaultAddressesRequest) => {
    const searchParams = new URLSearchParams();
    searchParams.append('merchantId', params.merchantId);

    return fetchApi<ListAddressesReply>('/v1/merchants/addresses/default/all', {
      method: 'GET',
    });
  },

  /**
   * 设置默认地址
   * PUT /v1/merchants/addresses/{id}/default
   */
  setDefaultMerchantAddress: (id: number) => {
    return fetchApi<MerchantAddress>(`/v1/merchants/addresses/${id}/default`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
  },
};
