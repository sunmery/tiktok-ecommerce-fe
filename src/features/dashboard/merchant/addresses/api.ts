/**
 * 商家地址管理API
 */

import {
  BatchCreateMerchantAddressesReply,
  BatchCreateMerchantAddressesRequest, GetDefaultAddressesRequest,
  GetDefaultAddressRequest,
  ListAddressesReply,
  ListAddressesRequest,
  ListFilterAddressesRequest,
  MerchantAddress
} from "@/features/dashboard/merchant/addresses/types.ts";
import { fetchApi } from "@/api/config.ts";

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
