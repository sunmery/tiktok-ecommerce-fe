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
}

// 信用卡列表响应接口
export interface ListCreditCardsReply {
  creditCards: CreditCard[]
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
  number: string
}

// 获取信用卡响应接口
export interface GetCreditCardReply {
  creditCards: CreditCard
}
