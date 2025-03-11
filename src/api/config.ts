import {showMessage} from '@/utils/casdoor'

// 环境配置
export const API_ENV = {
  development: {
    baseURL: import.meta.env.VITE_URL,
  },
  staging: {
    baseURL: import.meta.env.VITE_URL,
  },
  production: {
    baseURL: import.meta.env.VITE_URL,
  },
} as const

// 获取当前环境配置
const currentEnv = (import.meta.env.MODE || 'development') as keyof typeof API_ENV
export const baseURL = API_ENV[currentEnv].baseURL

// 错误处理
const handleError = (error: Error) => {
  showMessage(`请求失败: ${error.message}`)
  return Promise.reject(error)
}

// 默认的请求配置
const defaultConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  mode: 'cors',
  credentials: 'include'
}

// 通用请求函数
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = localStorage.getItem('token')
    const headers = new Headers(options.headers || defaultConfig.headers)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...defaultConfig,
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({message: '网络请求失败'}))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    return handleError(error as Error)
  }
}

// 请求方法封装
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {method: 'GET', ...options}),

  post: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  put: <T>(endpoint: string, data: unknown, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {method: 'DELETE', ...options}),
}
