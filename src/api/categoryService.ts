/**
 * 分类服务API
 * 基于proto文件定义实现的分类服务API
 */

import {
    Categories,
    Category,
    ClosureRelations,
    CreateCategory,
    CreateCategoryRequest,
    DeleteCategory,
    DeleteCategoryRequest,
    Empty,
    GetCategory,
    GetCategoryPath,
    GetCategoryPathRequest,
    GetCategoryRequest,
    GetClosureRelations,
    GetClosureRequest,
    GetDirectSubCategories,
    GetDirectSubCategoriesRequest,
    GetLeafCategories,
    GetSubTree,
    GetSubTreeRequest,
    UpdateCategory,
    UpdateCategoryRequest,
    UpdateClosureDepth,
    UpdateClosureDepthRequest
} from '@/types/category';

/**
 * 分类服务API
 */

const BaseUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_CATEGORIES_URL}`;

export const categoryService = {
    /**
     * 创建分类
     * POST /v1/categories
     */
    createCategory: async (request: CreateCategoryRequest) => {
        const response = await fetch(`${BaseUrl}/${CreateCategory}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await (response.json() as Promise<Category>);
    },

    /**
     * 获取分类
     * GET /v1/categories/{id}
     */
    getCategory: async (request: GetCategoryRequest) => {
        const response = await fetch(`${BaseUrl}/${GetCategory}/${request.id}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Category>;
    },

    /**
     * 更新分类
     * PUT /v1/categories/{id}
     */
    updateCategory: async (request: UpdateCategoryRequest) => {
        const response = await fetch(`${BaseUrl}/${UpdateCategory}/${request.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: request.name,
                description: request.description
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Empty>;
    },

    /**
     * 删除分类
     * DELETE /v1/categories/{id}
     */
    deleteCategory: async (request: DeleteCategoryRequest) => {
        const response = await fetch(`${BaseUrl}/${DeleteCategory}/${request.id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Empty>;
    },

    /**
     * 获取子树
     * GET /v1/categories/{root_id}/subtree
     */
    getSubTree: async (request: GetSubTreeRequest) => {
        const response = await fetch(`${BaseUrl}/${GetSubTree}/${request.rootId}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Categories>;
    },

    /**
     * 获取分类路径
     * GET /v1/categories/{category_id}/path
     */
    getCategoryPath: async (request: GetCategoryPathRequest) => {
        const response = await fetch(`${BaseUrl}/${GetCategoryPath}/${request.categoryId}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Categories>;
    },

    /**
     * 获取叶子分类
     * GET /v1/categories/categories/leaves
     */
    // getLeafCategories: async () => {
    //     const response = await fetch(`${BaseUrl}/${GetLeafCategories}`, {
    //         method: 'GET'
    //     });
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return await response.json() as Promise<Categories>;
    // },

    /**
     * 获取闭包关系
     * GET /v1/categories/{category_id}/closure
     */
    getClosureRelations: async (request: GetClosureRequest) => {
        const response = await fetch(`${BaseUrl}/${GetClosureRelations}/${request.categoryId}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<ClosureRelations>;
    },

    /**
     * 更新闭包深度
     * PATCH /v1/categories/{category_id}/closure
     */
    updateClosureDepth: async (request: UpdateClosureDepthRequest) => {
        const response = await fetch(`${BaseUrl}/${UpdateClosureDepth}/${request.categoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                depth: request.depth
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Empty>;
    },

    /**
     * 获取所有叶子分类
     * GET /v1/categories/leaves
     */
    listLeafCategories: async (): Promise<Categories> => {
        const response = await fetch(`${BaseUrl}/leaves`, {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);
        return data;
    },

    /**
     * 获取直接子分类（只返回下一级）
     * GET /v1/categories/{parent_id}/children
     */
    getDirectSubCategories: async (request: GetDirectSubCategoriesRequest): Promise<Categories> => {
        const response = await fetch(`${BaseUrl}/${request.parentId}/children`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json() as Promise<Categories>;
    },
};
