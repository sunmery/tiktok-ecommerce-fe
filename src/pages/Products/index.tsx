import {useState} from 'react'
import AspectRatio from '@mui/joy/AspectRatio'
import Button from '@mui/joy/Button'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined'
import {useSnapshot} from 'valtio/react'

interface Product {
	id: number
	name: string
	picture: string
	price: string
	quantity: number
}

import {addToCart} from '@/store/carts.ts'
import {incProductQuantity} from '@/store/products.ts'

/**
 *@returns JSXElement
 */
export default function Products() {
	const [product, setProducts] = useState<Product[]>([
		{
			id: 1,
			name: 'Product 1',
			quantity: 1,
			picture:
				'https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286',
			price: '239.00',
		},
		{
			id: 2,
			name: 'Product 2',
			quantity: 1,
			picture:
				'https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286',
			price: '123.00',
		},
	])

	// 修改商品数量
	const updateQuantity = (productId: number, change: number) => {
		incProductQuantity(productId, change)
	}

	const addToCartHandler = (id: number, quantity: number, price: string) => {
		addToCart(id, quantity, price)
	}

	return product.map((product: Product) => (
		<Card
			sx={{width: 320}}
			key={product.name}
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
					srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
					loading="lazy"
					alt=""
				/>
			</AspectRatio>
			<CardContent orientation="horizontal">
				<div>
					<Typography level="body-xs">Price:</Typography>
					<Typography sx={{fontSize: 'lg', fontWeight: 'lg'}}>
						{product.price}
					</Typography>
				</div>
				<Button onClick={() => updateQuantity(product.id, -1)}>-</Button>
				<Typography>{product.quantity}</Typography>
				<Button onClick={() => updateQuantity(product.id, +1)}>+</Button>
				<Button
					variant="solid"
					size="md"
					color="primary"
					aria-label="Explore Bahamas Islands"
					sx={{ml: 'auto', alignSelf: 'center', fontWeight: 600}}
					onClick={() =>
						addToCartHandler(product.id, product.quantity, product.price)
					}
				>
					Add Cart
				</Button>
			</CardContent>
		</Card>
	))
}
