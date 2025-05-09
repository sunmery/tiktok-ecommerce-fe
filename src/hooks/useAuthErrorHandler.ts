import {useCallback, useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {showMessage} from '@/utils/showMessage';

/**
 * 权限错误处理Hook
 * 用于处理API请求中的401和403错误，提供友好的错误提示
 */
export const useAuthErrorHandler = (redirectPath = '/') => {
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    // 处理API错误
    const handleApiError = useCallback((error: any) => {
        setError(error);

        const errorMessage = error?.message || '';

        // 处理未授权错误 (401)
        if (errorMessage.includes('未授权') || errorMessage.includes('登录已过期')) {
            showMessage('您的登录已过期，请重新登录', 'error');
            // 清除token
            localStorage.removeItem('token');
            // 重定向到登录页
            navigate({to: '/auth/login'});
            return;
        }

        // 处理权限不足错误 (403)
        if (errorMessage.includes('权限不足') || errorMessage.includes('没有权限')) {
            const role = localStorage.getItem('role') || '用户';
            showMessage(`权限不足：您的角色(${role})无权执行此操作`, 'error');
            // 重定向到指定路径
            if (redirectPath) {
                navigate({to: redirectPath});
            }
            return;
        }

        // 处理其他错误
        if (errorMessage) {
            showMessage(`操作失败: ${errorMessage}`, 'error');
        }
    }, [navigate, redirectPath]);

    // 重置错误状态
    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        error,
        handleApiError,
        resetError
    };
};
