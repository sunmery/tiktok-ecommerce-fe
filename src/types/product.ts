/**
 * 商品服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */

// 导入时间戳类型
import { Timestamp } from './user';

// API方法名常量定义
export const CreateProduct = "CreateProduct";
export const UpdateProduct = "UpdateProduct";
export const SubmitForAudit = "SubmitForAudit";
export const AuditProduct = "AuditProduct";
export const ListRandomProducts = "ListRandomProducts";
export const GetProduct = "GetProduct";
export const GetMerchantProducts = "GetMerchantProducts";
export const SearchProductsByName = "SearchProductsByName";
export const ListProductsByCategory = "ListProductsByCategory";
export const DeleteProduct = "DeleteProduct";

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
  category_id: number;
  category_name: string;
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
  string_value?: string;      // 字符串类型值
  array_value?: StringArray;  // 数组类型值
  object_value?: NestedObject;// 嵌套对象
  value?: string; // 兼容旧版本
}

// 审核信息
export interface AuditInfo {
  auditor_id: string;
  audit_time: Timestamp;
  audit_comment: string;
  audit_action: AuditAction;
}

// 新版审核信息
export interface AuditInfo2 {
  audit_id: string;
  reason: string;
  operator_id: string;
  operated_at: Timestamp;
}

// 商品图片
export interface ProductImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
}

// 商品核心数据结构
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  merchant_id: string;
  images: ProductImage[];
  picture: string;
  quantity: number;
  attributes: Record<string, AttributeValue>;
  created_at: string;
  updated_at: string;
  audit_info?: AuditInfo;
  category?: CategoryInfo;
}

// 创建商品请求
export interface CreateProductRequest {
  product: Product;
}

// 创建商品响应
export interface CreateProductReply {
  id: string;  // 商品唯一ID（系统生成）
  created_at: Timestamp;
  updated_at: Timestamp;
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
  product_id: string;
  merchant_id: string; // 商家 ID, 用于分片路由
}

// 审核记录
export interface AuditRecord {
  id: string;
  product_id: string;
  old_status: ProductStatus;
  new_status: ProductStatus;
  reason: string;
  operator_id: string;
  operated_at: Timestamp;
}

// 审核商品请求
export interface AuditProductRequest {
  product_id: string;
  merchant_id: string; // 用于分片路由
  action: AuditAction;
  reason: string;     // 驳回时必填
  operator_id: number;
}

// 获取商品请求
export interface GetProductRequest {
  id: string;
  merchant_id: string; // 商家 ID, 用于分片路由
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
  page_size: number;
  status: ProductStatus;
}

// 按分类查询商品请求
export interface ListProductsByCategoryRequest {
  name: string;
}

// 删除商品请求
export interface DeleteProductRequest {
  id: string;
  merchant_id: string; // 商家 ID, 用于分片路由
}
