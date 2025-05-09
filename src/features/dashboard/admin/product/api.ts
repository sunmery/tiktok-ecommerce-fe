import {AuditProductRequest, AuditRecord, GetProductStatusPending, Products} from "@/features/products/types.ts";
import {httpClient} from "@/utils/http-client.ts";

export const getProductStatusPending = (request: GetProductStatusPending) => {
    return httpClient.get<Products>(`${import.meta.env.VITE_PRODUCERS_URL}`, {
        params: request
    });
}

/**
 * 审核商品
 * POST /v1/products/{productId}/audit
 */
export const auditProduct= (request: AuditProductRequest) => {
    const snakeCaseRequest = {
        productId: request.productId,
        merchantId: request.merchantId,
        action: request.action,
        reason: request.reason,
        operatorId: request.operatorId
    };
    const url = httpClient.replacePathParams(`${import.meta.env.VITE_PRODUCERS_URL}/{product_id}/audit`, {
        product_id: request.productId
    });
    return httpClient.post<AuditRecord>(url, snakeCaseRequest);
}
