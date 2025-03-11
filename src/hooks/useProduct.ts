import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {api} from '@/api/config'
import type {
    CreateProductRequest,
    UpdateProductRequest,
    SubmitAuditRequest,
} from '@/types/product'
import {AuditProductRequest, AuditRecordResponse, CreateProductResponse, ProductResponse} from "@/types/products.ts";

// 获取商品详情的hook
export function useProduct(id: string, merchantId: string) {
    return useQuery<ProductResponse>({
        queryKey: ['product', id],
        queryFn: async () => {
            const params = new URLSearchParams({merchant_id: merchantId})
            return api.get<ProductResponse>(`/v1/products/${id}?${params.toString()}`)
        },
        enabled: !!id && !!merchantId,
    })
}

// 搜索商品的hook
export function useSearchProducts(name: string) {
    return useQuery<ProductResponse>({
        queryKey: ['products', 'search', name],
        queryFn: async () => {
            const params = new URLSearchParams({name})
            return api.get<ProductResponse>(`/v1/products?${params.toString()}`)
        },
        enabled: !!name,
    })
}

// 创建商品的hook
export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation<CreateProductResponse, Error, CreateProductRequest>({
        mutationFn: (data) => api.post<CreateProductResponse>('/v1/products', data),
        onSuccess: () => {
            // 创建成功后刷新商品列表
            queryClient.invalidateQueries({queryKey: ['products']})
        },
    })
}

// 更新商品的hook
export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation<ProductResponse, Error, UpdateProductRequest>({
        mutationFn: ({id, product}) =>
            api.put<ProductResponse>(`/v1/products/${id}`, {product}),
        onSuccess: (data, variables) => {
            // 更新成功后刷新商品详情和列表
            queryClient.setQueryData(['product', variables.id], data)
            queryClient.invalidateQueries({queryKey: ['products']})
        },
    })
}

// 删除商品的hook
export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation<void, Error, { id: string; merchantId: string }>({
        mutationFn: ({id, merchantId}) => {
            const params = new URLSearchParams({merchant_id: merchantId})
            return api.delete(`/v1/products/${id}?${params.toString()}`)
        },
        onSuccess: (_, variables) => {
            // 删除成功后从缓存中移除商品详情并刷新列表
            queryClient.removeQueries({queryKey: ['product', variables.id]})
            queryClient.invalidateQueries({queryKey: ['products']})
        },
    })
}

// 提交商品审核的hook
export function useSubmitProductAudit() {
    const queryClient = useQueryClient()

    return useMutation<AuditRecordResponse, Error, SubmitAuditRequest>({
        mutationFn: ({productId, merchantId}) =>
            api.post<AuditRecordResponse>(`/v1/products/${productId}/submit-audit`, {merchant_id: merchantId}),
        onSuccess: (_, variables) => {
            // 提交审核成功后刷新商品详情
            queryClient.invalidateQueries({queryKey: ['product', variables.productId]})
        },
    })
}

// 审核商品的hook
export function useAuditProduct() {
    const queryClient = useQueryClient()

    return useMutation<AuditRecordResponse, Error, AuditProductRequest>({
        mutationFn: ({productId, merchantId, action, reason, operatorId}) =>
            api.post<AuditRecordResponse>(`/v1/products/${productId}/audit`, {
                merchant_id: merchantId,
                action,
                reason,
                operator_id: Number(operatorId), // 确保operatorId是数字类型
            }),
        onSuccess: (_, variables) => {
            // 审核完成后刷新商品详情
            queryClient.invalidateQueries({queryKey: ['product', variables.productId]})
        },
    })
}
