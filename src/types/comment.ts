/**
 * 评论相关类型定义
 */

// 评论对象
export interface Comment {
  id: number;
  productId: string;
  merchantId: string;
  userId: string;
  score: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 获取评论列表请求参数
export interface GetCommentsRequest {
  productId: string;
  merchantId: string;
  page: number;
  pageSize: number;
}

// 获取评论列表响应
export interface GetCommentsResponse {
  comments: Comment[];
  total: number;
}

// 创建评论请求参数
export interface CreateCommentRequest {
  productId: string;
  merchantId: string;
  userId: string;
  score: number;
  content: string;
}

// 创建评论响应
export interface CreateCommentResponse {
  isSensitive: boolean; 
}

// 更新评论请求参数
export interface UpdateCommentRequest {
  commentId: number;
  userId: string;
  score: number;
  content: string;
}

// 更新评论响应
export interface UpdateCommentResponse extends Comment {}

// 删除评论请求参数
export interface DeleteCommentRequest {
  commentId: number;
  userId: string;
}

// 删除评论响应
export interface DeleteCommentResponse {
  success: boolean;
}