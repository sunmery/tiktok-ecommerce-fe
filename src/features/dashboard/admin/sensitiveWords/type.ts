/**
 * 敏感词相关类型定义
 */

// 敏感词对象
export interface SensitiveWord {
  id?: number;
  createdBy?: string;
  category: string;
  word: string;
  level: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 获取敏感词列表请求参数
export interface GetSensitiveWordsRequest {
  page: number;
  pageSize: number;
}

// 获取敏感词列表响应
export interface GetSensitiveWordsResponse {
  words: SensitiveWord[];
}

// 设置敏感词请求参数
export interface SetSensitiveWordsRequest {
  sensitiveWords: SensitiveWord[];
}

// 设置敏感词响应
export interface SetSensitiveWordsResponse {
  rows: number;
}

// 删除敏感词响应
export interface DeleteSensitiveWordResponse {
  success: boolean;
}
