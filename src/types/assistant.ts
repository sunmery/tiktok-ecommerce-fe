/**
 * 助手服务相关类型定义
 */

/**
 * 处理查询的API路径
 */
export const ProcessQuery = 'process';

/**
 * 处理查询请求参数
 */
export interface ProcessRequest {
    /**
     * 用户提问的问题
     */
    question: string;
}

/**
 * 处理查询响应结果
 */
export interface ProcessResponse {
    /**
     * 助手回复的消息
     */
    message: string;
}
