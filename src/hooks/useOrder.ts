import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/api/orderService'
import {
  ListOrderReq,
  ListOrderResp,
  MarkOrderPaidReq,
  MarkOrderPaidResp,
  PlaceOrderReq,
  PlaceOrderResp,
  PaymentStatus
} from '@/types/orders'

/**
 * 获取订单列表的hook
 * @param request 查询参数
 */
export function useOrderList(request: ListOrderReq) {
  return useQuery<ListOrderResp>({
    queryKey: ['orders', request.page, request.pageSize],
    queryFn: () => orderService.listOrder(request),
  })
}

/**
 * 创建订单的hook
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient()

  return useMutation<PlaceOrderResp, Error, PlaceOrderReq>({
    mutationFn: (request) => orderService.placeOrder(request),
    onSuccess: () => {
      // 创建订单成功后刷新订单列表
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

/**
 * 标记订单为已支付的hook
 */
export function useMarkOrderPaid() {
  const queryClient = useQueryClient()

  return useMutation<MarkOrderPaidResp, Error, MarkOrderPaidReq>({
    mutationFn: (request) => orderService.markOrderPaid(request),
    onSuccess: (_, variables) => {
      // 标记订单为已支付成功后刷新订单列表和订单详情
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
    },
  })
}

/**
 * 更新订单状态的hook
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { orderId: string; status: PaymentStatus }>({
    mutationFn: ({ orderId, status }) => {
      // 临时实现，因为 orderService 中没有 updateOrderStatus 方法
      console.warn('updateOrderStatus 方法未实现');
      return Promise.resolve();
    },
    onSuccess: (_, variables) => {
      // 更新订单状态成功后刷新订单列表和订单详情
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
    },
  })
}
