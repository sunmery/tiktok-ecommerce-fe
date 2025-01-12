import {proxy, subscribe} from 'valtio'
import type {CreditCard} from '@/types/creditCards.ts'

// 定义购物车状态
export interface CreditCardsState {
	credit_cards: CreditCard[]
	default_credit_cards: CreditCard
}

// 默认数据
const initialState: CreditCard = {
	id: 0,
	credit_card_number: '1234-567-890',
	credit_card_cvv: '0123',
	credit_card_expiration_year: '2025',
	credit_card_expiration_month: '12',
	owner: 'tiktok',
	name: 'test1',
}

// 恢复本地存储的数据
const savedCreditCards = localStorage.getItem('creditCards')
const initialItems: CreditCard[] = savedCreditCards
	? JSON.parse(savedCreditCards)
	: []

export const creditCardsStore = proxy<CreditCardsState>({
	credit_cards: initialItems,
	default_credit_cards: initialState,
})

export const setCreditCardArray = (creditCardData: CreditCard[]) => {
	// 使用一个 Map 或 Set 进行去重
	const existingIds = new Set(
		creditCardsStore.credit_cards.map((card) => card.id),
	)

	// 过滤掉重复的数据
	const uniqueCreditCards = creditCardData.filter(
		(card) => !existingIds.has(card.id),
	)

	// 如果有新数据，才更新状态
	if (uniqueCreditCards.length > 0) {
		creditCardsStore.credit_cards = [
			...creditCardsStore.credit_cards,
			...uniqueCreditCards,
		]
		console.log(
			'Updated creditCardsStore.credit_cards:',
			creditCardsStore.credit_cards,
		)
	}
}

export const setDefaultCreditCard = (creditCardData: CreditCard) => {
	creditCardsStore.default_credit_cards = creditCardData
	console.log(creditCardsStore.default_credit_cards)
}

// 订阅状态变化，将数据存储到 localStorage
subscribe(creditCardsStore, () => {
	localStorage.setItem(
		'creditCards',
		JSON.stringify(creditCardsStore.credit_cards),
	)
})
