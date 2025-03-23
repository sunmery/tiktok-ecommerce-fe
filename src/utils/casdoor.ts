import SDK from 'casdoor-js-sdk'
import {CASDOOR_CONF} from '@/core/conf/casdoor.ts'

// 服务端的URL, 非casdoor的地址
export const casdoorServer: string = import.meta.env.VITE_CASDOOR_URL
export const userServer: string = import.meta.env.VITE_USERS_URL

// 读取配置
export const CASDOOR_SDK = new SDK(CASDOOR_CONF)

// 判断是否登录
export const isLoggedIn = () => {
    const token = localStorage.getItem('token')
    return token !== null && token.length > 0
}

// 设置token
export const setToken = (token: string) => {
    localStorage.setItem('token', token)
}

// 使用React Router进行导航，避免页面刷新
export const goToLink = (link: string) => {
    // 检查是否在React Router环境中
    if (typeof window !== 'undefined' && window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE) {
        // 使用React Router的导航API
        const router = window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE.router;
        if (router) {
            router.navigate({ to: link, replace: true });
            return;
        }
    }
    
    // 如果不在React Router环境中，则使用传统方式
    window.location.replace(link);
}

// 获取登录接口的URL
export const getSigninUrl = () => {
    return CASDOOR_SDK.getSigninUrl()
}

// 获取用户信息
export const getUserinfo = async () => {
    try {
        const baseUrl = import.meta.env.VITE_URL;
        const usersUrl = import.meta.env.VITE_USERS_URL;
        
        if (!baseUrl || !usersUrl) {
            throw new Error('环境变量VITE_URL或VITE_USERS_URL未配置');
        }
        
        const res = await fetch(`${baseUrl}${usersUrl}/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        
        // 检查响应内容类型
        const contentType = res.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
            return await res.json()
        } else {
            // 非JSON响应，可能是HTML或其他格式
            const text = await res.text()
            console.error('获取用户信息失败：非JSON响应', text)
            throw new Error(`预期JSON响应但获得了${contentType || '未知内容类型'}`)
        }
    } catch (error) {
        console.error('获取用户信息时出错:', error)
        // 返回一个空对象，避免在UI层出现更多错误
        return {}
    }
}

// 获取用户列表
export const getUsers = async () => {
    const res = await fetch(
        `${import.meta.env.VITE_CASDOOR_URL}/api/get-users?owner=${CASDOOR_CONF.organizationName}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        },
    )
    return await res.json()
}

// 登出
export const logout = () => {
    localStorage.removeItem('token')
}

// 使用MUI的Alert组件来实现消息提示
export const showMessage = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    // 由于这是一个工具函数，不在React组件内部，无法直接使用useAlert hook
    // 我们将消息发送到控制台，同时触发一个自定义事件，让AlertProvider可以捕获并显示
    console.log(`${type}: ${message}`)
    
    // 处理错误消息，确保显示友好的错误信息
    let displayMessage = message;
    
    // 如果是网络错误，提供更友好的提示
    if (message.includes('Failed to fetch')) {
        displayMessage = '网络连接失败，请检查您的网络连接';
    }
    
    // 创建一个自定义事件，携带消息内容和类型
    const event = new CustomEvent('show-alert', {
        detail: {
            message: displayMessage,
            type
        }
    })
    
    // 分发事件，让AlertProvider可以捕获
    window.dispatchEvent(event)
}
