/**
 * 商品服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入时间戳类型
import { Timestamp } from './user';

// 商品状态枚举
export enum ProductStatus {
  DRAFT = 0,    // 草稿状态
  PENDING = 1,  // 待审核
  APPROVED = 2, // 审核通过
  REJECTED = 3  // 审核驳回
}

// 审核动作枚举
export enum AuditAction {
  APPROVE = 0, // 通过审核
  REJECT = 1   // 驳回审核
}

// 分类信息
export interface CategoryInfo {
  categoryId: number;
  categoryName: string;
}

// 字符串数组
export interface StringArray {
  items: string[];
}

// 嵌套对象结构
export interface NestedObject {
  fields: Record<string, AttributeValue>;
}

// 商品属性值类型定义
export interface AttributeValue {
  stringValue?: string;      // 字符串类型值
  arrayValue?: StringArray;  // 数组类型值
  objectValue?: NestedObject;// 嵌套对象
  value?: string; // 兼容旧版本
}

// 审核信息
export interface AuditInfo {
  auditorId: string;
  auditTime: Timestamp;
  auditComment: string;
  auditAction: AuditAction;
}

// 新版审核信息
export interface AuditInfo2 {
  auditId: string;
  reason: string;
  operatorId: string;
  operatedAt: Timestamp;
}

// 商品图片
export interface ProductImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
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

// 创建商品请求
export interface CreateProductRequest {
  product: Product;
}

// 创建商品响应
export interface CreateProductReply {
  id: string;  // 商品唯一ID（系统生成）
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 旧版创建商品响应
export interface CreateProductReplyOld {
  product: Product;
}

// 更新商品请求
export interface UpdateProductRequest {
  id: string;
  product: Product;
}

// 提交审核请求
export interface SubmitAuditRequest {
  productId: string;
  merchantId: string; // 商家 ID, 用于分片路由
}

// 审核记录
export interface AuditRecord {
  id: string;
  productId: string;
  oldStatus: ProductStatus;
  newStatus: ProductStatus;
  reason: string;
  operatorId: string;
  operatedAt: Timestamp;
}

// 审核商品请求
export interface AuditProductRequest {
  productId: string;
  merchantId: string; // 用于分片路由
  action: AuditAction;
  reason: string;     // 驳回时必填
  operatorId: number;
}

// 获取商品请求
export interface GetProductRequest {
  id: string;
  merchantId: string; // 商家 ID, 用于分片路由
}

// 搜索商品请求
export interface SearchProductRequest {
  name: string;
}

// 商品列表
export interface Products {
  items: Product[];
}

// 随机商品列表请求
export interface ListRandomProductsRequest {
  page: number;
  pageSize: number;
  status: ProductStatus;
}

// 按分类查询商品请求
export interface ListProductsByCategoryRequest {
  name: string;
}

// 删除商品请求
export interface DeleteProductRequest {
  id: string;
  merchantId: string; // 商家 ID, 用于分片路由
}
