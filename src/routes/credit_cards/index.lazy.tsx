import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {
	creditCardsStore,
	setCreditCardArray,
	setDefaultCreditCard,
} from '@/store/creditCards.ts'
import type {CreditCards} from '@/types/creditCards.ts'

export const Route = createLazyFileRoute('/credit_cards/')({
	component: RouteComponent,
})

/**
 *@returns Element
 */
function RouteComponent() {
	const credits = useSnapshot(creditCardsStore)
	const account = useSnapshot(userStore.account)
	useEffect(() => {
		fetch(
			`${import.meta.env.VITE_CREDIT_CARDS_URL}/list?owner=${account.owner}&name=${account.name}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				mode: 'cors',
			},
		)
			.then((res) => res.json())
			.then((data: CreditCards) => {
				if (data && Array.isArray(data.credit_cards)) {
					setCreditCardArray(data.credit_cards)
				} else {
					throw new Error('Invalid credit_cards data')
				}
			})
			.catch((err) => console.error(err))
	}, [])

	return (
		<div>
			{Array.isArray(credits.credit_cards) &&
			credits.credit_cards.length > 0 ? (
				credits.credit_cards.map((credit) => (
					<ul key={credit.id}>
						<li>id: {credit.id}</li>
						<li>owner: {credit.owner}</li>
						<li>name: {credit.name}</li>
						<li>credit_card_number: {credit.credit_card_number}</li>
						<li>credit_card_cvv: {credit.credit_card_cvv}</li>
						<li>
							credit_card_expiration_year: {credit.credit_card_expiration_year}
						</li>
						<li>
							credit_card_expiration_month:{' '}
							{credit.credit_card_expiration_month}
						</li>
						<li>
							<button
								onClick={(e) => {
									e.preventDefault()
									setDefaultCreditCard(credit)
								}}
							>
								Set Default Credit Cards
							</button>
						</li>
					</ul>
				))
			) : (
				<p>暂未获取到任何信用卡数据</p>
			)}
		</div>
	)
}
