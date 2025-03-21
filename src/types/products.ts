// 商品状态枚举
import {Timestamp} from "@/types/user.ts";

export enum ProductStatus {
  draft = 0,     // 草稿状态
  pending = 1,  // 待审核
  approved = 2, // 审核通过
  rejected = 3  // 审核驳回
}

// 审核动作枚举
export enum AuditAction {
  approve = 0, // 通过审核
  reject = 1   // 驳回审核
}

// 商品分类信息
export interface CategoryInfo {
  categoryId: number;
  categoryName: string;
}

// 商品图片信息
export interface ProductImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

// 商品属性值类型
export type AttributeValue =
    | { stringValue: string }
    | { arrayValue: string[] }
    | { objectValue: Record<string, AttributeValue> }

// 审核信息
export interface AuditInfo {
  auditId: string;
  operatorId: string;
  operatedAt: string;
}

// 商品核心数据结构
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  merchantId: string;
  images: ProductImage[];
  picture: string;
  quantity: number;
  attributes: Record<string, AttributeValue>;
  createdAt: string;
  updatedAt: string;
  auditInfo?: AuditInfo;
  category?: CategoryInfo;
}

// API 请求响应类型
export interface ProductResponse {
  state: string
  msg?: string
  data: Product
}

// 创建商品响应
export interface CreateProductResponse {
  state: string
  msg?: string
  data: {
    id: string
    createdAt: string
    updatedAt: string
  }
}

// 审核记录
export interface AuditRecord {
  id: string
  productId: string
  oldStatus: ProductStatus
  newStatus: ProductStatus
  reason: string
  operatorId: number
  operatedAt: string
}

// 审核记录响应
export interface AuditRecordResponse {
  state: string
  msg?: string
  data: AuditRecord
}

// 创建商品请求参数
export interface CreateProductRequest {
  product: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'auditInfo'>
}

// 更新商品请求参数
export interface UpdateProductRequest {
  id: string
  product: Partial<Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'auditInfo'>>
}

// 提交审核请求参数
export interface SubmitAuditRequest {
  productId: string
  merchantId: string
}

// 审核商品请求参数
export interface AuditProductRequest {
  productId: string
  merchantId: string
  action: AuditAction
  reason?: string
  operatorId: number
}

export interface CreateProductReply {
  id: string;  // 商品唯一ID（系统生成）
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DeleteProductRequest {
  id: string;
  productId?: string; // 兼容新旧接口
  merchantId: string; // 商家 ID, 用于分片路由
}

export interface GetProductRequest {
  id?: string;
  productId?: string; // 兼容新旧接口
  merchantId: string; // 商家 ID, 用于分片路由
}

// 按分类查询商品请求
export interface ListProductsByCategoryRequest {
  categoryName: string;
  page: number;
  pageSize: number;
  status: number;
}

// 随机商品列表请求
export interface ListRandomProductsRequest {
  page: number;
  pageSize: number;
  status: ProductStatus;
}

// 商品列表
export interface Products {
  items: Product[];
}

// 搜索商品请求
export interface SearchProductRequest {
  name: string;
}
