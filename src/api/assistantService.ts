/**
 * 助手服务API
 * 基于proto文件定义实现的助手服务API
 */

import { ProcessRequest, ProcessResponse } from '@/types/assistant';

/**
 * 助手服务API
 */
export const assistantService = {
  /**
   * 处理助手查询
   * GET /api/assistant
   */
  processQuery: (request: ProcessRequest) => {
    const baseUrl = import.meta.env.VITE_URL;
    const assistantUrl = import.meta.env.VITE_ASSISTANT_URL || '/api/assistant';
    const url = `${baseUrl}${assistantUrl}?q=${encodeURIComponent(request.question)}`;

    return fetch(url, {
      method: 'GET'
    })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json() as Promise<ProcessResponse>;
        });
  }
};
