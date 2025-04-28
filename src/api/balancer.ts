import {httpClient} from "@/utils/http-client.ts";

export interface CreateConsumerBalanceRequest {
    userId: string;
    currency: string;
    initialBalance: number;
    balancerType: string;
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
    balancerType: string;
    isDefault: boolean;
    accountDetails: Record<string, any>;
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
            `${import.meta.env.VITE_BALANCER_URL}/consumer/{user_id}/balance`,
            {user_id: request.userId}
        );
        return httpClient.post<CreateConsumerBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    createMerchantBalance(request: CreateMerchantBalanceRequest): Promise<CreateMerchantBalanceReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/merchant/{merchant_id}/balance`,
            {merchant_id: request.merchantId}
        );
        return httpClient.post<CreateMerchantBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },
    rechargeBalance(request: RechargeBalanceRequest): Promise<RechargeBalanceReply> {
        const url = `${import.meta.env.VITE_BALANCER_URL}/users/recharge`
        return httpClient.post<RechargeBalanceReply>(url,
            JSON.stringify({
                ...request
            })
        );
    },

    getUserBalance(request: GetBalanceRequest): Promise<BalanceReply> {
        const url = `${import.meta.env.VITE_BALANCER_URL}/users/balancer`;
        return httpClient.get<BalanceReply>(url, {
            params: request
        });
    },

    getMerchantBalance(request: GetBalanceRequest): Promise<BalanceReply> {
        const url = `${import.meta.env.VITE_BALANCER_URL}/merchant/balance`;
        return httpClient.get<BalanceReply>(url, {
            params: request
        });
    },

    freezeBalance(request: FreezeBalanceRequest): Promise<FreezeBalanceReply> {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_BALANCER_URL}/user/{user_id}/freeze`,
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
                    paymentStatus: request.paymentStatus
                }
            }
        );
    },
};

export default balancerService;
