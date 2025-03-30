import {Account} from './account'

// 用户管理相关类型
export interface User extends Account {
    pendingApproval?: boolean
}

// 商家申请相关类型
export interface MerchantApplication {
    id: string
    userId: string
    businessName: string
    businessLicense: string
    contactPhone: string
    applicationDate: string
    status: 'pending' | 'approved' | 'rejected'
}

// 编辑用户表单数据类型
export interface EditUserForm {
    id: string
    name: string
    email: string
    avatar?: string
    owner?: string
    displayName?: string
    signupApplication: string
}

// 新用户表单数据类型
export interface NewUserForm extends EditUserForm {
    password: string
}

// 角色名称映射类型
export interface RoleNames {
    [key: string]: string
}
