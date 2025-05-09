import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {consumerAddressService} from './api'
import {Address, DeleteAddressReply, DeleteAddressRequest, GetAddressesReply} from './type'

/**
 * 获取用户地址列表的hook
 */
export function useAddresses() {
    return useQuery<GetAddressesReply>({
        queryKey: ['addresses'],
        queryFn: () => consumerAddressService.getAddresses(),
    })
}

/**
 * 创建用户地址的hook
 */
export function useCreateAddress() {
    const queryClient = useQueryClient()

    return useMutation<Address, Error, Address>({
        mutationFn: (address) => consumerAddressService.createAddress(address),
        onSuccess: () => {
            // 创建地址成功后刷新地址列表
            queryClient.invalidateQueries({queryKey: ['addresses']}).then(() => {
                // 刷新完成后的回调逻辑
                console.log('地址列表刷新完成')
            })
        },
    })
}

/**
 * 更新用户地址的hook
 */
export function useUpdateAddress() {
    const queryClient = useQueryClient()

    return useMutation<Address, Error, Address>({
        mutationFn: (address) => consumerAddressService.updateAddress(address),
        onSuccess: () => {
            // 更新地址成功后刷新地址列表
            queryClient.invalidateQueries({queryKey: ['addresses']}).then(() => {
                // 刷新完成后的回调逻辑
                console.log('地址列表刷新完成')
            })
        },
    })
}

/**
 * 删除用户地址的hook
 */
export function useDeleteAddress() {
    const queryClient = useQueryClient()

    return useMutation<DeleteAddressReply, Error, DeleteAddressRequest>({
        mutationFn: (request) => consumerAddressService.deleteAddress(request),
        onSuccess: () => {
            // 删除地址成功后刷新地址列表
            queryClient.invalidateQueries({queryKey: ['addresses']}).then(() => {
                // 刷新完成后的回调逻辑
                console.log('地址列表刷新完成')
            })
        },
    })
}
