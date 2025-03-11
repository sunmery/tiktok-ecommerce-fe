import {proxy, subscribe} from 'valtio'
import type {CartItem} from '@/types/carts'
import {cartService} from '@/api/cartService'
import type {CartItem as ApiCartItem} from '@/types/cart'

// 定义购物车状态
export interface CartState {
    items: CartItem[]
    addItem: (id: string, merchantId: string, name: string, price: number, quantity: number, description?: string, images?: string[], categories?: string[]) => void
    removeItem: (id: string) => Promise<void>
    updateQuantity: (id: string, quantity: number) => Promise<void>
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
    syncWithBackend: () => Promise<void>
    mergeWithBackendCart: (backendItems: ApiCartItem[]) => void
    syncTimeout: NodeJS.Timeout | null
    lastError: string | null
}

// 恢复本地存储的数据或使用空数组
const savedCart = localStorage.getItem('cart')
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []

export const cartStore: CartState = proxy<CartState>({
    syncTimeout: null,
    lastError: null,
    items: initialItems,
    addItem(id: string, merchantId: string, name: string, price: number, quantity: number, description?: string, images?: string[], categories?: string[]) {
        const existingItem = cartStore.items.find(item => item.id === id)
        const oldQuantity = existingItem?.quantity || 0
        const newQuantity = oldQuantity + quantity

        try {
            if (existingItem) {
                existingItem.quantity = newQuantity
            } else {
                cartStore.items.push({id, merchantId, name, price, quantity, description, images, categories})
            }

            // 同步到后端
            cartService.upsertItem({
                item: {
                    productId: id,
                    merchantId: merchantId,
                    quantity: newQuantity
                }
            }).catch(error => {
                console.error('同步购物车到后端失败:', error)
                // 回滚本地状态
                if (existingItem) {
                    existingItem.quantity = oldQuantity
                } else {
                    cartStore.items = cartStore.items.filter(item => item.id !== id)
                }
                cartStore.lastError = '添加商品失败，请稍后重试'
            })
        } catch (error) {
            console.error('添加商品到购物车失败:', error)
            cartStore.lastError = '添加商品失败，请稍后重试'
        }
    },
    async removeItem(id: string) {
        const itemIndex = cartStore.items.findIndex(item => item.id === id)
        if (itemIndex === -1) return

        const removedItem = cartStore.items[itemIndex]
        cartStore.items = cartStore.items.filter(item => item.id !== id)

        try {
            await cartService.removeItem({ productId: id })
            cartStore.lastError = null
        } catch (error) {
            console.error('从购物车移除商品失败:', error)
            // 恢复商品
            cartStore.items.splice(itemIndex, 0, removedItem)
            cartStore.lastError = '移除商品失败，请稍后重试'
            throw error
        }
    },
    async updateQuantity(id: string, quantity: number) {
        const item = cartStore.items.find(item => item.id === id)
        if (!item) return
    
        const oldQuantity = item.quantity
    
        try {
            if (quantity <= 0) {
                await this.removeItem(id)
                return
            }
    
            // 先更新本地状态
            item.quantity = quantity
    
            // 清除之前的定时器
            if (cartStore.syncTimeout) {
                clearTimeout(cartStore.syncTimeout)
            }
    
            // 使用1秒防抖延迟进行后端同步
            cartStore.syncTimeout = setTimeout(async () => {
                try {
                    await cartService.upsertItem({
                        item: {
                            productId: id,
                            merchantId: item.merchantId,
                            quantity: quantity
                        }
                    })
                    cartStore.lastError = null
                } catch (error) {
                    console.error('更新购物车数量失败:', error)
                    // 回滚本地状态
                    item.quantity = oldQuantity
                    cartStore.lastError = '更新商品数量失败，请稍后重试'
                    throw error
                }
            }, 1000)
        } catch (error) {
            console.error('更新购物车数量失败:', error)
            // 回滚本地状态
            item.quantity = oldQuantity
            cartStore.lastError = '更新商品数量失败，请稍后重试'
            throw error
        }
    },
    clearCart() {
        cartStore.items = []
        localStorage.removeItem('cart')
    },
    getTotalPrice() {
        return cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    getTotalItems() {
        return cartStore.items.reduce((total, item) => total + item.quantity, 0)
    },
    mergeWithBackendCart(backendItems: ApiCartItem[]) {
        if (!backendItems?.length) return
        
        backendItems.forEach(backendItem => {
            const localItem = cartStore.items.find(item => item.id === backendItem.productId)
            
            if (localItem) {
                if (localItem.quantity !== backendItem.quantity) {
                    localItem.quantity = Math.max(localItem.quantity, backendItem.quantity)
                }
            } else {
                import('@/api/productService').then(({ productService }) => {
                    productService.getProduct({ id: backendItem.productId })
                        .then(product => {
                            cartStore.items.push({
                                id: backendItem.productId,
                                merchantId: backendItem.merchantId,
                                name: product.name,
                                price: product.price,
                                quantity: backendItem.quantity,
                                description: product.description,
                                images: product.images?.map(img => img.url),
                                categories: product.category ? [product.category.categoryName] : []
                            })
                        })
                        .catch(error => {
                            console.error('获取商品详情失败:', error)
                            cartStore.lastError = '同步购物车失败，部分商品信息无法获取'
                        })
                })
            }
        })
    },
    async syncWithBackend() {
        try {
            const response = await cartService.getCart()
            const backendItems = response.cart.items || []
            
            await cartService.emptyCart()
            
            this.mergeWithBackendCart(backendItems)
            
            const syncPromises = cartStore.items.map(item => {
                return cartService.upsertItem({
                    item: {
                        productId: item.id,
                        merchantId: item.merchantId,
                        quantity: item.quantity
                    }
                })
            })
            
            await Promise.all(syncPromises)
            cartStore.lastError = null
            console.log('购物车同步完成')
        } catch (error) {
            console.error('同步购物车失败:', error)
            cartStore.lastError = '同步购物车失败，请稍后重试'
            throw error
        }
    }
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(cartStore, () => {
    localStorage.setItem('cart', JSON.stringify(cartStore.items))
})
