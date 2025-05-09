/**
 * 管理员服务API
 * 提供平台销售数据、用户行为分析和平台性能报告的API接口
 */

import {BASE_URL, fetchApi} from './config';

// 销售数据请求参数接口
export interface SalesDataRequest {
    timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
    category?: string;
}

// 用户行为分析请求参数接口
export interface UserBehaviorRequest {
    timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
    segment?: string; // 用户细分
}

// 平台性能报告请求参数接口
export interface PerformanceReportRequest {
    timeRange: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
    metrics?: string[]; // 性能指标
}

// 销售数据响应接口
export interface SalesDataResponse {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesByTime: Array<{
        date: string;
        sales: number;
        orders: number;
    }>;
    salesByCategory: Array<{
        category: string;
        sales: number;
        percentage: number;
    }>;
    salesByRegion: Array<{
        region: string;
        sales: number;
        percentage: number;
    }>;
}

// 用户行为分析响应接口
export interface UserBehaviorResponse {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    pageViews: Array<{
        date: string;
        views: number;
    }>;
    conversionRate: Array<{
        date: string;
        rate: number;
    }>;
    userSources: Array<{
        name: string;
        value: number;
    }>;
    deviceDistribution: Array<{
        name: string;
        value: number;
    }>;
}

// 平台性能报告响应接口
export interface PerformanceReportResponse {
    averageResponseTime: number;
    errorRate: number;
    serverLoad: number;
    responseTimeByTime: Array<{
        date: string;
        time: number;
    }>;
    errorRateByTime: Array<{
        date: string;
        rate: number;
    }>;
    serverLoadByTime: Array<{
        date: string;
        load: number;
    }>;
}

// 敏感词接口参数
export interface SensitiveWord {
  id?: number;
  createdBy: string;
  category: string;
  word: string;
  level: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 获取敏感词请求参数
export interface GetSensitiveWordsRequest {
  page: number;
  pageSize: number;
}

// 获取敏感词响应
export interface GetSensitiveWordsResponse {
  words: SensitiveWord[];
}

// 设置敏感词请求参数
export interface SetSensitiveWordsRequest {
  sensitiveWords: SensitiveWord[];
}

// 设置敏感词响应
export interface SetSensitiveWordsResponse {
  rows: number;
}

export const adminService = {
    /**
     * 获取平台销售数据
     * GET /v1/admin/sales
     */
    getSalesData: (request: SalesDataRequest) => {
        return fetchApi<SalesDataResponse>(`${BASE_URL}/v1/admin/sales`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    },

    /**
     * 获取用户行为分析数据
     * GET /v1/admin/user-behavior
     */
    getUserBehavior: (request: UserBehaviorRequest) => {
        return fetchApi<UserBehaviorResponse>(`${BASE_URL}/v1/admin/user-behavior`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    },

    /**
     * 获取平台性能报告
     * GET /v1/admin/performance
     */
    getPerformanceReport: (request: PerformanceReportRequest) => {
        return fetchApi<PerformanceReportResponse>(`${BASE_URL}/v1/admin/performance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    },

    /**
     * 获取敏感词列表
     * GET /v1/admin/comments/sensitive-words
     */
    getSensitiveWords: (request: GetSensitiveWordsRequest) => {
        return fetchApi<GetSensitiveWordsResponse>(`${BASE_URL}/v1/admin/comments/sensitive-words`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            params: request,
        });
    },

    /**
     * 设置敏感词
     * PUT /v1/admin/comments/sensitive-words
     */
    setSensitiveWords: (request: SetSensitiveWordsRequest) => {
        return fetchApi<SetSensitiveWordsResponse>(`${BASE_URL}/v1/admin/comments/sensitive-words`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    },
};
