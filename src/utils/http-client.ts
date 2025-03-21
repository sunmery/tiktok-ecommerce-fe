/**
 * HTTP客户端
 * 基于原生fetch的HTTP请求封装，支持环境配置
 */

import {config} from './config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
    timeout?: number;
}

class HttpError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.data = data;
    }
}

/**
 * 构建URL，添加查询参数
 */
function buildUrl(url: string, params?: Record<string, string>): string {
    if (!params) return url;

    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
}

/**
 * 替换URL中的路径参数
 * 例如: /users/{id} => /users/123
 */
function replacePathParams(url: string, params: Record<string, string | number>): string {
    let resultUrl = url;
    Object.entries(params).forEach(([key, value]) => {
        resultUrl = resultUrl.replace(`{${key}}`, String(value));
    });
    return resultUrl;
}

/**
 * 创建请求超时Promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new HttpError(`Request timeout after ${timeout}ms`, 408, null));
        }, timeout);
    });
}

/**
 * 发送HTTP请求
 */
async function request<T>(url: string, method: HttpMethod, options: RequestOptions = {}): Promise<T> {
    const {params, timeout = config.timeout, ...fetchOptions} = options;

    // 构建完整URL
    const fullUrl = buildUrl(`${config.apiBaseUrl}${url}`, params);

    // 默认请求头
    const headers = new Headers(fetchOptions.headers);
    // 为所有请求添加Authorization和token头
    headers.set('Content-Type', headers.has('Content-Type') ? headers.get('Content-Type')! : 'application/json');

    // 获取token并确保正确设置Authorization头
    const token = localStorage.getItem('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // 请求配置
    const requestOptions: RequestInit = {
        method,
        headers,
        ...fetchOptions,
    };

    // 如果有请求体且为对象，转换为JSON字符串
    if (requestOptions.body && typeof requestOptions.body === 'object' && !(requestOptions.body instanceof FormData)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }

    try {
        // 带超时的请求
        const response = await Promise.race([
            fetch(fullUrl, requestOptions),
            createTimeoutPromise(timeout)
        ]);

        // 检查响应内容类型
        const contentType = response.headers.get('content-type');
        
        // 解析响应数据
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json().catch(() => null);
        } else {
            // 非JSON响应，获取文本内容
            const text = await response.text();
            console.error('非JSON响应:', text);
            throw new HttpError(
                `Expected JSON response but got ${contentType || 'unknown content type'}`,
                response.status,
                text
            );
        }

        // 检查响应状态
        if (!response.ok) {
            throw new HttpError(
                `Request failed with status ${response.status}`,
                response.status,
                data
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        throw new HttpError(
            error instanceof Error ? error.message : 'Unknown error',
            0,
            null
        );
    }
}

/**
 * HTTP客户端
 */
export const httpClient = {
    /**
     * 发送GET请求
     */
    get<T>(url: string, options?: RequestOptions): Promise<T> {
        return request<T>(url, 'GET', options);
    },

    /**
     * 发送POST请求
     */
    post<T, D extends BodyInit | null | undefined = any>(url: string, data?: D, options?: RequestOptions): Promise<T> {
        return request<T>(url, 'POST', {...options, body: data});
    },

    /**
     * 发送PUT请求
     */
    put<T, D extends BodyInit | null | undefined = any>(url: string, data?: D, options?: RequestOptions): Promise<T> {
        return request<T>(url, 'PUT', {...options, body: data});
    },

    /**
     * 发送DELETE请求
     */
    delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return request<T>(url, 'DELETE', options);
    },

    /**
     * 发送PATCH请求
     */
    patch<T, D extends BodyInit | null | undefined = any>(url: string, data?: D, options?: RequestOptions): Promise<T> {
        return request<T>(url, 'PATCH', {...options, body: data});
    },

    /**
     * 替换URL中的路径参数
     */
    replacePathParams
};
