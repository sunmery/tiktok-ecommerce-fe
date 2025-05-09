
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
