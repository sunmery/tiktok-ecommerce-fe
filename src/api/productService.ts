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
  UpdateProductRequest,
  // API方法名常量导入
  CreateProduct,
  UpdateProduct,
  SubmitForAudit,
  AuditProduct,
  ListRandomProducts,
  GetProduct,
  GetMerchantProducts,
  SearchProductsByName,
  ListProductsByCategory,
  DeleteProduct
} from '@/types/product';

const URL =`${import.meta.env.VITE_URL}${import.meta.env.VITE_PRODUCERS_URL}`

/**
 * 商品服务API
 */
export const productService = {
  /**
   * 创建商品（草稿状态）
   * POST /v1/products
   */
  createProduct: (request: CreateProductRequest) => {
    return httpClient.post<CreateProductReply>(`${import.meta.env.VITE_PRODUCERS_URL}/${CreateProduct}`, request);
  },

  /**
   * 更新商品信息
   * PUT /v1/products/{id}
   */
  updateProduct: (request: UpdateProductRequest) => {
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/${UpdateProduct}`, {
      id: request.id
    });
    return httpClient.put<Product>(url, request);
  },

  /**
   * 提交商品审核
   * POST /v1/products/{productId}/submit-audit
   */
  submitForAudit: (request: SubmitAuditRequest) => {
    const snakeCaseRequest = {
      product_id: request.product_id,
      merchant_id: request.merchant_id
    };
    const url = httpClient.replacePathParams(`/v1/products/{productId}/${SubmitForAudit}`, {
      product_id: request.product_id
    });
    return httpClient.post<AuditRecord>(url, snakeCaseRequest);
  },

  /**
   * 审核商品
   * POST /v1/products/{productId}/audit
   */
  auditProduct: (request: AuditProductRequest) => {
    const snakeCaseRequest = {
      product_id: request.product_id,
      merchant_id: request.merchant_id,
      action: request.action,
      reason: request.reason,
      operator_id: request.operator_id
    };
    const url = httpClient.replacePathParams(`/v1/products/{productId}/${AuditProduct}`, {
      product_id: request.product_id
    });
    return httpClient.post<AuditRecord>(url, snakeCaseRequest);
  },

  /**
   * 获取商品详情
   * GET /v1/products/{id}
   */
  getProduct: (request: GetProductRequest) => {
    const snakeCaseParams = {
      id: request.id,
      merchant_id: request.merchant_id
    };
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/${GetProduct}`, {
      id: request.id,
      merchant_id: request.merchant_id
    });
    return httpClient.get<Product>(url);
  },

  /**
   * 获取商家商品列表
   * GET /v1/merchants/products
   */
  getMerchantProducts: () => {
    return httpClient.get<Products>(`/v1/merchants/${GetMerchantProducts}`, {});
  },

  /**
   * 根据商品名称模糊查询
   * GET /v1/products/{name}
   */
  searchProductsByName: (request: SearchProductRequest) => {
    const url = httpClient.replacePathParams(`/v1/products/${SearchProductsByName}/{name}`, {
      name: request.name
    });
    return httpClient.get<Products>(url);
  },

  /**
   * 随机返回商品数据
   * GET /v1/products
   */
  listRandomProducts: (request: ListRandomProductsRequest) => {
    // 将驼峰命名法转换为蛇形命名法
    const snakeCaseRequest = {
      page: request.page,
      page_size: request.page_size,
      status: request.status
    };
    return httpClient.post<Products>(`${URL}/${ListRandomProducts}`, snakeCaseRequest);
  },

  /**
   * 根据商品分类查询
   * GET /v1/products/categories/{name}
   */
  listProductsByCategory: (request: ListProductsByCategoryRequest) => {
    const url = httpClient.replacePathParams(`/v1/products/categories/${ListProductsByCategory}/{name}`, {
      name: request.name
    });
    return httpClient.get<Products>(url);
  },

  /**
   * 删除商品（软删除）
   * DELETE /v1/products/{id}
   */
  deleteProduct: (request: DeleteProductRequest) => {
    // 将驼峰命名法转换为蛇形命名法
    const snakeCaseRequest = {
      id: request.id,
      merchant_id: request.merchant_id
    };
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/${DeleteProduct}`, {
      product_id: request.id
    });
    return httpClient.delete<Empty>(url, { body: JSON.stringify(snakeCaseRequest) });
  }
};
