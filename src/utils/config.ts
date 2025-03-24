/**
 * 环境配置文件
 * 从.env文件中读取配置
 */

// 环境类型定义
export type AppEnvironment = 'development' | 'staging' | 'production';

// 环境配置接口
interface EnvironmentConfig {
  apiBaseUrl: string;
  timeout: number;
  debug: boolean;
  enableLogs: boolean;
  casdoorUrl: string;
}

// 获取当前环境
const getCurrentEnvironment = (): AppEnvironment => {
  // 首先尝试读取VITE_APP_ENV，其次根据NODE_ENV判断
  const env = import.meta.env.VITE_APP_ENV || 
             (import.meta.env.DEV ? 'development' : 
             (import.meta.env.PROD ? 'production' : 'development'));
  
  return env as AppEnvironment;
};

// 当前环境
export const currentEnvironment: AppEnvironment = getCurrentEnvironment();

// 构建环境配置
const buildConfig = (): EnvironmentConfig => {
  return {
    apiBaseUrl: import.meta.env.VITE_URL || 'http://localhost:3000',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 
            (currentEnvironment === 'production' ? 2000 : 
            (currentEnvironment === 'staging' ? 1500 : 1000)),
    debug: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
    enableLogs: import.meta.env.VITE_ENABLE_LOGS === 'true' || import.meta.env.DEV,
    casdoorUrl: import.meta.env.VITE_CASDOOR_URL || '',
  };
};

// 导出当前环境配置
export const config = buildConfig();

// API URL配置
export const apiUrls = {
  users: import.meta.env.VITE_USERS_URL || '/v1/users',
  products: import.meta.env.VITE_PRODUCERS_URL || '/v1/products',
  carts: import.meta.env.VITE_CARTS_URL || '/v1/carts',
  orders: import.meta.env.VITE_ORDERS_URL || '/v1/orders',
  checkout: import.meta.env.VITE_CHECKOUT_URL || '/v1/checkout',
  payments: import.meta.env.VITE_PAYMENTS_URL || '/v1/payments',
  categories: import.meta.env.VITE_CATEGORIES_URL || '/v1/categories',
  assistant: import.meta.env.VITE_ASSISTANT_URL || '/v1/assistant',
  merchants: import.meta.env.VITE_MERCHANTS_URL || '/v1/merchants',
  inventory: import.meta.env.VITE_INVENTORY_URL || '/v1/merchants/inventory',
};
