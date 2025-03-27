import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
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
