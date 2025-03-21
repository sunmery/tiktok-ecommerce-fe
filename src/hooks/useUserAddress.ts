import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/api/userService'
import { Address, DeleteAddressRequest } from '@/types/addresses'
import { DeleteAddressReply, GetAddressesReply } from '@/types/user'

/**
 * 获取用户地址列表的hook
 */
export function useAddresses() {
  return useQuery<GetAddressesReply>({
    queryKey: ['addresses'],
    queryFn: () => userService.getAddresses(),
  })
}

/**
 * 创建用户地址的hook
 */
export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation<Address, Error, Address>({
    mutationFn: (address) => userService.createAddress(address),
    onSuccess: () => {
      // 创建地址成功后刷新地址列表
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * 更新用户地址的hook
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation<Address, Error, Address>({
    mutationFn: (address) => userService.updateAddress(address),
    onSuccess: () => {
      // 更新地址成功后刷新地址列表
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * 删除用户地址的hook
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation<DeleteAddressReply, Error, DeleteAddressRequest>({
    mutationFn: (request) => userService.deleteAddress(request),
    onSuccess: () => {
      // 删除地址成功后刷新地址列表
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}