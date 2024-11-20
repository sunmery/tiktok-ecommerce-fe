import {createLazyFileRoute} from '@tanstack/react-router'
// import Carts from '@/pages/Carts'
export const Route = createLazyFileRoute('/carts/')({
	component: () => <Cart />,
})
import {cartStore} from '@/store/cartStore'
import {useSnapshot} from 'valtio/react'

import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'

import Button from '@mui/joy/Button'
import {Sheet, Table} from '@mui/joy'

/**
 *@returns JSXElement
 */
export default function Cart() {
	const {items} = useSnapshot(cartStore)

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
				<Box>
					<List>
						{items.map((item) => (
							<ListItem key={item.id}>
								<Sheet>
									<Table>
										<thead>
											<tr>
												<th>Name</th>
												<th>Description</th>
												<th>Picture</th>
												<th>Price</th>
												<th>Quantity</th>
												<th>Categories</th>
												<th>Option</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{item.name}</td>
												<td>{item.description}</td>
												<td>{item.picture}</td>
												<td>{item.price}</td>
												<td>{item.quantity}</td>
												<td>{item.categories}</td>
												<td>
													<Button
														variant="outlined"
														onClick={() => removeItem(item.id)}
													>
														Remove
													</Button>
												</td>
											</tr>
										</tbody>
									</Table>
								</Sheet>
							</ListItem>
						))}
					</List>
					<Button onClick={clearCart}>结算</Button>
					<Button onClick={clearCart}>Clear Cart</Button>
				</Box>
			) : (
				<p>Your cart is empty.</p>
			)}
		</div>
	)
}
