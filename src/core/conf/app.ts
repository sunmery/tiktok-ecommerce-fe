/**
 * 环境变量工具
 * 基于Vite的环境变量系统，读取.env、.env.development和.env.production文件中定义的变量
 */

/**
 * 判断是否为开发环境
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * 是否启用日志输出
 */
export const isLoggingEnabled = import.meta.env.VITE_ENABLE_LOGS === 'true' || import.meta.env.DEV;

/**
 * 是否显示翻译调试器
 */
export const showTranslationDebugger = import.meta.env.VITE_SHOW_TRANSLATION_DEBUGGER === 'true' || import.meta.env.DEV;

/**
 * 记录信息日志（仅在启用日志时输出）
 * @param message 日志消息
 * @param args 其他参数
 */
export const log = (message: string, ...args: any[]): void => {
    if (isLoggingEnabled) {
        console.log(message, ...args);
    }
};

/**
 * 记录警告日志（仅在启用日志时输出）
 * @param message 警告消息
 * @param args 其他参数
 */
export const warn = (message: string, ...args: any[]): void => {
    if (isLoggingEnabled) {
        console.warn(message, ...args);
    }
};

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
