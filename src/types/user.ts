/**
 * 用户服务相关类型定义
 * 基于proto文件生成的TypeScript类型
 */



export const ListCreditCards = 'credit_cards';
export const CreateCreditCard = 'credit_cards';
export const UpdateCreditCard = 'credit_cards';
export const DeleteCreditCard = 'credit_cards';
export const GetCreditCard = 'credit_cards';

// 空请求类型（对应google.protobuf.Empty）
export interface Empty {
}


// 删除地址响应
export interface DeleteAddressReply {
    message: string;
    id: number;
    code: number;
}

// 删除地址响应（proto定义）
export interface DeleteAddressesReply {
    message: string;
    id: number;
    code: number;
}

// 获取用户个人资料请求
export interface GetProfileRequest {
}

// 用户个人资料
export interface UserProfile {
    owner: string;
    name: string;
    avatar: string;
    email: string;
    id: string;
    role: string;
    displayName: string;
    isDeleted: boolean;
    createdTime?: string;
    updatedTime?: string;
    signupApplication?: string;
}

export interface Users {
    users: UserProfile[]
}

export interface UpdateFavoritesRequest {
    productId: string
    merchantId: string
}
