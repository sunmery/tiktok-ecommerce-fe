import {AdminOrderReply, GetAllOrdersReq} from "@/types/orders.ts";
import {httpClient} from "@/utils/http-client.ts";

export const getAllOrders = (request: GetAllOrdersReq) => {
    return httpClient.get<AdminOrderReply>(
        `${import.meta.env.VITE_ADMIN_URL}/orders`,
        {
            params: {
                page: request.page,
                pageSize: request.pageSize
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
}
