import {cartStore} from '@/store/cartStore'
import {useSnapshot} from 'valtio/react'
import {useMemo} from 'react'

/**
 *@returns JSXElement
 */
export default function Cart() {
	const {items} = useSnapshot(cartStore)

	useMemo(() => {
		console.log(items)
	}, [items])

	const removeItem = (id: number) => {
		cartStore.removeItem(id)
	}

	const clearCart = () => {
		cartStore.clearCart()
	}

	return (
		<div>
			<h2>Shopping Cart</h2>
			{items.length > 0 ? (
				<div>
					<ul>
						{items.map((item) => (
							<li key={item.id}>
								<p>
									Product ID: {item.id}, Price: ${item.price}, Quantity:{' '}
									{item.quantity}
								</p>
								<button onClick={() => removeItem(item.id)}>Remove</button>
							</li>
						))}
					</ul>
					<button onClick={clearCart}>Clear Cart</button>
				</div>
			) : (
				<p>Your cart is empty.</p>
			)}
		</div>
	)
}
