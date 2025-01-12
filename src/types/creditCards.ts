export interface CreditCards {
	credit_cards: CreditCard[]
}

export interface CreditCard {
	id: number
	credit_card_number: string
	credit_card_cvv: string
	credit_card_expiration_year: string
	credit_card_expiration_month: string
	owner: string
	name: string
}
