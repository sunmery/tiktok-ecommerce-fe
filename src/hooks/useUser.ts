import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {api} from '@/api/config'
import type {Account} from '@/types/account'
import {setAccount} from '@/store/user'

interface UserResponse {
  state: string
  msg?: string
  data: Account
}

interface UpdateUserRequest {
  name?: string
  email?: string
  avatar?: string
}

// 获取用户信息的hook
export function useUserInfo() {
  return useQuery<UserResponse>({
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const response = await api.get<UserResponse>('/v1/user/info')
      if (response.state === 'ok' && response.data) {
        setAccount(response.data)
      }
      return response
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5分钟内不重新请求
    gcTime: 1000 * 60 * 60, // 1小时后清除缓存
  })
}

// 更新用户信息的hook
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation<UserResponse, Error, UpdateUserRequest>({
    mutationFn: (data) => api.put<UserResponse>('/v1/user/info', data),
    onSuccess: (response) => {
      if (response.state === 'ok' && response.data) {
        setAccount(response.data)
        // 更新缓存
        queryClient.setQueryData(['user', 'info'], response)
      }
    },
  })
}

// 获取用户余额的hook
export function useUserBalance() {
  return useQuery<{state: string; data: {balance: number}}, Error, {state: string; data: {balance: number}}>({  // 修改泛型参数
    queryKey: ['user', 'balance'],
    queryFn: () => api.get<{state: string; data: {balance: number}}>('/v1/user/balance'),
    retry: 1,
    staleTime: 1000 * 60, // 1分钟内不重新请求
    select: (data) => data,  // 直接返回完整的响应数据
  })
}

// 充值余额的hook
export function useRechargeBalance() {
  const queryClient = useQueryClient()

  return useMutation<
    {state: string; data: {balance: number}},
    Error,
    {amount: number}
  >({
    mutationFn: ({amount}) =>
      api.post<{state: string; data: {balance: number}}>('/v1/user/recharge', {amount}),
    onSuccess: () => {
      // 充值成功后刷新余额数据
      queryClient.invalidateQueries({queryKey: ['user', 'balance']})
    },
  })
}