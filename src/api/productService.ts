/**
 * 商品服务API
 * 基于proto文件定义实现的商品服务API
 */

import {httpClient} from '@/utils/http-client';
import {Empty} from '@/types/user';
import {
    AuditProductRequest,
    AuditRecord,
    CreateProductReply,
    CreateProductRequest,
    DeleteProductRequest,
    GetCategoryProductsRequest,
    GetProductRequest,
    GetProductStatusPending,
    ListProductsByCategoryRequest,
    ListRandomProductsRequest,
    Product,
    ProductRows,
    Products,
    SearchProductRequest,
    SubmitAuditRequest,
    UpdateProductRequest,
} from '@/types/products';

/**
 * 商品服务API
 */
export const productService = {
    /**
     * 创建商品（草稿状态）
     * POST /v1/products
     */
    createProduct: (request: CreateProductRequest) => {
        return httpClient.post<CreateProductReply>(`${import.meta.env.VITE_PRODUCERS_URL}`, request);
    },

    /**
     * 批量创建商品
     * POST /v1/products/batch
     */
    createProductBatch: (objectArray: ProductRows) => {
        return httpClient.put<CreateProductReply>(`${import.meta.env.VITE_PRODUCERS_URL}`, objectArray, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    /**
     * 更新商品信息
     * PUT v1/merchants/products/{id}
     */
    updateProduct: (request: UpdateProductRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_MERCHANTS_URL}/products/{id}`, {
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
            productId: request.productId,
            merchantId: request.merchantId
        };
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/{productId}/submit-audit`, {
            productId: request.productId
        });
        return httpClient.post<AuditRecord>(url, snakeCaseRequest);
    },

    /**
     * 审核商品
     * POST /v1/products/{productId}/audit
     */
    auditProduct: (request: AuditProductRequest) => {
        const snakeCaseRequest = {
            productId: request.productId,
            merchantId: request.merchantId,
            action: request.action,
            reason: request.reason,
            operatorId: request.operatorId
        };
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/{product_id}/audit`, {
            product_id: request.productId
        });
        return httpClient.post<AuditRecord>(url, snakeCaseRequest);
    },
    /**
     * 获取待审核的商品列表
     * GET /v1/products
     */
    getProductStatusPending: (request: GetProductStatusPending) => {
        return httpClient.get<Products>(`${import.meta.env.VITE_PRODUCERS_URL}`, {
            params: request
        });
    },

    /**
     * 获取商品详情
     * GET /v1/products/{id}
     */
    getProduct: (request: GetProductRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}`, {
            productId: request.productId as string,
            merchantId: request.merchantId
        });
        return httpClient.get<Product>(url);
    },

    /**
     * 获取商家商品列表
     * GET /v1/merchants/products
     */
    getMerchantProducts: (params?: { page?: number; pageSize?: number }) => {
        return httpClient.get<Products>(`${import.meta.env.VITE_MERCHANTS_URL}/products`, {
            params
        });
    },

    /**
     * 根据商品名称模糊查询
     * GET /v1/products/{name}
     */
    searchProductsByName: (request: SearchProductRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/{name}`, {
            name: request.name
        });
        return httpClient.get<Products>(url);
    },

    /**
     * 随机返回商品数据
     * GET /v1/products
     */
    listRandomProducts: (request: ListRandomProductsRequest) => {
        return httpClient.get<Products>(`${import.meta.env.VITE_PRODUCERS_URL}`, {
            params: request
        });
    },

    /**
     * 根据分类ID获取商品
     * GET /v1/products/category/{categoryId}
     */
    getCategoryProducts: (request: GetCategoryProductsRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/category/{categoryId}`, {
            categoryId: request.categoryId.toString()
        });
        return httpClient.get<Products>(url, {
            params: {
                page: request.page,
                page_size: request.pageSize,
                status: request.status
            }
        });
    },

    /**
     * 根据分类ID获取包含子分类的商品
     * GET /v1/products/category/{categoryId}/with-children
     */
    getCategoryWithChildrenProducts: (request: GetCategoryProductsRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/category/{categoryId}/with-children`, {
            categoryId: request.categoryId.toString()
        });
        return httpClient.get<Products>(url, {
            params: {
                page: request.page,
                page_size: request.pageSize,
                status: request.status
            }
        });
    },

    /**
     * 根据商品分类查询
     * GET /v1/products/categories/{name}
     */
    listProductsByCategory: (request: ListProductsByCategoryRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/categories/{categoryName}`, {
            categoryName: request.categoryName,
            page: request.page,
            pageSize: request.pageSize,
            status: request.status
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
            productId: request.id,
            merchantId: request.merchantId
        };
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}`, {
            productId: request.id,
            merchantId: request.merchantId,
        });
        return httpClient.delete<Empty>(url, {body: JSON.stringify(snakeCaseRequest)});
    }
};
