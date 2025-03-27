import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {categoryService} from '@/api/categoryService'
import {
  Categories,
  Category,
  ClosureRelations,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  Empty,
  UpdateCategoryRequest,
  UpdateClosureDepthRequest
} from '@/types/category'

/**
 * 获取分类信息的hook
 * @param categoryId 分类ID
 */
export function useCategory(categoryId: string) {
    return useQuery<Category>({
        queryKey: ['category', categoryId],
        queryFn: () => categoryService.getCategory({id: categoryId}),
        enabled: !!categoryId, // 只有当categoryId存在时才发起请求
    })
}

/**
 * 获取分类列表的hook
 */
export function useCategories() {
    return useQuery<Categories>({
        queryKey: ['categories'],
        queryFn: () => categoryService.listLeafCategories(),
    })
}

/**
 * 获取分类子树的hook
 * @param rootId 根分类ID
 */
export function useCategorySubTree(rootId: string) {
    return useQuery<Categories>({
        queryKey: ['categories', 'subtree', rootId],
        queryFn: () => categoryService.getSubTree({rootId: rootId}),
        enabled: !!rootId, // 只有当rootId存在时才发起请求
    })
}

/**
 * 获取直接子分类的hook
 * @param parentId 父分类ID
 */
export function useDirectSubCategories(parentId: string) {
    return useQuery<Categories>({
        queryKey: ['categories', 'children', parentId],
        queryFn: () => categoryService.getDirectSubCategories({parentId: parentId}),
        enabled: !!parentId, // 只有当parentId存在时才发起请求
    })
}

/**
 * 获取分类路径的hook
 * @param categoryId 分类ID
 */
export function useCategoryPath(categoryId: string) {
    return useQuery<Categories>({
        queryKey: ['categories', 'path', categoryId],
        queryFn: () => categoryService.getCategoryPath({categoryId: categoryId}),
        enabled: !!categoryId, // 只有当categoryId存在时才发起请求
    })
}

/**
 * 创建分类的hook
 */
export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation<Category, Error, CreateCategoryRequest>({
        mutationFn: (request) => categoryService.createCategory(request),
        onSuccess: () => {
            // 创建分类成功后刷新分类列表
            queryClient.invalidateQueries({queryKey: ['categories']})
        },
    })
}

/**
 * 更新分类的hook
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation<Empty, Error, UpdateCategoryRequest>({
        mutationFn: (request) => categoryService.updateCategory(request),
        onSuccess: (_, variables) => {
            // 更新分类成功后刷新分类详情和列表
            queryClient.invalidateQueries({queryKey: ['category', variables.id]})
            queryClient.invalidateQueries({queryKey: ['categories']})
        },
    })
}

/**
 * 删除分类的hook
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation<Empty, Error, DeleteCategoryRequest>({
        mutationFn: (request) => categoryService.deleteCategory(request),
        onSuccess: (_, variables) => {
            // 删除分类成功后从缓存中移除分类详情并刷新列表
            queryClient.removeQueries({queryKey: ['category', variables.id]})
            queryClient.invalidateQueries({queryKey: ['categories']})
        },
    })
}

/**
 * 获取闭包关系的hook
 * @param categoryId 分类ID
 */
export function useCategoryClosure(categoryId: string) {
    return useQuery<ClosureRelations>({
        queryKey: ['categories', 'closure', categoryId],
        queryFn: () => categoryService.getClosureRelations({categoryId: categoryId}),
        enabled: !!categoryId, // 只有当categoryId存在时才发起请求
    })
}

/**
 * 更新闭包深度的hook
 */
export function useUpdateClosureDepth() {
    const queryClient = useQueryClient()

    return useMutation<Empty, Error, UpdateClosureDepthRequest>({
        mutationFn: (request) => categoryService.updateClosureDepth(request),
        onSuccess: (_, variables) => {
            // 更新闭包深度成功后刷新相关数据
            queryClient.invalidateQueries({queryKey: ['categories', 'closure', variables.categoryId]})
        },
    })
}
