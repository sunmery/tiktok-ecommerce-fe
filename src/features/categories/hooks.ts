import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {categoryService} from './api';
import {Category} from './types';

// 获取单个分类信息
export function useCategory(categoryId: string) {
    return useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => categoryService.getCategory({id: categoryId}),
        enabled: !!categoryId,
    });
}

// 获取叶子分类列表
export function useLeafCategories() {
    return useQuery({
        queryKey: ['categories', 'leaves'],
        queryFn: () => categoryService.listLeafCategories(),
    });
}

// 获取分类树
export function useCategoryTree(rootId: string) {
    return useQuery({
        queryKey: ['categories', 'tree', rootId],
        queryFn: () => categoryService.getSubTree({rootId}),
        enabled: !!rootId,
    });
}

// 获取直接子分类
export function useDirectSubCategories(parentId: string) {
    return useQuery({
        queryKey: ['categories', 'children', parentId],
        queryFn: () => categoryService.getDirectSubCategories({parentId}),
        enabled: !!parentId,
    });
}

// 获取分类路径
export function useCategoryPath(categoryId: string) {
    return useQuery({
        queryKey: ['categories', 'path', categoryId],
        queryFn: () => categoryService.getCategoryPath({categoryId}),
        enabled: !!categoryId,
    });
}

// 创建分类
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: {
            name: string;
            parentId: string;
            description?: string;
        }) => categoryService.createCategory(request),
        onSuccess: () => {
            // 创建成功后，使相关的查询缓存失效
            queryClient.invalidateQueries({queryKey: ['categories']});
        },
    });
}

// 更新分类
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: {
            id: string;
            name?: string;
            description?: string;
        }) => categoryService.updateCategory(request),
        onSuccess: (_, variables) => {
            // 更新成功后，使相关的查询缓存失效
            queryClient.invalidateQueries({queryKey: ['categories']});
            queryClient.invalidateQueries({queryKey: ['category', variables.id]});
        },
    });
}

// 删除分类
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: { id: string }) => categoryService.deleteCategory(request),
        onSuccess: (_, variables) => {
            // 删除成功后，使相关的查询缓存失效
            queryClient.invalidateQueries({queryKey: ['categories']});
            queryClient.invalidateQueries({queryKey: ['category', variables.id]});
        },
    });
}

// 获取闭包关系
export function useClosureRelations(categoryId: string) {
    return useQuery({
        queryKey: ['categories', 'closure', categoryId],
        queryFn: () => categoryService.getClosureRelations({categoryId}),
        enabled: !!categoryId,
    });
}

// 更新闭包深度
export function useUpdateClosureDepth() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: {
            categoryId: string;
            depth: number;
        }) => categoryService.updateClosureDepth(request),
        onSuccess: (_, variables) => {
            // 更新成功后，使相关的查询缓存失效
            queryClient.invalidateQueries({queryKey: ['categories', 'closure', variables.categoryId]});
        },
    });
}