import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {addressesStore} from '@/store/addressesStore.ts'
import {userStore} from '@/store/user.ts'
import type {CartItem} from '@/types/carts.ts'

export const Route = createLazyFileRoute('/orders/')({
	component: RouteComponent,
})

/**
 *@returns Element
 */
function RouteComponent() {
	const [orders, setOrders] = useState<CartItem[]>([])
	const {default_address} = useSnapshot(addressesStore)
	const {account} = useSnapshot(userStore)

	useEffect(() => {
		fetch(`${import.meta.env.VITE_ORDERS_URL}`, {
			method: 'POST',
			headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
			body: JSON.stringify({
				owner: account.owner,
				name: account.name,
				user_currency: account.user_currency,
				address: default_address,
				email: account.email,
				order_items: orders,
			}),
		})
			.then((data) => data.json())
			.then((data) => setOrders(data))
			.catch((e) => console.error(e))
	}, [])

	return (
		<div>
			{orders?.length > 0 ? (
				orders.map((order) => (
					<ol key={order.id}>
						<li>
							<span>
								{default_address.id},{default_address.street_address},
								{default_address.city},{default_address.state},
								{default_address.country},{default_address.zip_code}
							</span>
						</li>
						<li>id:{order.id}</li>
						<li>name:{order.name}</li>
						<li>description:{order.description}</li>
						<li>picture:{order.picture}</li>
						<li>price:{order.price}</li>
						<li>quantity:{order.quantity}</li>
						<li>categories:{order.categories}</li>
					</ol>
				))
			) : (
				<div>暂无数据</div>
			)}
		</div>
	)
}
