import { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useSnapshot } from 'valtio/react';
import { userStore } from '@/store/user.ts';
import { userService } from '@/api/userService.ts';

// 定义路由权限映射
const routePermissions: Record<string, string[]> = {
  // 公共路由，所有角色都可以访问
  '/': ['*'],
  '/products': ['*'],
  '/categories': ['*'],
  '/carts': ['*'],
  '/auth/login': ['*'],
  '/auth/logout': ['*'],
  '/新品上市': ['*'],
  '/趋势': ['*'],
  
  // 消费者特定路由
  '/profile': ['consumer', 'merchant', 'admin'],
  '/consumer': ['consumer'],
  '/consumer/addresses': ['consumer'],
  '/consumer/creditCards': ['consumer'],
  '/consumer/favorites': ['consumer'],
  '/consumer/map': ['consumer'],
  '/consumer/orders': ['consumer'],
  '/consumer/transactions': ['consumer'],
  
  // 商家特定路由
  '/merchant': ['merchant'],
  '/merchant/addresses': ['merchant'],
  '/merchant/analytics': ['merchant'],
  '/merchant/inventory': ['merchant'],
  '/merchant/logistics': ['merchant'],
  // '/merchant/orders': ['merchant'],
  '/merchant/products': ['merchant'],
  
  // 管理员特定路由
  '/admin': ['admin'],
  '/admin/products': ['admin'],
  '/admin/analytics': ['admin'],
  '/admin/rechargeBalance': ['admin'],
  '/admin/sensitiveWords': ['admin'],
};

/**
 * 路由守卫组件
 * 用于控制基于用户角色的路由访问权限
 */
export default function RouteGuard() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const user = useSnapshot(userStore);
  
  useEffect(() => {
    const currentPath = routerState.location.pathname;
    const userRole = user.account?.role || 'consumer';
    const isLoggedIn = userService.isLoggedIn() && user.account && user.account.id !== '';
    
    // 检查当前路径是否需要登录
    const requiresAuth = ![
      '/', '/products', '/categories', '/auth/login', '/新品上市', '/趋势'
    ].includes(currentPath);
    
    // 如果需要登录但用户未登录，重定向到登录页面
    if (requiresAuth && !isLoggedIn) {
      navigate({ to: '/auth/login' });
      return;
    }
    
    // 检查用户是否有权限访问当前路径
    const hasPermission = checkRoutePermission(currentPath, userRole);
    
    if (!hasPermission) {
      // 根据用户角色重定向到适当的页面
      if (userRole === 'merchant') {
        navigate({ to: '/merchant' });
      } else if (userRole === 'admin') {
        navigate({ to: '/admin' });
      } else {
        navigate({ to: '/profile' });
      }
    }
  }, [routerState.location.pathname, user.account, navigate]);
  
  return null;
}

/**
 * 检查用户是否有权限访问指定路由
 * @param path 路由路径
 * @param role 用户角色
 * @returns 是否有权限
 */
function checkRoutePermission(path: string, role: string): boolean {
  // 查找最匹配的路由权限
  const matchingRoute = Object.keys(routePermissions)
    .filter(route => path.startsWith(route))
    .sort((a, b) => b.length - a.length)[0]; // 获取最长匹配
  
  if (!matchingRoute) return false;
  
  const allowedRoles = routePermissions[matchingRoute];
  return allowedRoles.includes('*') || allowedRoles.includes(role);
}
