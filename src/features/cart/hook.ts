import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {addToCart, clearCart, getCartItems, removeFromCart, updateCartItemQuantity} from './types.ts'
import {useSnapshot} from 'valtio'
import {useEffect} from 'react'
import {CartItem} from "@/types/cart";
import { cartStore } from "@/store/cartStore.ts";

export const useCart = () => {
    const queryClient = useQueryClient()
    // 使用valtio的useSnapshot获取购物车状态的响应式快照
    const cart = useSnapshot(cartStore)

    // 获取购物车数据的查询
    const {isLoading, error, refetch} = useQuery({
        queryKey: ['cart'],
        queryFn: getCartItems,
        enabled: true,
    })

    // 当组件挂载时，先显示本地购物车，然后同步后端数据
    useEffect(() => {
        // 同步本地购物车与后端购物车
        const syncCart = async () => {
            try {
                await cartStore.syncWithBackend()
                // 刷新React Query缓存
                await refetch()
            } catch (error) {
                console.error('同步购物车失败:', error)
            }
        }

        syncCart().then(r => r)
    }, [])

    // 添加商品到购物车
    const addItemMutation = useMutation({
        mutationFn: (item: CartItem) => {
            // 先更新本地购物车
            cartStore.addItem(
                item.productId,
                item.name,
                item.merchantId,
                item.picture,
                item.quantity
            )
            // 然后调用API更新后端
            return addToCart(item)
        },
        onSuccess: () => {
            // 成功后刷新购物车数据
            return queryClient.invalidateQueries({queryKey: ['cart']})
        },
    })

    // 从购物车移除商品
    const removeItemMutation = useMutation({
        mutationFn: ({productId, merchantId}: { productId: string, merchantId: string }) => {
            // 先更新本地购物车
            return cartStore.removeItem(productId)
                .catch(error => {
                    // 检查错误信息是否包含"no rows in result set"
                    const errorMessage = error instanceof Error ? error.message : String(error)
                    if (errorMessage.includes('no rows in result set')) {
                        console.log('商品在后端不存在，但已从本地购物车移除')
                        // 不抛出异常，让UI认为操作成功
                        return
                    }
                    // 其他错误则继续抛出
                    throw error
                })
                .then(() => {
                    // 尝试调用API更新后端，但不等待结果
                    try {
                        removeFromCart(productId, merchantId).catch(e => {
                            console.log('后端删除失败，但本地已删除:', e)
                        })
                    } catch (e) {
                        console.log('调用removeFromCart异常，但本地已删除:', e)
                    }
                })
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['cart']})
        },
    })

    // 更新商品数量
    const updateQuantityMutation = useMutation({
        mutationFn: ({itemId, quantity}: { itemId: string; quantity: number }) => {
            // 先更新本地购物车
            cartStore.updateQuantity(String(itemId), quantity).then(r => r)
            // 然后调用API更新后端
            return updateCartItemQuantity(itemId, quantity)
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['cart']})
        },
    })

    // 清空购物车
    const clearCartMutation = useMutation({
        mutationFn: () => {
            // 先清空本地购物车
            cartStore.clearCart()
            // 然后调用API清空后端购物车
            return clearCart()
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({queryKey: ['cart']})
        },
    })

    return {
        // 优先返回本地购物车数据
        cartItems: cart.items,
        isLoading,
        error,
        getTotalPrice: () => cart.getTotalPrice(),
        getSelectedTotalPrice: () => cart.getSelectedTotalPrice(),
        addItem: addItemMutation.mutate,
        removeItem: removeItemMutation.mutate,
        updateQuantity: updateQuantityMutation.mutate,
        clearCart: clearCartMutation.mutate,
        isAddingItem: addItemMutation.isPending,
        isRemovingItem: removeItemMutation.isPending,
        isUpdatingQuantity: updateQuantityMutation.isPending,
        isClearingCart: clearCartMutation.isPending,
        // 添加同步方法，允许手动触发同步
        syncWithBackend: cartStore.syncWithBackend,
        totalItems: cart.getTotalItems(),
        // 添加商品选择相关方法
        toggleItemSelection: cartStore.toggleItemSelection,
        selectAllItems: cartStore.selectAllItems,
        unselectAllItems: cartStore.unselectAllItems,
        isAllSelected: () => cart.isAllSelected(),
        getSelectedItemsCount: () => cart.getSelectedItemsCount()
    }
}
