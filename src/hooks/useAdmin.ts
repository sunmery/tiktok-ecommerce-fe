import { useState } from 'react'
import { useSnapshot } from 'valtio/react'
import { adminStore } from '@/store/adminStore'
import { 
  adminService, 
  SalesDataRequest, 
  UserBehaviorRequest, 
  PerformanceReportRequest,
  SalesDataResponse,
  UserBehaviorResponse,
  PerformanceReportResponse
} from '@/api/adminService'

/**
 * 管理员数据Hook
 * 提供获取平台销售数据、用户行为分析和平台性能报告的方法
 */
export function useAdmin() {
  const { salesData, userBehavior, performanceReport } = useSnapshot(adminStore)
  const [loading, setLoading] = useState({
    salesData: false,
    userBehavior: false,
    performanceReport: false
  })
  const [error, setError] = useState({
    salesData: null as Error | null,
    userBehavior: null as Error | null,
    performanceReport: null as Error | null
  })

  /**
   * 获取平台销售数据
   */
  const fetchSalesData = async (request: SalesDataRequest): Promise<SalesDataResponse | null> => {
    setLoading(prev => ({ ...prev, salesData: true }))
    setError(prev => ({ ...prev, salesData: null }))
    
    try {
      const data = await adminService.getSalesData(request)
      adminStore.setSalesData(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取销售数据失败')
      setError(prev => ({ ...prev, salesData: error }))
      return null
    } finally {
      setLoading(prev => ({ ...prev, salesData: false }))
    }
  }

  /**
   * 获取用户行为分析数据
   */
  const fetchUserBehavior = async (request: UserBehaviorRequest): Promise<UserBehaviorResponse | null> => {
    setLoading(prev => ({ ...prev, userBehavior: true }))
    setError(prev => ({ ...prev, userBehavior: null }))
    
    try {
      const data = await adminService.getUserBehavior(request)
      adminStore.setUserBehavior(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取用户行为数据失败')
      setError(prev => ({ ...prev, userBehavior: error }))
      return null
    } finally {
      setLoading(prev => ({ ...prev, userBehavior: false }))
    }
  }

  /**
   * 获取平台性能报告数据
   */
  const fetchPerformanceReport = async (request: PerformanceReportRequest): Promise<PerformanceReportResponse | null> => {
    setLoading(prev => ({ ...prev, performanceReport: true }))
    setError(prev => ({ ...prev, performanceReport: null }))
    
    try {
      const data = await adminService.getPerformanceReport(request)
      adminStore.setPerformanceReport(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取平台性能数据失败')
      setError(prev => ({ ...prev, performanceReport: error }))
      return null
    } finally {
      setLoading(prev => ({ ...prev, performanceReport: false }))
    }
  }

  return {
    // 状态数据
    salesData,
    userBehavior,
    performanceReport,
    loading,
    error,
    
    // 方法
    fetchSalesData,
    fetchUserBehavior,
    fetchPerformanceReport
  }
}
