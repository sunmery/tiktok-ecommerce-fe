/**
 * 地址相关类型定义
 */

// 地址接口定义
export interface Address {
  id: number
  userId: string
  streetAddress: string
  city: string
  state: string
  country: string
  zipCode: string
}

// 地址列表接口
export interface Addresses {
  addresses: Address[]
}

// 创建/更新地址请求接口
export interface AddressRequest {
  address: Address
}

// 更新地址请求接口
export interface UpdateAddressRequest {
  addresses: Address
}

// 删除地址请求接口
export interface DeleteAddressRequest {
  addressesId: number
  userId: string
}

// 地址响应接口
export interface AddressReply {
  id: number
  address: Address
}

// 删除地址响应接口
export interface DeleteAddressReply {
  message: string
  id: number
  code: number
}
