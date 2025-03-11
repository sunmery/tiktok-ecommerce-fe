/**
 * 商品服务API
 * 基于proto文件定义实现的商品服务API
 */

import { httpClient } from '@/utils/http-client';
import { Empty } from '@/types/user';
import {
  AuditProductRequest,
  AuditRecord,
  CreateProductReply,
  CreateProductRequest,
  DeleteProductRequest,
  GetProductRequest,
  ListProductsByCategoryRequest,
  ListRandomProductsRequest,
  Product,
  Products,
  SearchProductRequest,
  SubmitAuditRequest,
  UpdateProductRequest
} from '@/types/product';

/**
 * 商品服务API
 */
export const productService = {
  /**
   * 创建商品（草稿状态）
   * POST /v1/products
   */
  createProduct: (request: CreateProductRequest) => {
    return httpClient.post<CreateProductReply>('/v1/products', request);
  },

  /**
   * 更新商品信息
   * PUT /v1/products/{id}
   */
  updateProduct: (request: UpdateProductRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{id}', {
      id: request.id
    });
    return httpClient.put<Product>(url, request);
  },

  /**
   * 提交商品审核
   * POST /v1/products/{productId}/submit-audit
   */
  submitForAudit: (request: SubmitAuditRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{productId}/submit-audit', {
      productId: request.productId
    });
    return httpClient.post<AuditRecord>(url, request);
  },

  /**
   * 审核商品
   * POST /v1/products/{productId}/audit
   */
  auditProduct: (request: AuditProductRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{productId}/audit', {
      productId: request.productId
    });
    return httpClient.post<AuditRecord>(url, request);
  },

  /**
   * 获取商品详情
   * GET /v1/products/{id}
   */
  getProduct: (request: GetProductRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{id}', {
      id: request.id
    });
    return httpClient.get<Product>(url);
  },

  /**
   * 获取商家商品列表
   * GET /v1/merchants/products
   */
  getMerchantProducts: () => {
    return httpClient.get<Products>('/v1/merchants/products', {});
  },

  /**
   * 根据商品名称模糊查询
   * GET /v1/products/{name}
   */
  searchProductsByName: (request: SearchProductRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{name}', {
      name: request.name
    });
    return httpClient.get<Products>(url);
  },

  /**
   * 随机返回商品数据
   * GET /v1/products
   */
  listRandomProducts: (request: ListRandomProductsRequest) => {
    return httpClient.get<Products>('/v1/products', {
      params: request as unknown as Record<string, string>
    });
  },

  /**
   * 根据商品分类查询
   * GET /v1/products/categories/{name}
   */
  listProductsByCategory: (request: ListProductsByCategoryRequest) => {
    const url = httpClient.replacePathParams('/v1/products/categories/{name}', {
      name: request.name
    });
    return httpClient.get<Products>(url);
  },

  /**
   * 删除商品（软删除）
   * DELETE /v1/products/{id}
   */
  deleteProduct: (request: DeleteProductRequest) => {
    const url = httpClient.replacePathParams('/v1/products/{id}', {
      id: request.id
    });
    return httpClient.delete<Empty>(url);
  }
};
