/**
 * 商家地址管理API
 */

import { BASE_URL, fetchApi } from '../config';

// 地址类型枚举
export enum AddressType {
  WAREHOUSE = 0,    // 仓库地址
  RETURN = 1,       // 退货地址
  STORE = 2,        // 门店地址
  BILLING = 3,      // 财务地址
  HEADQUARTERS = 4, // 总部地址
}

// 地址数据接口
export interface Address {
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

// 地址列表请求参数
export interface ListAddressesRequest {
  addressType?: AddressType;
  onlyDefault?: boolean;
  page: number;
  pageSize: number;
}

// 地址列表响应
export interface ListAddressesResponse {
  addresses: Address[];
  totalCount: number;
}

// 批量创建地址请求
export interface BatchCreateAddressesRequest {
  addresses: Address[];
  skipDuplicates?: boolean;
}

// 批量创建地址响应
export interface BatchCreateAddressesResponse {
  successCount: number;
  failedItems?: Address[];
}

/**
 * 商家地址管理API服务
 */
export const addressService = {
  /**
   * 创建地址
   * POST /v1/merchants/addresses
   */
  createAddress: (address: Omit<Address, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>) => {
    return fetchApi<Address>(`/v1/merchants/addresses`, {
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
  batchCreateAddresses: (request: BatchCreateAddressesRequest) => {
    return fetchApi<BatchCreateAddressesResponse>(`/v1/merchants/addresses/batch`, {
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
  updateAddress: (id: number, address: Partial<Omit<Address, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>>) => {
    return fetchApi<Address>(`/v1/merchants/addresses/${id}`, {
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
  deleteAddress: (id: number) => {
    return fetchApi(`/v1/merchants/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 获取地址详情
   * GET /v1/merchants/addresses/{id}
   */
  getAddress: (id: number) => {
    return fetchApi<Address>(`/v1/merchants/addresses/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取地址列表
   * GET /v1/merchants/addresses
   */
  listAddresses: (params: ListAddressesRequest) => {
    console.log('BASE_URL',BASE_URL)
    const searchParams = new URLSearchParams();
    if (params.addressType !== undefined) {
      searchParams.append('addressType', params.addressType.toString());
    }
    if (params.onlyDefault !== undefined) {
      searchParams.append('onlyDefault', params.onlyDefault.toString());
    }
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());

    return fetchApi<ListAddressesResponse>(`/v1/merchants/addresses?${searchParams.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * 设置默认地址
   * PUT /v1/merchants/addresses/{id}/default
   */
  setDefaultAddress: (id: number) => {
    return fetchApi<Address>(`/v1/merchants/addresses/${id}/default`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
  },
};
