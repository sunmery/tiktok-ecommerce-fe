import {useMutation, useQueryClient} from '@tanstack/react-query'
import {checkoutService} from '@/api/checkoutService'
import {CheckoutReq, CheckoutResp} from '@/types/checkout'

/**
 * 结账的hook
 */
export function useCheckout() {
    const queryClient = useQueryClient()

    return useMutation<CheckoutResp, Error, CheckoutReq>({
        mutationFn: (request) => checkoutService.checkout(request),
        onSuccess: (data) => {
            // 结账成功后可能需要刷新订单列表
            queryClient.invalidateQueries({queryKey: ['orders']})
            // 也可能需要清空购物车
            queryClient.invalidateQueries({queryKey: ['cart']})
            // 将结账结果添加到缓存
            queryClient.setQueryData(['checkout', data.orderId], data)
        },
    })
}
