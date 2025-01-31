import SDK from 'casdoor-js-sdk'
import {CASDOOR_CONF} from '@/conf/casdoor.ts'

// 服务端的URL, 非casdoor的地址
export const serverUrl: string = import.meta.env.VITE_USERS_URL

// 读取配置
export const CASDOOR_SDK = new SDK(CASDOOR_CONF)

// 判断是否登录
export const isLoggedIn = () => {
  const token = localStorage.getItem('token')
  return token !== null && token.length > 0
}

// 设置token
export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

// TODO 跳转到指定链接, 这里写的不好, 结合react router等路由库来跳转
export const goToLink = (link: string) => {
  window.location.href = link
}

// 获取登录接口的URL
export const getSigninUrl = () => {
  return CASDOOR_SDK.getSigninUrl()
}

// 获取用户信息
export const getUserinfo = async () => {
  const res = await fetch(`${serverUrl}/v1/user/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return await res.json()
}

// 获取用户列表
export const getUsers = async () => {
  const res = await fetch(
    `${CASDOOR_CONF.serverUrl}/api/get-users?owner=${CASDOOR_CONF.organizationName}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  )
  return await res.json()
}

// 登出
export const logout = () => {
  localStorage.removeItem('token')
}

// TODO 显示消息 应使用第三方alert库来实现
export const showMessage = (message: string) => {
  console.log(message)
}
