import { httpClient } from "@/utils/http-client.ts";
import {GetMerchantOrdersRequest, GetMerchantOrdersReply } from "@/features/dashboard/merchant/orders/types.ts";

export const merchantOrderService = {
    /**
     * 查询商家订单列表（带分页参数）
     * GET /v1/merchants/orders
     */
    getMerchantOrders: (request: GetMerchantOrdersRequest) => {
        return httpClient.get<GetMerchantOrdersReply>(
            `${import.meta.env.VITE_MERCHANTS_URL}/orders`,
            {
                params: {
                    page: request.page,
                    pageSize: request.pageSize,
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },

}
