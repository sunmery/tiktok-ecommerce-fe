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

// 信用卡信息接口
export interface CreateCreditCard {
    currency: string
    number: string
    cvv: string
    expYear: string
    expMonth: string
    owner: string // 持卡人姓名
    name: string // 卡名
    type: string // 卡类型（如借记卡、信用卡）
    brand: string // 卡品牌（如 Visa、MasterCard）
    country: string
    createdTime?: string
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
    id: number
}

// 获取信用卡响应接口
export interface GetCreditCardReply {
    creditCards: CreditCard[]
}

// 搜索信用卡响应
export interface SearchCreditCardsReply {
    creditCards: CreditCard[]
}
