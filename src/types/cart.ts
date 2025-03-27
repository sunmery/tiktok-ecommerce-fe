export interface CartItem {
    merchantId: string
    productId: string
    quantity: number
    name: string
    picture: string
    price: number
    selected?: boolean
    totalPrice?: number
}

export interface UpsertItemReq {
    merchantId: string
    productId: string
    quantity: number
}

export interface GetCartResponse {
    items: CartItem[]
}

export type Cart = GetCartResponse;

export interface RemoveCartItemReq {
    merchantId: string
    productId: string
}

export interface UpsertItemResp {
    success: boolean
}

export interface EmptyCartResp {
    success: boolean
}

export interface RemoveCartItemResp {
    success: boolean
}
