import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/api/userService'
import {
  CreditCard,
  CardsReply,
  DeleteCreditCardRequest,
  GetCreditCardReply,
  GetCreditCardRequest,
  ListCreditCardsReply
} from '@/types/user'

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
 * @param number 信用卡号码
 * @param userId 用户ID
 */
export function useCreditCard(number: string, userId: string) {
  return useQuery<GetCreditCardReply>({
    queryKey: ['creditCard', number],
    queryFn: () => userService.getCreditCard({ number, userId: userId }),
    enabled: !!number && !!userId, // 只有当number和userId都存在时才发起请求
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
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
    },
  })
}

/**
 * 更新信用卡的hook
 */
export function useUpdateCreditCard() {
  const queryClient = useQueryClient()

  return useMutation<CardsReply, Error, CreditCard>({
    mutationFn: (creditCard) => userService.updateCreditCard(creditCard),
    onSuccess: () => {
      // 更新信用卡成功后刷新信用卡列表和详情
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
      if (creditCard.number) {
        queryClient.invalidateQueries({ queryKey: ['creditCard', creditCard.number] })
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
      queryClient.invalidateQueries({ queryKey: ['creditCards'] })
    },
  })
}