/**
 * 分类服务相关类型定义
 */

// 时间戳类型（对应google.protobuf.Timestamp）
export interface Timestamp {
    seconds: number;
    nanos: number;
}

// 空请求类型（对应google.protobuf.Empty）
export interface Empty {
}

// 分类信息
export interface Category {
    id: string;
    parentId: number;
    level: number;
    path: string;
    name: string;
    description?: string;
    isLeaf: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

// 分类列表
export interface Categories {
    categories: Category[];
}

// 创建分类请求
export interface CreateCategoryRequest {
    name: string;
    description: string;
    parentId: string;
}

// 获取分类请求
export interface GetCategoryRequest {
    id: string;
}

// 更新分类请求
export interface UpdateCategoryRequest {
    id: string;
    name: string;
    description: string;
}

// 删除分类请求
export interface DeleteCategoryRequest {
    id: string;
}

// 获取子树请求
export interface GetSubTreeRequest {
    rootId: string;
}

// 获取分类路径请求
export interface GetCategoryPathRequest {
    categoryId: string;
}

// 闭包关系
export interface ClosureRelation {
    ancestorId: string;
    descendantId: string;
    depth: number;
}

// 闭包关系列表
export interface ClosureRelations {
    relations: ClosureRelation[];
}

// 获取闭包请求
export interface GetClosureRequest {
    categoryId: string;
}

// 更新闭包深度请求
export interface UpdateClosureDepthRequest {
    categoryId: string;
    depth: number;
}

// 获取直接子分类请求
export interface GetDirectSubCategoriesRequest {
    parentId: string;
}

// API路径常量
export const CreateCategory = 'categories';
export const GetCategory = 'categories';
export const UpdateCategory = 'categories';
export const DeleteCategory = 'categories';
export const GetSubTree = 'categories/subtree';
export const GetCategoryPath = 'categories/path';
export const GetLeafCategories = 'categories/leaves';
export const GetClosureRelations = 'categories/closure';
export const UpdateClosureDepth = 'categories/closure';
export const GetDirectSubCategories = 'categories/children';