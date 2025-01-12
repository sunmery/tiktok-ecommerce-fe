import {createLazyFileRoute} from '@tanstack/react-router'

// import Carts from '@/pages/Carts'
export const Route = createLazyFileRoute('/carts/')({
	component: () => <Cart />,
})
import {useSnapshot} from 'valtio/react'
import {cartStore} from '@/store/cartStore'
import {addressesStore} from '@/store/addressesStore'
import {FavoriteBorder} from '@mui/icons-material'

import type {ModalDialogProps} from '@mui/joy'
import {
	Box,
	List,
	ListItem,
	Chip,
	Select,
	Sheet,
	Table,
	Modal,
	Button,
	ModalClose,
	ModalDialog,
	DialogTitle,
	DialogContent,
	Option,
} from '@mui/joy'
import {useState} from 'react'

/**
 *@returns JSXElement
 */
export default function Cart() {
	const {items} = useSnapshot(cartStore)
	const {addresses} = useSnapshot(addressesStore)

	const removeItem = (id: number) => {
		cartStore.removeItem(id)
	}

	const clearCart = () => {
		cartStore.clearCart()
	}

	const [variant, setVariant] = useState<
		ModalDialogProps['variant'] | undefined
	>(undefined)

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

					<Button
						variant="soft"
						color="neutral"
						onClick={() => {
							setVariant('soft')
						}}
					>
						结算
					</Button>
					<Modal
						open={!!variant}
						onClose={() => setVariant(undefined)}
					>
						<ModalDialog variant={variant}>
							<ModalClose />
							<DialogTitle>订单结算</DialogTitle>
							<DialogContent>订单价格: </DialogContent>
							<DialogContent>
								收货地址:
								<Select
									placeholder="选择收货地址"
									startDecorator={<FavoriteBorder />}
									endDecorator={
										<Chip
											size="sm"
											color="danger"
											variant="soft"
										>
											{addresses.length}
										</Chip>
									}
									sx={{width: 240}}
								>
									{addresses.length > 0 ? (
										addresses.map((item) => (
											<Option
												key={item.id}
												value={item.street_address}
											>
												{item.street_address}
											</Option>
										))
									) : (
										<>null</>
									)}
								</Select>
							</DialogContent>
							<DialogContent>
								支付方式:
								<Select
									placeholder="支付方式"
									startDecorator={<FavoriteBorder />}
									endDecorator={
										<Chip
											size="sm"
											color="danger"
											variant="soft"
										>
											{addresses.length}
										</Chip>
									}
									sx={{width: 240}}
								>
									<Option value="微信">微信</Option>
									<Option value="支付宝">支付宝</Option>
									<Option value="余额">余额</Option>
								</Select>
							</DialogContent>
							<DialogContent>
								<Button>支付</Button>
							</DialogContent>
						</ModalDialog>
					</Modal>
					{/* <Link to="/payment">结算</Link> */}
					<Button onClick={clearCart}>Clear Cart</Button>
				</Box>
			) : (
				<p>Your cart is empty.</p>
			)}
		</div>
	)
}
