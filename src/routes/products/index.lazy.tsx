import {createLazyFileRoute} from '@tanstack/react-router'

import AspectRatio from '@mui/joy/AspectRatio'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined'

interface Product {
	id: number
	name: string
	description: string
	picture: string
	price: number
	quantity: number
	categories: string[]
}

import {useQuery} from '@tanstack/react-query'
import {useSnapshot} from 'valtio/react'
import {cartStore} from '@/store/cartStore.ts'
import {Box} from '@mui/joy'
import ListItem from '@mui/joy/ListItem'
import List from '@mui/joy/List'

/**
 *@returns JSXElement
 */
export default function Products() {
	const page = 1
	const page_size = 20

	const getProducts = async () => {
		const res = await fetch(
			`${import.meta.env.VITE_PRODUCERS_URL}?page=${page}&page_size=${page_size}`,
			{
				method: 'GET',
			},
		)
		return res.json()
	}
	const {data, error} = useQuery({
		queryKey: ['getProducts'],
		queryFn: getProducts,
	})

	const snapshot = useSnapshot(cartStore)

	// 修改商品数量
	// const updateQuantity = (productId: number, change: number) => {
	// 	incProductQuantity(productId, change)
	// }

	const addToCartHandler = (
		id: number,
		name: string,
		quantity: number,
		price: number,
	) => {
		cartStore.addItem(id, name, price, quantity)
	}

	if (error) {
		return 'error'
	}

	if (data) {
		return (
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
				}}
			>
				{data.products.map((product: Product, index: number) => (
					<Card
						key={product.name + index}
						sx={{
							width: 320,
						}}
					>
						<div>
							<Typography level="title-lg">{product.name}</Typography>
							<IconButton
								aria-label="bookmark Bahamas Islands"
								variant="plain"
								color="neutral"
								size="sm"
								sx={{position: 'absolute', top: '0.875rem', right: '0.5rem'}}
							>
								<BookmarkAdd />
							</IconButton>
						</div>
						<AspectRatio
							minHeight="120px"
							maxHeight="200px"
						>
							<img
								src={product.picture}
								srcSet=""
								loading="lazy"
								alt=""
							/>
						</AspectRatio>
						<Typography>{product.description}</Typography>
						<List>
							{product.categories?.map((item: string) => (
								<ListItem key={item}>
									<Typography
										sx={{
											fontSize: 12,
										}}
										variant="outlined"
									>
										{item}
									</Typography>
								</ListItem>
							))}
						</List>
						<CardContent orientation="horizontal">
							<div>
								<Typography level="body-xs">Price:</Typography>
								<Typography sx={{fontSize: 'lg', fontWeight: 'lg'}}>
									{product.price}
								</Typography>
							</div>
							{/* <Button onClick={() => updateQuantity(product.id, -1)}>-</Button> */}
							<Typography>{product.quantity}</Typography>

							{/* <Button onClick={() => updateQuantity(product.id, +1)}>+</Button> */}
							<Button
								variant="solid"
								size="md"
								color="primary"
								aria-label="Explore Bahamas Islands"
								sx={{ml: 'auto', alignSelf: 'center', fontWeight: 600}}
								onClick={() =>
									addToCartHandler(
										product.id,
										product.name,
										product.price,
										product.quantity,
									)
								}
							>
								Add Cart
							</Button>
						</CardContent>
					</Card>
				))}
				<Typography level="body-lg">
					Cart Total: {snapshot.items.length} items
				</Typography>
			</Box>
		)
	}
}

export const Route = createLazyFileRoute('/products/')({
	component: () => <Products />,
})
