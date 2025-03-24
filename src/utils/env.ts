/**
 * 环境变量工具
 * 基于Vite的环境变量系统，读取.env、.env.development和.env.production文件中定义的变量
 */

/**
 * 判断是否为开发环境
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * 判断是否为生产环境
 */
export const isProduction = import.meta.env.PROD;

/**
 * 是否启用调试模式
 */
export const isDebugEnabled = import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV;

/**
 * 是否启用日志输出
 */
export const isLoggingEnabled = import.meta.env.VITE_ENABLE_LOGS === 'true' || import.meta.env.DEV;

/**
 * 日志级别
 */
export const logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';

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
 * 记录错误日志（总是输出）
 * @param message 错误消息
 * @param args 其他参数
 */
export const error = (message: string, ...args: any[]): void => {
  console.error(message, ...args);
};

/**
 * 获取API基础URL
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_URL || '';
};

/**
 * 获取Casdoor URL
 */
export const getCasdoorUrl = (): string => {
  return import.meta.env.VITE_CASDOOR_URL || '';
};

/**
 * 环境变量对象（兼容旧代码）
 * @deprecated 请直接使用导出的函数和变量
 */
export const Environment = {
  isDevelopment,
  isProduction,
  isDebugEnabled,
  isLoggingEnabled,
  log,
  warn,
  error,
  getApiBaseUrl,
  getCasdoorUrl
}; 