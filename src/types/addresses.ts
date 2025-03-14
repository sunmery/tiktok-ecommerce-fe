// 地址接口定义
export interface Address {
  id: number
  user_id: string
  street_address: string
  city: string
  state: string
  country: string
  zip_code: string
}

// 地址列表接口
export interface Addresses {
  addresses: Address[]
}

// 创建/更新地址请求接口
export interface AddressRequest {
  address: Address
}

// 删除地址请求接口
export interface DeleteAddressRequest {
  addresses_id: number
  user_id: string
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
