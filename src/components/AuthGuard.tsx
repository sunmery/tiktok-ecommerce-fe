import React, {useEffect} from 'react';
import {useLocation, useNavigate} from '@tanstack/react-router';
import {authService} from '@/utils/auth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({children}) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            // 检查路由权限
            const hasPermission = authService.checkRoutePermission(location.pathname);
            if (!hasPermission) {
                // 如果没有权限，重定向到首页
                navigate({to: '/'});
                return;
            }

            // 如果不是访客，验证 token 有效性
            if (authService.getRole() !== 'guest') {
                const isValid = await authService.validateToken();
                if (!isValid) {
                    // token 无效，登出并重定向到首页
                    authService.logout();
                    navigate({to: '/'});
                }
            }
        };

        checkAuth();
    }, [location.pathname, navigate]);

    return children;
};
