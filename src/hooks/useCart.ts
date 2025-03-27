import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {addToCart, clearCart, getCartItems, removeFromCart, updateCartItemQuantity} from '@/api/cart'
import {useSnapshot} from 'valtio'
import {cartStore} from '@/store/cartStore'
import {useEffect} from 'react'
import {CartItem} from "@/types/cart";

export const useCart = () => {
    const queryClient = useQueryClient()
    // 使用valtio的useSnapshot获取购物车状态的响应式快照
    const cart = useSnapshot(cartStore)

    // 获取购物车数据的查询
    const {isLoading, error, refetch} = useQuery({
        queryKey: ['cart'],
        queryFn: getCartItems,
        // 不自动获取数据，等待手动触发
        enabled: false,
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
            cartStore.removeItem(productId).then(r => r)
            // 然后调用API更新后端
            return removeFromCart(productId, merchantId)
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
