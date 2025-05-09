import { httpClient } from "@/utils/http-client.ts";
import {
    BalanceReply, CancelFreezeReply, CancelFreezeRequest, ConfirmTransferReply, ConfirmTransferRequest,
    CreateConsumerBalanceReply,
    CreateConsumerBalanceRequest,
    CreateMerchantBalanceReply,
    CreateMerchantBalanceRequest,
    FreezeBalanceReply,
    FreezeBalanceRequest,
    GetBalanceRequest,
    GetMerchantBalanceRequest, GetTransactionsReply, GetTransactionsRequest,
    RechargeBalanceReply,
    RechargeBalanceRequest,
    RechargeMerchantBalanceReply,
    RechargeMerchantBalanceRequest
} from "./type.ts";

export const balancerService = {
    createConsumerBalance(request: CreateConsumerBalanceRequest): Promise<CreateConsumerBalanceReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/consumers/{user_id}/balance`,
            {user_id: request.userId}
        );
        return httpClient.put<CreateConsumerBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    createMerchantBalance(request: CreateMerchantBalanceRequest): Promise<CreateMerchantBalanceReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/merchants/{merchantId}/balance`,
            {merchantId: request.merchantId}
        );
        return httpClient.put<CreateMerchantBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },
    rechargeBalance(request: RechargeBalanceRequest): Promise<RechargeBalanceReply> {
        const url = `${import.meta.env.VITE_BALANCER_URL}/consumers/recharge`
        return httpClient.post<RechargeBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },
    // 商家余额充值
    rechargeMerchantBalance: async (request: RechargeMerchantBalanceRequest): Promise<RechargeMerchantBalanceReply> => {
        const url = `${import.meta.env.VITE_BALANCER_URL}/merchants/recharge`
        return httpClient.post<RechargeBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    getUserBalance(request: GetBalanceRequest): Promise<BalanceReply> {
        const url = `${import.meta.env.VITE_BALANCER_URL}/consumers/balance`;
        return httpClient.get<BalanceReply>(url, {
            params: request
        });
    },

    getMerchantBalance(request: GetMerchantBalanceRequest): Promise<BalanceReply> {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_BALANCER_URL}/merchants/{merchantId}/balance`,{
            merchantId: request.merchantId
        })
        return httpClient.get<BalanceReply>(url, {
            params: request
        });
    },

    freezeBalance(request: FreezeBalanceRequest): Promise<FreezeBalanceReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}consumers/{user_id}/freeze`,
            {user_id: request.userId}
        );
        return httpClient.post<FreezeBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    confirmTransfer(request: ConfirmTransferRequest): Promise<ConfirmTransferReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/freeze/{freeze_id}/confirm`,
            {freeze_id: request.freezeId}
        );
        return httpClient.post<ConfirmTransferReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    cancelFreeze(request: CancelFreezeRequest): Promise<CancelFreezeReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/freeze/{freeze_id}/cancel`,
            {freeze_id: request.freezeId}
        );
        return httpClient.post<CancelFreezeReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },
    getTransactions(request: GetTransactionsRequest): Promise<GetTransactionsReply> {
        return httpClient.get<GetTransactionsReply>(
            `${import.meta.env.VITE_BALANCER_URL}/transactions`, {
                params: {
                    userId: request.userId,
                    currency: request.currency,
                    page: request.page,
                    pageSize: request.pageSize,
                    paymentStatus: request.paymentStatus,
                    userType: request.userType // 添加 userType 参数
                }
            }
        );
    },
};
