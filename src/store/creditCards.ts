import {proxy, subscribe} from 'valtio'
import type {CreditCard} from '@/types/creditCards'

// 定义购物车状态
export interface CreditCardsState {
    creditCards: CreditCard[]
    defaultCreditCards: CreditCard
}

// 默认数据
const initialState: CreditCard = {
    brand: "",
    country: "",
    createdTime: "",
    currency: "",
    id: 0,
    name: "",
    owner: "",
    type: "",
    number: '1234-5678-1234-5678',
    cvv: "1234",
    expYear: "2050",
    expMonth: "12"
}

// 恢复本地存储的数据
const savedCreditCards = localStorage.getItem('creditCards')
const initialItems: CreditCard[] = savedCreditCards
    ? JSON.parse(savedCreditCards)
    : []

export const creditCardsStore = proxy<CreditCardsState>({
    creditCards: initialItems,
    defaultCreditCards: initialState,
})

export const setCreditCardArray = (creditCardData: CreditCard[]) => {
    // 使用一个 Map 或 Set 进行去重
    const existingIds = new Set(
        creditCardsStore.creditCards.map((card) => card.id),
    )

    // 过滤掉重复的数据
    const uniqueCreditCards = creditCardData.filter(
        (card) => !existingIds.has(card.id),
    )

    // 如果有新数据，才更新状态
    if (uniqueCreditCards.length > 0) {
        creditCardsStore.creditCards = [
            ...creditCardsStore.creditCards,
            ...uniqueCreditCards,
        ]
        console.log(
            'Updated creditCardsStore.creditCards:',
            creditCardsStore.creditCards,
        )
    }
}

export const setDefaultCreditCard = (creditCardData: CreditCard) => {
    creditCardsStore.defaultCreditCards = creditCardData
    console.log(creditCardsStore.defaultCreditCards)
}

// 订阅状态变化，将数据存储到 localStorage
subscribe(creditCardsStore, () => {
    localStorage.setItem(
        'creditCards',
        JSON.stringify(creditCardsStore.creditCards),
    )
})
