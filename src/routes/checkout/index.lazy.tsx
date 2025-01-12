import {createLazyFileRoute} from '@tanstack/react-router'

import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {addressesStore} from '@/store/addressesStore.ts'
import {creditCardsStore} from '@/store/creditCards.ts'

export const Route = createLazyFileRoute('/checkout/')({
	component: RouteComponent,
})

/**
 * 银行卡号组件
 *@returns Element
 */
function RouteComponent() {
	const account = useSnapshot(userStore.account)
	const addresses = useSnapshot(addressesStore.default_address)
	const creditCards = useSnapshot(creditCardsStore.default_credit_cards)
	const createCheckout = () => {
		fetch(`${import.meta.env.VITE_CHECKOUT_URL}`, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				owner: account.owner,
				name: account.name,
				email: account.email,
				address_id: addresses.id,
				credit_card_id: creditCards.id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
			})
			.catch((e) => console.error(e))
	}
	return (
		<div>
			<button onClick={createCheckout}>Submit</button>
		</div>
	)
}
