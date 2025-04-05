/**
 * 订单服务API
 * 基于proto文件定义实现的订单服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    ListAllOrderReq,
    ListOrderReq,
    ListOrderResp,
    MarkOrderPaidReq,
    MarkOrderPaidResp,
    Order,
    PlaceOrderReq,
    PlaceOrderResp,
} from '@/types/orders';

/**
 * 订单服务API
 */
export const orderService = {
    /**
     * 创建订单
     * POST /v1/orders
     */
    placeOrder: (request: PlaceOrderReq) => {
        return httpClient.post<PlaceOrderResp>(
            `${import.meta.env.VITE_ORDERS_URL}`,
            {
                currency: request.currency,
                address: request.address,
                email: request.email,
                orderItems: request.orderItems.map(item => ({
                    item: item.item,
                    cost: item.cost
                }))
            }
        );
    },

    /**
     * 获取订单详情
     * @param orderId 订单ID
     */
    getOrderDetail: (orderId: string) => {
        const url = httpClient.replacePathParams('/v1/orders/{orderId}', {
            orderId
        })

        return httpClient.get<Order>(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    },

    getConsumerOrder: (request: ListOrderReq) => {
        return httpClient.get<ListOrderResp>(
            `${import.meta.env.VITE_ORDERS_URL}`,
            {
                params: {
                    userId: request.userId,
                    page: request.page?.toString(),
                    pageSize: request.pageSize?.toString()
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },

    /**
     * 查询订单列表（带分页参数）
     * GET /v1/orders
     */
    getOrder: (request: ListOrderReq) => {
        return httpClient.get<ListOrderResp>(
            `${import.meta.env.VITE_MERCHANTS_URL}/orders`,
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
    },

    /**
     * 查询订单列表（带分页参数）
     * GET /v1/orders
     */
    listOrder: (request: ListAllOrderReq) => {
        return httpClient.get<ListOrderResp>(
            `${import.meta.env.VITE_ADMIN_URL}/orders`,
            {
                params: {
                    page: request.page?.toString(),
                    pageSize: request.pageSize?.toString()
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },

    /**
     * 标记订单为已支付
     * POST /v1/orders/{orderId}/paid
     */
    markOrderPaid: (request: MarkOrderPaidReq) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_ORDERS_URL}/{orderId}`,
            {orderId: request.orderId}
        );
        return httpClient.post<MarkOrderPaidResp>(url, {
            orderId: request.orderId
        });
    },

    /**
     * 更新订单状态
     * PUT /v1/orders/{orderId}/status
     */
    updateOrderStatus: (orderId: string, status: any) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_ORDERS_URL}/{orderId}/status`,
            {orderId: orderId}
        );
        return httpClient.put(url, JSON.stringify({
            status: status
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * 商家发货
     * PUT /v1/orders/{orderId}/ship
     */
    shipOrder: (orderId: string) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_ORDERS_URL}/{orderId}/ship`,
            {orderId: orderId}
        );
        return httpClient.put(url, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * 用户确认收货
     * PUT /v1/orders/{orderId}/receive
     */
    confirmReceived: (orderId: string) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_ORDERS_URL}/{orderId}/receive`,
            {orderId: orderId}
        );
        return httpClient.put(url, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },
};
