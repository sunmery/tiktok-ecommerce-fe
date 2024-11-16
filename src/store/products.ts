import {proxy} from 'valtio'

interface Product {
	id: number
	name: string
	quantity: number
	price: string
}

interface Products {
	products: Product[]
}

// 商品列表 store
const productStore: Products = proxy({
	products: [
		{
			id: 1,
			quantity: 1,
			name: '',
			price: '239.00',
		},
	],
})

export const incProductQuantity = (id: number, quantity: number) => {
	const product = productStore.products.find(
		(product: Product) => product.id === id,
	)
	if (product) {
		console.log(id, quantity)
		product.quantity += quantity
	} else {
		console.error(`Product with id ${id} not found.`)
	}
}

export default productStore
