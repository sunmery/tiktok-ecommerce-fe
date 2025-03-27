import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {userService} from '@/api/userService'
import {
    CardsReply,
    CreditCard,
    DeleteCreditCardRequest,
    GetCreditCardReply,
    ListCreditCardsReply
} from '@/types/creditCards'

/**
 * 获取用户信用卡列表的hook
 */
export function useCreditCards() {
    return useQuery<ListCreditCardsReply>({
        queryKey: ['creditCards'],
        queryFn: () => userService.listCreditCards(),
    })
}

/**
 * 获取特定信用卡的hook
 * @param id 信用卡ID
 * @param userId 用户ID
 */
export function useCreditCard(id: number, userId: string) {
    return useQuery<GetCreditCardReply>({
        queryKey: ['creditCard', id],
        queryFn: () => userService.getCreditCard({id, userId: userId}),
        enabled: !!id && !!userId, // 只有当id和userId都存在时才发起请求
    })
}

/**
 * 创建信用卡的hook
 */
export function useCreateCreditCard() {
    const queryClient = useQueryClient()

    return useMutation<CardsReply, Error, CreditCard>({
        mutationFn: (creditCard) => userService.createCreditCard(creditCard),
        onSuccess: () => {
            // 创建信用卡成功后刷新信用卡列表
            queryClient.invalidateQueries({queryKey: ['creditCards']})
        },
    })
}

/**
 * 更新信用卡的hook
 */
export function useUpdateCreditCard() {
    const queryClient = useQueryClient()

    return useMutation<CardsReply, Error, CreditCard>({
        mutationFn: (card) => userService.updateCreditCard(card),
        onSuccess: (_, card) => {
            // 更新信用卡成功后刷新信用卡列表和详情
            queryClient.invalidateQueries({queryKey: ['creditCards']})
            if (card.id) {
                queryClient.invalidateQueries({queryKey: ['creditCard', card.id]})
            }
        },
    })
}

/**
 * 删除信用卡的hook
 */
export function useDeleteCreditCard() {
    const queryClient = useQueryClient()

    return useMutation<CardsReply, Error, DeleteCreditCardRequest>({
        mutationFn: (request) => userService.deleteCreditCard(request),
        onSuccess: () => {
            // 删除信用卡成功后刷新信用卡列表
            queryClient.invalidateQueries({queryKey: ['creditCards']})
        },
    })
}
