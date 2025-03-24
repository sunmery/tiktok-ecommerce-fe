/**
 * 环境配置文件
 */

// 环境类型定义
export type Environment = 'development' | 'staging' | 'production';

// 环境配置接口
interface EnvironmentConfig {
  apiBaseUrl: string;
  timeout: number;
}

// 各环境配置
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    apiBaseUrl: import.meta.env.VITE_URL || 'http://localhost:3000',
    timeout: 1000,
  },
  staging: {
    apiBaseUrl: import.meta.env.VITE_URL || 'https://staging.example.com',
    timeout: 1500,
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_URL || 'https://api.example.com',
    timeout: 2000,
  },
};

// 当前环境
const currentEnvironment: Environment = (import.meta.env.VITE_APP_ENV || 'development') as Environment;

// 导出当前环境配置
export const config = environmentConfigs[currentEnvironment];
