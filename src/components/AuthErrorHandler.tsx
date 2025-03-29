import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { showMessage } from '@/utils/casdoor';

interface AuthErrorHandlerProps {
  error: Error | null;
  resetError: () => void;
  redirectPath?: string;
}

/**
 * 权限错误处理组件
 * 用于处理401和403错误，显示友好的错误提示并根据需要重定向
 */
const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ 
  error, 
  resetError, 
  redirectPath = '/' 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    const errorMessage = error.message || '';
    
    // 处理未授权错误 (401)
    if (errorMessage.includes('未授权') || errorMessage.includes('登录已过期')) {
      showMessage('您的登录已过期，请重新登录', 'error');
      // 清除token
      localStorage.removeItem('token');
      // 重定向到登录页
      navigate({ to: '/login' });
      resetError();
      return;
    }
    
    // 处理权限不足错误 (403)
    if (errorMessage.includes('权限不足') || errorMessage.includes('没有权限')) {
      const role = localStorage.getItem('role') || '用户';
      showMessage(`权限不足：您的角色(${role})无权执行此操作`, 'error');
      // 重定向到指定路径
      if (redirectPath) {
        navigate({ to: redirectPath });
      }
      resetError();
      return;
    }
    
    // 处理其他错误
    if (errorMessage) {
      showMessage(`操作失败: ${errorMessage}`, 'error');
      resetError();
    }
  }, [error, navigate, redirectPath, resetError]);

  // 这个组件不渲染任何UI
  return null;
};

export default AuthErrorHandler;