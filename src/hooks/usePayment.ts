import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentService } from '@/api/paymentService'
import {
  CreatePaymentReq,
  PaymentCallbackReq,
  PaymentCallbackResp,
  PaymentNotifyReq,
  PaymentNotifyResp,
  PaymentResp
} from '@/types/payment'

/**
 * 获取支付信息的hook
 * @param paymentId 支付ID
 */
export function usePayment(paymentId: string) {
  return useQuery<PaymentResp>({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentService.getPayment({ paymentId: paymentId }),
    enabled: !!paymentId, // 只有当paymentId存在时才发起请求
  })
}

/**
 * 创建支付的hook
 */
export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation<PaymentResp, Error, CreatePaymentReq>({
    mutationFn: (request) => paymentService.createPayment(request),
    onSuccess: (data) => {
      // 创建支付成功后将数据添加到缓存
      queryClient.setQueryData(['payment', data.paymentId], data)
    },
  })
}

/**
 * 处理支付回调的hook
 */
export function useProcessPaymentCallback() {
  const queryClient = useQueryClient()

  return useMutation<PaymentCallbackResp, Error, PaymentCallbackReq>({
    mutationFn: (request) => paymentService.processPaymentCallback(request),
    onSuccess: (_, variables) => {
      // 处理回调成功后刷新支付信息
      queryClient.invalidateQueries({ queryKey: ['payment', variables.paymentId] })
    },
  })
}

/**
 * 处理支付异步通知的hook
 */
export function usePaymentNotify() {
  const queryClient = useQueryClient()

  return useMutation<PaymentNotifyResp, Error, PaymentNotifyReq>({
    mutationFn: (request) => paymentService.paymentNotify(request),
    onSuccess: () => {
      // 处理异步通知成功后可能需要刷新相关数据
      // 由于通知中可能没有明确的paymentId，所以这里不做具体的缓存刷新
    },
  })
}
