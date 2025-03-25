// 用户角色枚举
export enum UserRole {
    GUEST = 'guest',     // 访客
    CONSUMER = 'user',   // 消费者
    MERCHANT = 'merchant', // 商家
    ADMIN = 'admin'      // 管理员
}

// 用户信息接口
export interface UserProfile {
    owner: string;
    name: string;
    avatar: string;
    email: string;
    id: string;
    role: UserRole;
    displayName: string;
    isDeleted: boolean;
    createdTime: string;
    updatedTime: string;
}

// 路由权限配置
export interface RoutePermission {
    path: string;
    roles: UserRole[];
}

// JWT Claims 接口
export interface JwtClaims {
    sub: string;      // 用户ID
    role: UserRole;   // 用户角色
    exp: number;      // 过期时间
    iat: number;      // 签发时间
}

// 权限错误类型
export enum AuthErrorType {
    UNAUTHORIZED = 'UNAUTHORIZED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    FORBIDDEN = 'FORBIDDEN'
} 