/**
 * 货运功能相关的hooks
 * 包括商家发货和用户确认收货的API
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/config'
import { Address } from '@/types/addresses'
import { Coordinates } from '@/types/logisticsMap'

// 发货请求参数
export interface ShipOrderRequest {
  orderId: string
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
}

// 发货响应
export interface ShipOrderResponse {}

// 确认收货请求参数
export interface ConfirmReceivedRequest {
  orderId: string
}

// 确认收货响应
export interface ConfirmReceivedResponse {}

// 物流信息
export interface ShippingInfo {
  trackingNumber: string
  carrier: string
  estimatedDelivery: string
  updates?: ShippingUpdate[]
}

// 物流更新记录
export interface ShippingUpdate {
  location: string
  status: string
  timestamp: string
  description: string
}

/**
 * 商家发货的hook
 */
export function useShipOrder() {
  const queryClient = useQueryClient()

  return useMutation<ShipOrderResponse, Error, ShipOrderRequest>({
    mutationFn: ({ orderId, trackingNumber, carrier, estimatedDelivery }) =>
      api.put<ShipOrderResponse>(`/v1/orders/${orderId}/ship`, {
        trackingNumber,
        carrier,
        estimatedDelivery
      }),
    onSuccess: (_, variables) => {
      // 发货成功后刷新订单详情和列表
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      console.log('发货成功，刷新订单详情和列表')
    },
  })
}

/**
 * 用户确认收货的hook
 */
export function useConfirmReceived() {
  const queryClient = useQueryClient()

  return useMutation<ConfirmReceivedResponse, Error, ConfirmReceivedRequest>({
    mutationFn: ({ orderId }) =>
      api.put<ConfirmReceivedResponse>(`/v1/orders/${orderId}/receive`, {}),
    onSuccess: (_, variables) => {
      // 确认收货成功后刷新订单详情和列表
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      console.log('确认收货成功，刷新订单详情和列表')
    },
  })
}

/**
 * 获取订单物流信息的hook
 */
export function useOrderShippingInfo(orderId: string) {
  return useQuery<ShippingInfo>({
    queryKey: ['shipping', orderId],
    queryFn: async () => {
      try {
        const order = await api.get(`/v1/orders/${orderId}`)
        return {
          trackingNumber: order.trackingNumber || '',
          carrier: order.carrier || '',
          estimatedDelivery: order.estimatedDelivery || '',
          updates: order.shippingUpdates || []
        }
      } catch (err) {
        throw new Error('获取物流信息失败')
      }
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
  })
}

/**
 * 获取商家和用户地址坐标的hook
 * @param orderId 订单ID
 */
export function useShippingAddresses(orderId: string) {
  return useQuery<{ sellerPosition: Coordinates, userPosition: Coordinates }>({
    queryKey: ['shipping-addresses', orderId],
    queryFn: async () => {
      try {
        // 这里应该调用真实的API获取商家和用户地址坐标
        // 目前使用模拟数据
        return {
          sellerPosition: [39.9042, 116.4074], // 北京坐标
          userPosition: [31.2304, 121.4737]     // 上海坐标
        }
      } catch (err) {
        throw new Error('获取地址坐标失败')
      }
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 60, // 1小时内不重新请求
  })
}