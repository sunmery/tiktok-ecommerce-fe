import {httpClient} from "@/utils/http-client.ts";

export interface CreateConsumerBalanceRequest {
    userId: string;
    currency: string;
    initialBalance: number;
    balanceType: string;
    isDefault: boolean;
    accountDetails: Record<string, any>;
}

export interface CreateConsumerBalanceReply {
    userId: string;
    currency: string;
    available: number;
}

export interface CreateMerchantBalanceRequest {
    merchantId: string;
    currency: string;
    initialBalance: number;
    balanceType: string;
    isDefault: boolean;
    accountDetails: Record<string, any>;
}

export interface RechargeMerchantBalanceRequest {
  merchantId: string
  amount: number
  currency: string
  paymentMethod: string
  paymentAccount: string
  paymentExtra: Record<string, any>
  expectedVersion: number
  idempotencyKey: string
}

export interface RechargeMerchantBalanceReply {
  transactionId: number
  newVersion: number
}

export interface RechargeBalanceRequest {
    userId: string;
    amount: number;
    currency: string;
    externalTransactionId: number;
    paymentMethodType: string;
    paymentAccount: string;
    idempotencyKey: string;
    expectedVersion: number
}
export interface RechargeBalanceReply {
    success: string
    transactionId: number
    newVersion: number
}

export interface CreateMerchantBalanceReply {
    userId: string;
    currency: string;
    available: number;
}

export interface GetBalanceRequest {
    userId?: string
    currency: string;
}

export interface GetMerchantBalanceRequest {
    merchantId: string
    currency: string;
}

export interface BalanceReply {
    available: number;
    frozen: number;
    currency: string;
    version: number;
}

export interface FreezeBalanceRequest {
    userId: string;
    orderId: number;
    amount: number;
    currency: string;
    idempotencyKey: string;
    expectedVersion: number;
}

export interface FreezeBalanceReply {
    freezeId: number;
    newVersion: number;
}

export interface ConfirmTransferRequest {
    freezeId: number;
    paymentAccount: string;
    idempotencyKey: string;
    expectedUserVersion: number;
    expectedMerchantVersion: number;
    merchantId: string;
}

export interface ConfirmTransferReply {
    success: boolean;
    transactionId: number;
    newUserVersion: number;
    newMerchantVersion: number;
}

export interface CancelFreezeRequest {
    freezeId: number;
    reason: string;
    idempotencyKey: string;
    expectedVersion: number;
}

export interface CancelFreezeReply {
    success: boolean;
    newVersion: number;
}

export interface CancelFreezeRequest {
    freezeId: number;
    reason: string;
    idempotencyKey: string;
    expectedVersion: number;
}

export interface GetTransactionsRequest {
    userId: string;
    currency: string;
    page: number;
    userType: string;
    pageSize: number;
    paymentStatus: string;
}

export interface Transactions {
    id: number;
    type: string;
    amount: number;
    currency: string;
    fromUserId: string;
    toMerchantId: string;
    paymentMethodType: string;
    paymentAccount: string;
    paymentExtra: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetTransactionsReply {
    transactions: Transactions[];
}

const balancerService = {
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

export default balancerService;
