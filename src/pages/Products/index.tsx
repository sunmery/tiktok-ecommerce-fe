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
	price: string
	quantity: number
	categories: string[]
}

// import {addToCart} from '@/store/carts.ts'
// import {incProductQuantity} from '@/store/products.ts'
import {useQuery} from '@tanstack/react-query'
import {useSnapshot} from 'valtio/react'
import {cartStore} from '@/store/cartStore.ts'
import {Box} from '@mui/joy'

/**
 *@returns JSXElement
 */
export default function Products() {
	const page = 1
	const page_size = 20
	// const [product, setProducts] = useState<Product[]>([])

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

	const addToCartHandler = (id: number, quantity: number, price: string) => {
		console.log(id, price, quantity)
		cartStore.addItem(id, price, quantity)
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
				{data.products.map((product: Product) => (
					<Card
						key={product.name}
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
									addToCartHandler(product.id, product.quantity, product.price)
								}
							>
								Add Cart
							</Button>
						</CardContent>
					</Card>
				))}
				<p> Cart Total: {snapshot.items.length} items</p>
			</Box>
		)
	}
}
