import { http } from '@/core'
import type {
  GetProductStockResponse,
  StockAlert,
  LowStockProduct,
  StockAdjustment,
  PaginationParams
} from './types'

/**
 * 库存管理API集合
 * 提供库存查询、调整、警报设置等核心功能接口
 */
export const InventoryApi = {
    /**
   * 获取产品库存详情
   * @param productId - 产品唯一标识
   * @returns 包含当前库存、警报阈值和低库存状态的响应对象
   */
  getStock: (productId: string) => 
    http.get<GetProductStockResponse>(`/merchants/inventory/${productId}`),

    /**
   * 更新产品库存
   * @param productId - 目标产品ID
   * @param data - 库存调整数据
   * @param data.stock - 新的库存数量
   * @param data.reason - 调整原因说明
   * @returns 空响应体
   */
  updateStock: (productId: string, data: { stock: number; reason: string }) =>
    http.put(`/merchants/inventory/${productId}`, data),

    /**
   * 设置库存警报阈值
   * @param data - 警报配置参数
   * @param data.productId - 需要监控的产品ID
   * @param data.threshold - 触发低库存警报的最小库存数量
   * @returns 创建的警报配置记录
   */
  setAlert: (data: { productId: string; threshold: number }) =>
    http.post('/merchants/inventory/alerts', data),

    /**
   * 分页获取库存警报列表
   * @param params - 分页查询参数
   * @param params.page - 当前页码
   * @param params.pageSize - 每页记录数
   * @returns 包含警报列表和总数量的响应对象
   */
  getAlerts: (params: PaginationParams) => 
    http.get<{ alerts: StockAlert[]; total: number }>('/merchants/inventory/alerts', { params }),

    /**
   * 查询低库存产品
   * @param params - 分页查询参数
   * @returns 包含低库存产品列表和总数量的响应对象
   * @remarks 低库存判定基于产品设置的警报阈值
   */
  getLowStock: (params: PaginationParams) =>
    http.get<{ products: LowStockProduct[]; total: number }>('/merchants/inventory/low-stock', { params }),

    /**
   * 记录库存调整操作
   * @param data - 调整记录参数
   * @param data.productId - 被调整产品ID
   * @param data.quantity - 库存调整数量（正数为增加，负数为减少）
   * @param data.reason - 调整原因说明
   * @param data.operatorId - 操作人员ID
   * @returns 创建的调整记录
   */
  recordAdjustment: (data: {
    productId: string;
    quantity: number;
    reason: string;
    operatorId: string;
  }) => http.post('/merchants/inventory/adjustments', data),

    /**
   * 获取产品库存调整历史
   * @param productId - 目标产品ID
   * @param params - 分页查询参数
   * @returns 包含调整历史记录和总数量的响应对象
   */
  getAdjustmentHistory: (productId: string, params: PaginationParams) =>
    http.get<{ adjustments: StockAdjustment[]; total: number }>(`/merchants/inventory/adjustments/${productId}`, { params })
}