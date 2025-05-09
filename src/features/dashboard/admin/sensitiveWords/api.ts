/**
 * 敏感词管理API
 * 提供敏感词相关的API接口
 */

import { httpClient } from '@/utils/http-client';
import {
  GetSensitiveWordsRequest,
  GetSensitiveWordsResponse,
  SetSensitiveWordsRequest,
  SetSensitiveWordsResponse
} from './type';

/**
 * 敏感词管理API
 */
export const sensitiveWordService = {
  /**
   * 获取敏感词列表
   * GET /v1/admin/comments/sensitive-words
   */
  getSensitiveWords: (request: GetSensitiveWordsRequest) => {
    return httpClient.get<GetSensitiveWordsResponse>(
      `${import.meta.env.VITE_ADMIN_URL}/comments/sensitive-words`,
      {
        params: {
          page: request.page,
          pageSize: request.pageSize
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  },

  /**
   * 设置敏感词
   * PUT /v1/admin/comments/sensitive-words
   */
  setSensitiveWords: (request: SetSensitiveWordsRequest) => {
    return httpClient.put<SetSensitiveWordsResponse>(
      `${import.meta.env.VITE_ADMIN_URL}/comments/sensitive-words`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
};
