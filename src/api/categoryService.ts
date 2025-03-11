/**
 * 分类服务API
 * 基于proto文件定义实现的分类服务API
 */

import {
  Categories,
  Category,
  ClosureRelations,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  Empty,
  GetCategoryPathRequest,
  GetCategoryRequest,
  GetClosureRequest,
  GetSubTreeRequest,
  UpdateCategoryRequest,
  UpdateClosureDepthRequest
} from '@/types/category';

/**
 * 分类服务API
 */
export const categoryService = {
  /**
   * 创建分类
   * POST /v1/categories
   */
  createCategory: (request: CreateCategoryRequest) => {
    return fetch('/v1/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Category>;
    });
  },

  /**
   * 获取分类
   * GET /v1/categories/{id}
   */
  getCategory: (request: GetCategoryRequest) => {
    return fetch(`/v1/categories/${request.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Category>;
    });
  },

  /**
   * 更新分类
   * PUT /v1/categories/{id}
   */
  updateCategory: (request: UpdateCategoryRequest) => {
    return fetch(`/v1/categories/${request.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: request.name,
        description: request.description
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Empty>;
    });
  },

  /**
   * 删除分类
   * DELETE /v1/categories/{id}
   */
  deleteCategory: (request: DeleteCategoryRequest) => {
    return fetch(`/v1/categories/${request.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Empty>;
    });
  },

  /**
   * 获取子树
   * GET /v1/categories/{root_id}/subtree
   */
  getSubTree: (request: GetSubTreeRequest) => {
    return fetch(`/v1/categories/${request.rootId}/subtree`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Categories>;
    });
  },

  /**
   * 获取分类路径
   * GET /v1/categories/{category_id}/path
   */
  getCategoryPath: (request: GetCategoryPathRequest) => {
    return fetch(`/v1/categories/${request.categoryId}/path`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Categories>;
    });
  },

  /**
   * 获取叶子分类
   * GET /v1/categories/leaves
   */
  getLeafCategories: () => {
    return fetch('/v1/categories/leaves', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Categories>;
    });
  },

  /**
   * 获取闭包关系
   * GET /v1/categories/{category_id}/closure
   */
  getClosureRelations: (request: GetClosureRequest) => {
    return fetch(`/v1/categories/${request.categoryId}/closure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<ClosureRelations>;
    });
  },

  /**
   * 更新闭包深度
   * PATCH /v1/categories/{category_id}/closure
   */
  updateClosureDepth: (request: UpdateClosureDepthRequest) => {
    return fetch(`/v1/categories/${request.categoryId}/closure`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        depth: request.depth
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<Empty>;
    });
  }
};