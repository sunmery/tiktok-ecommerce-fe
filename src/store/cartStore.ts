import {proxy, subscribe} from 'valtio'
import type {CartItem} from '@/types/carts'
import {cartService} from '@/api/cartService'

// 定义购物车状态
export interface CartState {
    items: CartItem[]
    addItem: (
        productId: string,
        name: string,
        merchantId: string,
        picture: string,
        quantity: number,
    ) => void
    removeItem: (productId: string) => Promise<void>
    updateQuantity: (productId: string, quantity: number) => Promise<void>
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
    getSelectedTotalPrice: () => number
    toggleItemSelection: (productId: string) => void
    selectAllItems: () => void
    unselectAllItems: () => void
    isAllSelected: () => boolean
    getSelectedItemsCount: () => number
    syncWithBackend: () => Promise<void>
    mergeWithBackendCart: (backendItems: CartItem[]) => void
    syncTimeout: NodeJS.Timeout | null
    lastError: string | null
}

// 恢复本地存储的数据或使用空数组
const savedCart = localStorage.getItem('cart')
const initialItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []

export const cartStore: CartState = proxy<CartState>({
    syncTimeout: null,
    lastError: null,
    items: initialItems.map(item => ({ ...item, selected: true })), // 默认全选
    addItem(
        productId: string,
        name: string,
        merchantId: string,
        picture: string,
        quantity: number,
    ) {
        // 验证productId不为空
        if (!productId || productId.trim() === '') {
            console.error('添加商品失败: 商品ID不能为空')
            cartStore.lastError = '添加商品失败: 商品ID不能为空'
            return
        }

        const existingItem = cartStore.items.find(item => item.productId === productId)
        const oldQuantity = existingItem?.quantity || 0
        const newQuantity = oldQuantity + quantity

        try {
            if (existingItem) {
                existingItem.quantity = newQuantity
            } else {
                cartStore.items.push({
                    picture,
                    productId,
                    merchantId,
                    name,
                    quantity,
                    selected: true, // 新添加的商品默认选中
                })
            }

            // 同步到后端
            cartService.upsertItem({
                productId: productId,
                merchantId: merchantId,
                quantity: newQuantity,
            }).catch(error => {
                console.error('同步购物车到后端失败:', error)
                // 回滚本地状态
                if (existingItem) {
                    existingItem.quantity = oldQuantity
                } else {
                    cartStore.items = cartStore.items.filter(item => item.productId !== productId)
                }
                cartStore.lastError = '添加商品失败，请稍后重试'
            })
        } catch (error) {
            console.error('添加商品到购物车失败:', error)
            cartStore.lastError = '添加商品失败，请稍后重试'
        }
    },
    async removeItem(productId: string) {
        const itemIndex = cartStore.items.findIndex(item => item.productId === productId)
        if (itemIndex === -1) return

        const removedItem = cartStore.items[itemIndex]
        cartStore.items = cartStore.items.filter(item => item.productId !== productId)

        try {
            await cartService.removeCartItem({productId: productId, merchantId: removedItem.merchantId})
            cartStore.lastError = null
        } catch (error) {
            console.error('从购物车移除商品失败:', error)
            // 恢复商品
            cartStore.items.splice(itemIndex, 0, removedItem)
            cartStore.lastError = '移除商品失败，请稍后重试'
            throw error
        }
    },
    async updateQuantity(productId: string, quantity: number) {
        const item = cartStore.items.find(item => item.productId === productId)
        if (!item) return

        const oldQuantity = item.quantity

        try {
            if (quantity <= 0) {
                await this.removeItem(productId)
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
                        productId: productId,
                        merchantId: item.merchantId,
                        quantity,
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
    getTotalItems() {
        return cartStore.items.reduce((total, item) => total + item.quantity, 0)
    },
    getTotalPrice() {
        return cartStore.items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
    },
    getSelectedTotalPrice() {
        return cartStore.items.reduce((total, item) => {
            if (item.selected) {
                return total + (item.price || 0) * item.quantity
            }
            return total
        }, 0)
    },
    toggleItemSelection(productId: string) {
        const item = cartStore.items.find(item => item.productId === productId)
        if (item) {
            item.selected = !item.selected
        }
    },
    selectAllItems() {
        cartStore.items.forEach(item => {
            item.selected = true
        })
    },
    unselectAllItems() {
        cartStore.items.forEach(item => {
            item.selected = false
        })
    },
    isAllSelected() {
        return cartStore.items.length > 0 && cartStore.items.every(item => item.selected)
    },
    getSelectedItemsCount() {
        return cartStore.items.filter(item => item.selected).length
    },
    mergeWithBackendCart(backendItems: CartItem[]) {
        if (!backendItems?.length) return
        console.log('Merging backend cart items:', backendItems)
        
        // 输出后端返回的每个商品ID的详细信息，用于调试
        console.log('后端购物车商品ID详情:', backendItems.map(item => {
            return {
                productId: item.productId,
                merchantId: item.merchantId,
                productIdType: typeof item.productId,
                productIdLength: item.productId ? item.productId.length : 0,
                merchantIdLength: item.merchantId ? item.merchantId.length : 0
            }
        }))
        
        // 过滤掉无效的后端商品项
        const validBackendItems = backendItems.filter(item => {
            if (!item.productId || item.productId.trim() === '') {
                console.error('过滤后端购物车项: 商品ID不能为空');
                return false;
            }
            if (!item.merchantId || item.merchantId.trim() === '') {
                console.error('过滤后端购物车项: 商家ID不能为空');
                return false;
            }
            return true;
        });
    
        validBackendItems.forEach(backendItem => {
            // 输出当前处理的商品ID信息
            console.log('处理后端购物车商品:', {
                productId: backendItem.productId,
                merchantId: backendItem.merchantId,
                name: backendItem.name
            });
            
            const localItem = cartStore.items.find(item => item.productId === backendItem.productId)
    
            if (localItem) {
                // 更新本地商品信息
                if (localItem.quantity !== backendItem.quantity) {
                    localItem.quantity = Math.max(localItem.quantity, backendItem.quantity)
                }
                // 如果后端有价格信息但本地没有，则更新
                if (backendItem.price && !localItem.price) {
                    localItem.price = backendItem.price
                }
                // 如果后端有图片信息但本地没有，则更新
                if (backendItem.picture && !localItem.picture) {
                    localItem.picture = backendItem.picture
                }
            } else {
                // 如果后端商品包含完整信息，直接添加到本地
                if (backendItem.name && backendItem.picture) {
                    cartStore.items.push({
                        picture: backendItem.picture,
                        productId: backendItem.productId,
                        merchantId: backendItem.merchantId,
                        name: backendItem.name,
                        quantity: backendItem.quantity,
                        price: backendItem.price || 0,
                        totalPrice: backendItem.totalPrice || 0,
                        selected: true // 从后端同步的商品默认选中
                    })
                } else {
                    // 否则从产品服务获取完整信息
                    import('@/api/productService').then(({productService}) => {
                        productService.getProduct({productId: backendItem.productId, merchantId: backendItem.merchantId})
                            .then(product => {
                                // 再次验证商品ID和商家ID
                                if (!backendItem.productId || !backendItem.merchantId) {
                                    console.error('添加商品到购物车失败: ID不能为空');
                                    return;
                                }
                                
                                cartStore.items.push({
                                    picture: product.picture,
                                    productId: backendItem.productId,
                                    merchantId: backendItem.merchantId,
                                    name: product.name,
                                    quantity: backendItem.quantity,
                                    price: product.price || backendItem.price || 0,
                                    totalPrice: backendItem.totalPrice || (product.price * backendItem.quantity) || 0,
                                    selected: true // 从产品服务获取的商品默认选中
                                })
                            })
                            .catch(error => {
                                console.error('获取商品详情失败:', error)
                                cartStore.lastError = '同步购物车失败，部分商品信息无法获取'
                            })
                    })
                }
            }
        })
    },
    async syncWithBackend() {
        try {
            const response = await cartService.getCart()
            console.log('Backend cart response:', response)
            const backendItems = response?.items || []

            // 输出后端返回的商品ID，用于调试
            console.log('Backend cart items productIds:', backendItems.map(item => {
                return {
                    productId: item.productId,
                    merchantId: item.merchantId,
                    productIdLength: item.productId ? item.productId.length : 0,
                    merchantIdLength: item.merchantId ? item.merchantId.length : 0
                }
            }))

            try {
                // 尝试清空购物车，如果失败则继续处理
                await cartService.emptyCart()
            } catch (emptyCartError) {
                console.warn('清空购物车失败，将尝试直接更新商品:', emptyCartError)
                // 即使清空失败，我们仍然继续同步过程
            }

            this.mergeWithBackendCart(backendItems)

            // 过滤掉无效的商品项，确保productId和merchantId都有效
            const validItems = cartStore.items.filter(item => {
                if (!item.productId || item.productId.trim() === '') {
                    console.error('过滤购物车项: 商品ID不能为空');
                    return false;
                }
                if (!item.merchantId || item.merchantId.trim() === '') {
                    console.error('过滤购物车项: 商家ID不能为空');
                    return false;
                }
                return true;
            });
            
            // 如果过滤后没有有效商品，直接返回
            if (validItems.length === 0) {
                console.log('购物车中没有有效商品项，跳过同步');
                return;
            }
            
            // 输出要同步到后端的商品项详情，用于调试
            console.log('准备同步到后端的购物车项:', validItems.map(item => {
                return {
                    productId: item.productId,
                    merchantId: item.merchantId,
                    quantity: item.quantity,
                    productIdLength: item.productId ? item.productId.length : 0,
                    merchantIdLength: item.merchantId ? item.merchantId.length : 0
                }
            }))
            
            // 同步有效的本地购物车项到后端
            const syncPromises = validItems.map(item => {
                const requestData = {
                    productId: item.productId,
                    merchantId: item.merchantId,
                    quantity: item.quantity,
                };
                console.log('发送购物车同步请求:', requestData);
                return cartService.upsertItem(requestData);
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
