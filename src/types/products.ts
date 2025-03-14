// 商品状态枚举
export enum ProductStatus {
  DRAFT = 0,     // 草稿状态
  PENDING = 1,  // 待审核
  APPROVED = 2, // 审核通过
  REJECTED = 3  // 审核驳回
}

// 审核动作枚举
export enum AuditAction {
  APPROVE = 0, // 通过审核
  REJECT = 1   // 驳回审核
}

// 商品分类信息
export interface CategoryInfo {
  category_id: number;
  category_name: string;
}

// 商品图片信息
export interface ProductImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
}

// 商品属性值类型
export type AttributeValue =
    | { string_value: string }
    | { array_value: string[] }
    | { object_value: Record<string, AttributeValue> }

// 审核信息
export interface AuditInfo {
  audit_id: string;
  operator_id: string;
  operated_at: string;
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
    created_at: string
    updated_at: string
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
  product_id: string
  merchant_id: string
  action: AuditAction
  reason?: string
  operator_id: number
}