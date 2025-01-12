// 定义购物车项的类型
export interface CartItem {
	id: number
	name: string
	description?: string
	picture?: string
	price: number
	quantity: number
	categories?: string[]
}
