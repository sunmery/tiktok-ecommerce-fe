/**
 * 结账相关类型定义
 */

import type {CartItem} from '@/types/cart'
import { CreditCard } from "@/features/dashboard/consumer/creditCard/type.ts";
import { ConsumerAddress } from "@/features/dashboard/consumer/orders/type.ts";

// 结账状态
export interface CheckoutState {
    selectedItems: CartItem[]
    selectedAddressId: number
    selectedCardId: number
    addresses: ConsumerAddress[]
    creditCards: CreditCard[]
    selectedAddress: ConsumerAddress | null
    selectedCard: CreditCard | null
    loading: boolean
}
