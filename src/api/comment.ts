/**
 * 评论服务API
 * 提供评论相关的API接口
 */

import { httpClient } from '@/utils/http-client';
import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  UpdateCommentRequest,
  DeleteCommentRequest,
  DeleteCommentResponse,
  Comment
} from '@/types/comment';

/**
 * 评论服务API
 */
export const commentService = {
  /**
   * 获取评论列表
   * GET /v1/comments
   */
  getComments: (request: GetCommentsRequest) => {
    return httpClient.get<GetCommentsResponse>(
      `${import.meta.env.VITE_COMMENT_URL}`,
      {
        params: {
          productId: request.productId,
          merchantId: request.merchantId,
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
   * 创建评论
   * POST /v1/comments
   */
  createComment: (request: CreateCommentRequest) => {
    return httpClient.post<CreateCommentResponse>(
      `${import.meta.env.VITE_COMMENT_URL}`,
      {
        productId: request.productId,
        merchantId: request.merchantId,
        userId: request.userId,
        score: request.score,
        content: request.content
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  },
  
  /**
   * 更新评论
   * PUT /v1/comments/{comment_id}
   */
  updateComment: (request: UpdateCommentRequest) => {
    return httpClient.put<Comment>(
      `${import.meta.env.VITE_COMMENT_URL}/${request.commentId}`,
      {
        userId: request.userId,
        score: request.score,
        content: request.content
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  },
  
  /**
   * 删除评论
   * DELETE /v1/comments/{comment_id}
   */
  deleteComment: (request: DeleteCommentRequest) => {
    return httpClient.delete<DeleteCommentResponse>(
      `${import.meta.env.VITE_COMMENT_URL}/${request.commentId}`,
      {
        params: {
          userId: request.userId
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
};
