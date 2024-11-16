import {proxy} from 'valtio'

interface Cart {
	id: number
	quantity: number
	price: string
}

interface Carts {
	carts: Cart[]
}

// 商品列表 store
const cartsStore: Carts = proxy({
	carts: [],
})

export const addToCart = (id: number, quantity: number, price: string) => {
	const existingCart = cartsStore.carts.find((cart) => cart.id === id)
	if (existingCart) {
		// 存在则添加数量
		existingCart.quantity += quantity
	} else {
		// 如果商品不在购物车中，新增一项
		cartsStore.carts.push({
			id: id,
			quantity: 1, // 初始数量为1
			price: price,
		})
	}
}

export default cartsStore
