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
