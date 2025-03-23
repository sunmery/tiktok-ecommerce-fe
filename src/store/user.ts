import {proxy, subscribe} from 'valtio'

import type {Account} from '@/types/account.ts'

// 定义购物车状态
export interface UserState {
    account: Account
}

// 恢复本地存储的数据
const savedUser = localStorage.getItem('user')
const initialUser: Account = savedUser
    ? JSON.parse(savedUser)
    : {
        owner: "",
        name: "",
        avatar: "",
        email: "",
        id: "",
        role: "",
        isDeleted: false,
        createdTime: "",
        updatedTime: "",
    }

export const userStore = proxy<UserState>({
    account: initialUser,
})

export const setAccount = (account: Partial<Account>) => {
    // 使用 Object.assign 或扩展运算符来合并新数据
    userStore.account = {...userStore.account, ...account}
}

// 订阅状态变化，将数据存储到 localStorage
subscribe(userStore, () => {
    localStorage.setItem('user', JSON.stringify(userStore.account))
})
