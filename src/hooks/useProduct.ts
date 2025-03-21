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
        queryFn: async ({ signal }) => {
            try {
                const params = new URLSearchParams({merchantId: merchantId})
                const controller = new AbortController()
                signal?.addEventListener('abort', () => controller.abort())
                
                const response = await Promise.race([
                    api.get<ProductResponse>(`/v1/products/${id}?${params.toString()}`, { signal: controller.signal }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('请求超时')), 10000)
                    )
                ])
                
                const data = response.data
                
                if (!data) {
                    throw new Error('商品数据为空')
                }

                // 增强图片数据完整性检查和处理
                const processedImages = (Array.isArray(data.images) ? data.images : []).map((img, index) => ({
                    ...img,
                    isPrimary: img.isPrimary ?? (index === 0),
                    sortOrder: img.sortOrder ?? index,
                    url: img.url || data.picture || 'https://picsum.photos/300/200'
                }))

                return {
                    ...data,
                    images: processedImages.length > 0 ? processedImages : [{
                        url: data.picture || 'https://picsum.photos/300/200',
                        isPrimary: true,
                        sortOrder: 0
                    }]
                } as Product
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw new Error('请求已取消')
                }
                
                if (err.message === '请求超时') {
                    throw new Error('获取商品详情超时，请稍后重试')
                }

                // 如果API请求失败，尝试使用mock数据
                try {
                    const { mockProducts } = await import('@/utils/mockData')
                    const mockProduct = mockProducts.find(p => p.id === id)
                    if (mockProduct) {
                        console.warn('使用mock数据显示商品详情:', mockProduct)
                        return mockProduct
                    }
                } catch (mockErr) {
                    console.error('加载mock数据失败:', mockErr)
                }
                
                throw new Error(err instanceof Error ? err.message : '商品不存在或已下架')
            }
        },
        enabled: !!id,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5分钟内数据不会重新请求
        cacheTime: 1000 * 60 * 30, // 缓存30分钟
    })
}

// 搜索商品的hook
export function useSearchProducts(name: string) {
    return useQuery<Product>({
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
            const params = new URLSearchParams({merchantId: merchantId})
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
            api.post<AuditRecordResponse>(`/v1/products/${productId}/submit-audit`, {merchantId: merchantId}),
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
                merchantId: merchantId,
                action,
                reason,
                operatorId: Number(operatorId) // 确保operatorId是数字类型
            }),
        onSuccess: (_, variables) => {
            // 审核完成后刷新商品详情
            queryClient.invalidateQueries({queryKey: ['product', variables.productId]})
        },
    })
}
