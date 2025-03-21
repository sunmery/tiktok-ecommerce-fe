/**
 * 信用卡相关类型定义
 */

// 信用卡信息接口
export interface CreditCard {
  id: number
  number: string
  cvv: string
  expYear: string
  expMonth: string
  owner: string
  name: string
  type: string
  brand: string
  country: string
  createdTime: string
  currency: string
}

// 信用卡列表响应接口
export interface ListCreditCardsReply {
  credit_cards: CreditCard[]
}

// 创建/更新信用卡响应接口
export interface CardsReply {
  message: string
  code: number
}

// 删除信用卡请求接口
export interface DeleteCreditCardRequest {
  id: number
}

// 获取信用卡请求接口
export interface GetCreditCardRequest {
  userId: string
  id: number
}

// 获取信用卡响应接口
export interface GetCreditCardReply {
  credit_cards: CreditCard
}

// 搜索信用卡响应
export interface SearchCreditCardsReply {
  credit_cards: CreditCard[]
}
