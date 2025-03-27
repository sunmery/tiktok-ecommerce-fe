import {proxy, subscribe} from 'valtio'
import {PerformanceReportResponse, SalesDataResponse, UserBehaviorResponse} from '@/api/adminService'

// 管理员数据状态接口
export interface AdminState {
    salesData: SalesDataResponse | null
    userBehavior: UserBehaviorResponse | null
    performanceReport: PerformanceReportResponse | null
    setSalesData: (data: SalesDataResponse) => void
    setUserBehavior: (data: UserBehaviorResponse) => void
    setPerformanceReport: (data: PerformanceReportResponse) => void
}

// 初始化管理员数据状态
export const adminStore = proxy<AdminState>({
    salesData: null,
    userBehavior: null,
    performanceReport: null,
    setSalesData(data) {
        adminStore.salesData = data
    },
    setUserBehavior(data) {
        adminStore.userBehavior = data
    },
    setPerformanceReport(data) {
        adminStore.performanceReport = data
    },
})

// 订阅状态变化，将数据存储到 localStorage
subscribe(adminStore, () => {
    // 只存储数据，不存储方法
    const storeData = {
        salesData: adminStore.salesData,
        userBehavior: adminStore.userBehavior,
        performanceReport: adminStore.performanceReport,
    }
    localStorage.setItem('adminData', JSON.stringify(storeData))
})

// 初始化时从 localStorage 恢复数据
const savedAdminData = localStorage.getItem('adminData')
if (savedAdminData) {
    try {
        const parsedData = JSON.parse(savedAdminData)
        if (parsedData.salesData) adminStore.salesData = parsedData.salesData
        if (parsedData.userBehavior) adminStore.userBehavior = parsedData.userBehavior
        if (parsedData.performanceReport) adminStore.performanceReport = parsedData.performanceReport
    } catch (error) {
        console.error('恢复管理员数据失败:', error)
    }
}
