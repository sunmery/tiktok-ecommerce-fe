import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {api} from '@/api/config'
import type {CreateProductRequest, Product, SubmitAuditRequest,} from '@/types/products.ts'
import {AuditProductRequest, AuditRecordResponse, CreateProductResponse, ProductResponse} from "@/types/products.ts";
import {productService} from '@/api/productService';
import {
    GetCategoryProductsRequest,
    ListProductsByCategoryRequest,
    ListRandomProductsRequest,
    ProductStatus,
    SearchProductRequest
} from '@/types/products';

// 获取商品详情的hook
export function useProduct(id: string, merchantId: string) {
    return useQuery<ProductResponse>({
        queryKey: ['product', id],
        queryFn: async ({signal}) => {
            try {
                const params = new URLSearchParams({merchantId: merchantId})
                const controller = new AbortController()
                signal?.addEventListener('abort', () => controller.abort())

                const response = await Promise.race([
                    api.get<ProductResponse>(`/v1/products/${id}?${params.toString()}`, {signal: controller.signal}),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('请求超时')), 10000)
                    )
                ]);

                return response as ProductResponse;
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    throw new Error('请求已取消')
                }

                if (err instanceof Error && err.message === '请求超时') {
                    throw new Error('获取商品详情超时，请稍后重试')
                }

                // 如果API请求失败，尝试使用mock数据
                try {
                    const {mockProducts} = await import('@/utils/mockData')
                    const mockProduct = mockProducts.find((p: Product) => p.id === id)
                    if (mockProduct) {
                        console.warn('使用mock数据显示商品详情:', mockProduct)
                        return {
                            state: "success",
                            data: mockProduct
                        } as ProductResponse
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
        gcTime: 1000 * 60 * 30, // 缓存30分钟
    })
}

// 搜索商品的hook
export function useSearchProducts(query: string) {
    return useQuery({
        queryKey: ['products', 'search', query],
        queryFn: () => productService.searchProductsByName({name: query} as SearchProductRequest),
        enabled: !!query, // 只有当有搜索关键词时才发起请求
        staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    });
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

    return useMutation<ProductResponse, Error, { id: string, product: any }>({
        mutationFn: ({id, product}) =>
            api.put<ProductResponse>(`/v1/products/${id}`, {product}),
        onSuccess: (data, variables) => {
            // 更新成功后刷新商品详情和列表
            queryClient.setQueryData(['product', variables.id], data)
            queryClient.invalidateQueries({queryKey: ['products']}).then(r => {
                console.log("更新成功后刷新商品详情和列表", r)
            })
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
        mutationFn: ({productId, merchantId, action, reason, operatorId}: AuditProductRequest) =>
            api.post<AuditRecordResponse>(`/v1/products/${productId}/audit`, {
                merchantId: merchantId,
                action,
                reason,
                operatorId: Number(operatorId) // 确保operatorId是数字类型
            }),
        onSuccess: (_, variables) => {
            // 审核完成后刷新商品详情
            queryClient.invalidateQueries({queryKey: ['product', variables.productId]}).then(r => {
                console.log("审核完成, 重新获取商品详情", r)
            }).catch(e => {
                console.error("刷新商品详情失败", e)
            })
        },
    })
}

/**
 * 获取随机商品
 * @param options 随机商品选项
 */
export function useRandomProducts(options: ListRandomProductsRequest = {
    page: 1,
    pageSize: 10,
    status: ProductStatus.PRODUCT_STATUS_APPROVED
}) {
    return useQuery({
        queryKey: ['products', 'random', options],
        queryFn: () => productService.listRandomProducts(options),
        staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    });
}

/**
 * 按分类名称获取商品
 * @param category 分类名称
 * @param options 分页和其他选项
 */
export function useProductsByCategory(
    categoryName: string,
    options: Omit<ListProductsByCategoryRequest, 'categoryName'> = {page: 1, pageSize: 10, status: 2}
) {
    return useQuery({
        queryKey: ['products', 'category', categoryName, options],
        queryFn: () => productService.listProductsByCategory({categoryName, ...options}),
        enabled: !!categoryName, // 只有当有分类名称时才发起请求
        staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    });
}

/**
 * 按分类ID获取商品
 * @param categoryId 分类ID
 * @param options 分页和其他选项
 */
export function useCategoryProducts(
    categoryId: number,
    options: Omit<GetCategoryProductsRequest, 'categoryId'> = {page: 1, pageSize: 10, status: 2}
) {
    return useQuery({
        queryKey: ['products', 'categoryById', categoryId, options],
        queryFn: () => productService.getCategoryProducts({categoryId, ...options}),
        enabled: !!categoryId, // 只有当有分类ID时才发起请求
        staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    });
}

/**
 * 按分类ID获取包含子分类的商品
 * @param categoryId 分类ID
 * @param options 分页和其他选项
 */
export function useCategoryWithChildrenProducts(
    categoryId: number,
    options: Omit<GetCategoryProductsRequest, 'categoryId'> = {page: 1, pageSize: 100, status: 2}
) {
    return useQuery({
        queryKey: ['products', 'categoryWithChildren', categoryId, options],
        queryFn: () => productService.getCategoryWithChildrenProducts({categoryId, ...options}),
        enabled: !!categoryId, // 只有当有分类ID时才发起请求
        staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    });
}
