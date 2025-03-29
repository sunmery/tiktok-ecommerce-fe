import {showMessage} from '@/utils/casdoor'

export const BASE_URL = import.meta.env.VITE_URL

// 错误处理
const handleError = (error: Error) => {
    // 处理网络错误和其他API错误
    let errorMessage = '请求失败';

    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = '网络连接失败，请检查您的网络连接';
    } else if (error.message) {
        // 处理UUID相关错误
        if (error.message.includes('UUID') || error.message.includes('uuid')) {
            if (error.message.includes('invalid UUID length: 0')) {
                errorMessage = '商品ID格式错误: ID不能为空';
            } else {
                errorMessage = '商品ID格式错误: ' + error.message;
            }
        } else {
            errorMessage = `${errorMessage}: ${error.message}`;
        }
    }

    // 使用error类型显示红色警告框
    showMessage(errorMessage, 'error')
    return Promise.reject(error)
}

// 默认的请求配置
const defaultConfig: RequestInit = {
    // 使用默认的mode，让浏览器自动处理CORS
    // mode: 'cors',
    // 只有在需要发送cookies时才设置credentials为'include'
    credentials: 'same-origin'
}

// 通用请求函数
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    try {
        const token = localStorage.getItem('token')
        const headers = new Headers(options.headers || defaultConfig.headers)

        // 只在特定方法中设置Content-Type
        const method = options.method ?? 'GET'
        if (!headers.has('Content-Type') && ['POST', 'PUT', 'PATCH'].includes(method)) {
            headers.set('Content-Type', 'application/json')
        }

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...defaultConfig,
            ...options,
            headers,
        })

        if (!response.ok) {
            // 处理特定的错误状态码
            if (response.status === 401) {
                showMessage('您的登录已过期，请重新登录', 'error')
                // 可以在这里添加重定向到登录页面的逻辑
                localStorage.removeItem('token')
                window.location.href = '/login'
                return Promise.reject(new Error('未授权：您的登录已过期'))
            } else if (response.status === 403) {
                const role = localStorage.getItem('role') || '用户'
                showMessage(`权限不足：您的角色(${role})无权执行此操作`, 'error')
                return Promise.reject(new Error('权限不足：您没有权限执行此操作'))
            }
            
            const error = await response.json().catch(() => {
                // 如果无法解析JSON，检查响应的Content-Type
                const contentType = response.headers.get('Content-Type')
                if (contentType && contentType.includes('text/plain')) {
                    return response.text().then(text => ({
                        message: `服务器返回了纯文本响应: ${text}`
                    }))
                }
                return {message: `HTTP error! status: ${response.status}`}
            })
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
