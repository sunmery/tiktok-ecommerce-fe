// 自动生成的类型定义，根据proto文件转换
export interface GetProductStockResponse {
  productId: string;
  merchantId: string;
  stock: number;
  alertThreshold?: number;
  isLowStock: boolean;
}

export interface StockAlert {
  productId: string;
  merchantId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface LowStockProduct {
  productId: string;
  merchantId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  imageUrl?: string;
}

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

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}