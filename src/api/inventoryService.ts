/**
 * 库存监控服务API
 * 基于proto文件定义实现的库存监控服务API
 */

import {httpClient} from '@/utils/http-client';

// 库存警报配置
export interface StockAlert {
    productId: string;
    merchantId: string;
    productName: string;
    currentStock: number;
    threshold: number;
    createdAt: string;
    updatedAt: string;
}

// 低库存产品信息
export interface LowStockProduct {
    productId: string;
    merchantId: string;
    productName: string;
    currentStock: number;
    threshold: number;
    imageUrl: string;
}

// 库存调整记录
export interface StockAdjustment {
    id: string;
    productId: string;
    merchantId: string;
    productName: string;
    quantity: number;
    reason: string;
    operatorId: string;
    createdAt: string;
}

// 请求和响应类型
export interface GetProductStockRequest {
    productId: string;
    merchantId: string;
}

export interface GetProductStockResponse {
    productId: string;
    merchantId: string;
    stock: number;
    alertThreshold: number;
    isLowStock: boolean;
}

export interface UpdateProductStockRequest {
    productId: string;
    merchantId: string;
    stock: number;
    reason: string;
}

export interface UpdateProductStockResponse {
    success: string
    message: string
}

export interface SetStockAlertRequest {
    productId: string;
    merchantId: string;
    threshold: number;
}

export interface SetStockAlertResponse {
    success: string; // 操作是否成功
    message: string; // 操作结果消息
}

export interface GetStockAlertsRequest {
    merchantId?: string;
    page: number;
    pageSize: number;
}

export interface GetStockAlertsResponse {
    alerts: StockAlert[];
    total: number;
}

export interface GetLowStockProductsRequest {
    merchantId: string;
    page: number;
    pageSize: number;
    threshold: number;
}

export interface GetLowStockProductsResponse {
    products: LowStockProduct[];
    total: number;
}

export interface RecordStockAdjustmentRequest {
    productId: string;
    merchantId: string;
    quantity: number;
    reason: string;
    operatorId?: string;
}

export interface RecordStockAdjustmentResponse {
    success: string;
    message: string;
    adjustment_id: string; // 库存调整记录ID
}

export interface GetStockAdjustmentHistoryRequest {
    // productId: string;
    merchantId?: string;
    page: number;
    pageSize: number;
}

export interface GetStockAdjustmentHistoryResponse {
    adjustments: StockAdjustment[];
    total: number;
}

/**
 * 库存监控服务API
 */
export const inventoryService = {
    /**
     * 获取产品当前库存
     * GET /v1/inventory/{productId}
     */
    getProductStock: (request: GetProductStockRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/{product_id}`, {
            product_id: request.productId
        });
        return httpClient.get<GetProductStockResponse>(url, {
            params: {
                merchantId: request.merchantId
            }
        });
    },

    /**
     * 更新产品库存
     * PUT /v1/inventory/{productId}
     */
    updateProductStock: (request: UpdateProductStockRequest) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/{productId}`, {
            productId: request.productId
        });
        return httpClient.put<UpdateProductStockResponse>(url, request);
    },

    /**
     * 设置库存警报阈值
     * POST /v1/inventory/alerts
     */
    setStockAlert: (request: SetStockAlertRequest) => {
        return httpClient.post<SetStockAlertResponse>(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/alerts`, request);
    },

    /**
     * 获取库存警报配置
     * GET /v1/inventory/alerts
     */
    getStockAlerts: (request: GetStockAlertsRequest) => {
        return httpClient.get<GetStockAlertsResponse>(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/alerts`, {
            params: {
                merchantId: request.merchantId,
                page: request.page,
                pageSize: request.pageSize
            }
        });
    },

    /**
     * 获取低库存产品列表
     * GET /v1/inventory/low-stock
     */
    getLowStockProducts: (request: GetLowStockProductsRequest) => {
        return httpClient.get<GetLowStockProductsResponse>(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/low-stock`, {
            params: {
                merchantId: request.merchantId,
                page: request.page,
                pageSize: request.pageSize,
                threshold: request.threshold
            }
        });
    },

    /**
     * 记录库存调整
     * POST /v1/inventory/adjustments
     */
    recordStockAdjustment: (request: RecordStockAdjustmentRequest) => {
        return httpClient.post<RecordStockAdjustmentResponse>(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/adjustments`, {
            params: {
                productId: request.productId,
                merchantId: request.merchantId,
                quantity: request.quantity,
                reason: request.reason,
                operatorId: request.operatorId
            }
        });
    },

    /**
     * 获取库存调整历史
     * GET /v1/inventory/adjustments/{productId}
     */
    getStockAdjustmentHistory: (request: GetStockAdjustmentHistoryRequest) => {
        // const url = httpClient.replacePathParams(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/adjustments/{product_id}`, {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_MERCHANTS_URL}/inventory/adjustments`, {
            // product_id: request.productId
        });
        return httpClient.get<GetStockAdjustmentHistoryResponse>(url, {
            params: {
                merchantId: request.merchantId,
                page: request.page,
                pageSize: request.pageSize
            }
        });
    }
};
