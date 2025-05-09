/**
 * 结账相关类型定义
 */

import type {CartItem} from '@/types/cart'
import type {Address} from '@/types/addresses'
import type {CreditCard} from '@/types/creditCards'

// 结账状态
export interface CheckoutState {
    selectedItems: CartItem[]
    selectedAddressId: number
    selectedCardId: number
    addresses: Address[]
    creditCards: CreditCard[]
    selectedAddress: Address | null
    selectedCard: CreditCard | null
    loading: boolean
}