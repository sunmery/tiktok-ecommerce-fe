
// 审核动作枚举
import { ProductStatus } from "@/types/status.ts";

export enum AuditAction {
    AUDIT_ACTION_APPROVED = 1, // 通过审核 - 修改为1，与后端一致
    AUDIT_ACTION_REJECT = 2   // 驳回审核 - 修改为2，与后端一致
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
export type AttributeValue = string | string[] | Record<string, any>;

// 审核信息
export interface AuditInfo {
    auditId: string;
    operatorId: string;
    operatedAt: string;
    reason?: string; // 审核意见或驳回原因
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
    inventory: {
        productId: string
        merchantId: string
        stock: number
    }
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
    name: string;
    description: string;
    price: number;
    stock: number;
    images?: ProductImage[];
    attributes?: Record<string, AttributeValue>;
    category?: CategoryInfo;
}

// 更新商品请求参数
export interface UpdateProductRequest {
    id: string
    merchantId: string
    name: string
    description: string
    price: number
    stock: number
    url: string // 图片URL
    status?: ProductStatus
    attributes: Record<string, AttributeValue>
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
    operatorId: string
}

export interface CreateProductReply {
    id: string;  // 商品唯一ID（系统生成）
    createdAt: string;
    updatedAt: string;
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

export interface GetProductStatusPending {
    page: number;
    pageSize: number;
    status: 1;
}

// 按分类ID获取商品请求
export interface GetCategoryProductsRequest {
    categoryId: number;
    page: number;
    pageSize: number;
    status: number;
}

// 商品列表
export interface Products {
    items: Product[];
    total?: number; // 总记录数，用于支持分页
}

// 搜索商品请求
export interface SearchProductRequest {
    name: string;
}
