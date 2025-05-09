export type OperationMode = 'recharge' | 'initialize';

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
