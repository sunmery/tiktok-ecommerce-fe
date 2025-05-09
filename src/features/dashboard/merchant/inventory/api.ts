/**
 * 库存监控服务API
 * 基于proto文件定义实现的库存监控服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    GetLowStockProductsRequest,
    GetLowStockProductsResponse,
    GetProductStockRequest,
    GetProductStockResponse, GetStockAdjustmentHistoryRequest, GetStockAdjustmentHistoryResponse,
    GetStockAlertsRequest,
    GetStockAlertsResponse,
    RecordStockAdjustmentRequest, RecordStockAdjustmentResponse,
    SetStockAlertRequest,
    SetStockAlertResponse,
    UpdateProductStockRequest,
    UpdateProductStockResponse
} from "@/features/dashboard/merchant/inventory/types.ts";
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
