import {request} from '@/utils/request';
import {Category} from './types';

interface GetDirectSubCategoriesRequest {
    parentId: string;
}

interface GetCategoryPathRequest {
    categoryId: string;
}

interface GetCategoryRequest {
    id: string;
}

interface CreateCategoryRequest {
    name: string;
    parentId: string;
    description?: string;
}

interface UpdateCategoryRequest {
    id: string;
    name?: string;
    description?: string;
}

interface DeleteCategoryRequest {
    id: string;
}

interface GetSubTreeRequest {
    rootId: string;
}

interface GetClosureRequest {
    categoryId: string;
}

interface UpdateClosureDepthRequest {
    categoryId: string;
    depth: number;
}

interface Categories {
    categories: Category[];
}

interface ClosureRelations {
    relations: Array<{
        ancestorId: string;
        descendantId: string;
        depth: number;
    }>;
}

export const categoryService = {
    async getDirectSubCategories(req: GetDirectSubCategoriesRequest): Promise<Categories> {
        return request.get(`/v1/categories/${req.parentId}/children`);
    },

    async getCategoryPath(req: GetCategoryPathRequest): Promise<Categories> {
        return request.get(`/v1/categories/${req.categoryId}/path`);
    },

    async getCategory(req: GetCategoryRequest): Promise<Category> {
        return request.get(`/v1/categories/${req.id}`);
    },

    async listLeafCategories(): Promise<Categories> {
        return request.get('/v1/categories/leaves');
    },

    async getSubTree(req: GetSubTreeRequest): Promise<Categories> {
        return request.get(`/v1/categories/${req.rootId}/subtree`);
    },

    async createCategory(req: CreateCategoryRequest): Promise<Category> {
        return request.post('/v1/categories', req);
    },

    async updateCategory(req: UpdateCategoryRequest): Promise<void> {
        return request.put(`/v1/categories/${req.id}`, req);
    },

    async deleteCategory(req: DeleteCategoryRequest): Promise<void> {
        return request.delete(`/v1/categories/${req.id}`);
    },

    async getClosureRelations(req: GetClosureRequest): Promise<ClosureRelations> {
        return request.get(`/v1/categories/${req.categoryId}/closure`);
    },

    async updateClosureDepth(req: UpdateClosureDepthRequest): Promise<void> {
        return request.patch(`/v1/categories/${req.categoryId}/closure`, {depth: req.depth});
    },
};