import { UserRole, UserProfile, JwtClaims, AuthErrorType } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

// 路由权限配置
export const routePermissions: Record<string, UserRole[]> = {
    '/': [UserRole.GUEST, UserRole.CONSUMER, UserRole.MERCHANT, UserRole.ADMIN],
    '/profile': [UserRole.CONSUMER, UserRole.MERCHANT, UserRole.ADMIN],
    '/merchant': [UserRole.MERCHANT],
    '/merchant/products': [UserRole.MERCHANT],
    '/merchant/orders': [UserRole.MERCHANT],
    '/merchant/analytics': [UserRole.MERCHANT],
    '/admin': [UserRole.ADMIN],
    '/admin/users': [UserRole.ADMIN],
    '/admin/audit': [UserRole.ADMIN],
};

class AuthService {
    private static instance: AuthService;
    private tokenKey = 'auth_token';
    private profileKey = 'user_profile';

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // 保存 token
    public setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    // 获取 token
    public getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // 保存用户信息
    public setProfile(profile: UserProfile): void {
        // 只保存必要的信息，避免敏感信息
        const safeProfile = {
            displayName: profile.displayName || profile.name,
            avatar: profile.avatar,
            email: profile.email,
        };
        localStorage.setItem(this.profileKey, JSON.stringify(safeProfile));
    }

    // 获取用户角色（从 JWT 中解析）
    public getRole(): UserRole {
        const token = this.getToken();
        if (!token) {
            return UserRole.GUEST;
        }

        try {
            const claims = jwtDecode<JwtClaims>(token);
            // 检查 token 是否过期
            if (claims.exp * 1000 < Date.now()) {
                this.logout();
                return UserRole.GUEST;
            }
            return claims.role;
        } catch (error) {
            console.error('Invalid token:', error);
            this.logout();
            return UserRole.GUEST;
        }
    }

    // 检查路由权限
    public checkRoutePermission(path: string): boolean {
        const userRole = this.getRole();
        const allowedRoles = routePermissions[path] || [UserRole.GUEST];
        return allowedRoles.includes(userRole);
    }

    // 登出
    public logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.profileKey);
        // 可以添加其他清理逻辑
    }

    // 验证 token 有效性
    public async validateToken(): Promise<boolean> {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            // 调用后端验证接口
            const response = await fetch('/api/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Token validation failed:', error);
            return false;
        }
    }

    // 获取角色显示名称
    public getRoleDisplayName(role: UserRole): string {
        const roleNames = {
            [UserRole.GUEST]: '访客',
            [UserRole.CONSUMER]: '消费者',
            [UserRole.MERCHANT]: '商家',
            [UserRole.ADMIN]: '管理员'
        };
        return roleNames[role] || '未知角色';
    }
}

export const authService = AuthService.getInstance(); 