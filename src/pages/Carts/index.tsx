import {Box} from '@mui/joy'

import {useSnapshot} from 'valtio/react'
import cartsStore from '@/store/carts.ts'

/**
 *@returns JSXElement
 */
export default function Carts() {
	const {carts} = useSnapshot(cartsStore)
	return (
		<Box>
			{carts.length > 0 && (
				<>
					<h3>Shopping Cart</h3>
					<ul>
						{carts.map((item, index) => (
							<li key={index}>
								Product ID: {item.id} - Quantity: {item.quantity} - Price:{' '}
								{item.price}
							</li>
						))}
					</ul>
				</>
			)}
		</Box>
	)
}
