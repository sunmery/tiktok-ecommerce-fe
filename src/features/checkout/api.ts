

import { httpClient } from "@/utils/http-client.ts";

interface CheckoutRequest {
  userId?: string
  firstname: string
  lastname: string
  email: string
  addressId: number
  creditCardId?: number
  paymentMethod: string

  selectedItems?: any[]
}

interface CheckoutResponse {
  orderId: number
  paymentId: number
  paymentUrl: string
}

export const checkoutService = {
  /**
   * 创建结账订单
   * @param data 结账数据
   * @returns 结账响应
   */
  checkout: (data: CheckoutRequest): Promise<CheckoutResponse> => {
    return httpClient.post<CheckoutResponse>(`${import.meta.env.VITE_CHECKOUT_URL}`, data)
  }
}
