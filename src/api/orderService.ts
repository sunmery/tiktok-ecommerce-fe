/**
 * 订单服务API
 * 基于proto文件定义实现的订单服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    ConsumerOrders,
    GetAllOrdersReq,
    GetConsumerOrdersReq,
    GetMerchantOrdersReply,
    GetMerchantOrdersRequest,
    GetSubOrderShippingReply,
    ListOrderReq,
    ListOrderResp,
    MarkOrderPaidReq,
    MarkOrderPaidResp,
    Order,
    PlaceOrderReq,
    PlaceOrderResp, ShippingStatus,
    updateOrderShippingStatusReq,
} from '@/types/orders';

/**
 * 订单服务API
 */
export const orderService = {
    /**
     * 获取子订单物流状态
     * GET /v1/orders/{subOrderId}/ship/status
     */
    getSubOrderShipping: (subOrderId: string | number) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_ORDERS_URL}/{subOrderId}/ship/status`,
            {subOrderId}
        );
        return httpClient.get<GetSubOrderShippingReply>(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

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

    getConsumerOrder: (request: GetConsumerOrdersReq) => {
        return httpClient.get<ConsumerOrders>(
            `${import.meta.env.VITE_CONSUMERS_URL}/orders`,
            {
                params: {
                    userId: request.userId,
                    page: request.page,
                    pageSize: request.pageSize
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },
    getAllOrders: (request: GetAllOrdersReq) => {
        return httpClient.get<ListOrderResp>(
            `${import.meta.env.VITE_ORDERS_URL}`,
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
     * 更新订单货运状态
     * PATCH /v1/merchants/orders/ship/{sub_order_id}/status
     */
    updateOrderShippingStatus: (request: updateOrderShippingStatusReq) => { // 更新参数类型
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_MERCHANTS_URL}/orders/ship/{subOrderId}/status`,
            {subOrderId: request.subOrderId}
        );
        
        // 创建请求体对象
        const requestBody: any = {
            carrier: request.carrier,
            trackingNumber: request.trackingNumber,
            shippingFee: request.shippingFee,
            shippingAddress: request.shippingAddress,
            shippingStatus: request.shippingStatus,
        };
        
        // 只有当状态为已送达且有送达时间时，才添加 delivery 字段
        if (request.shippingStatus === ShippingStatus.ShippingDelivered && request.delivery) {
            requestBody.delivery = request.delivery;
        }
        
        return httpClient.patch(url, JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // 移除 shipOrder 方法
    // shipOrder: (request: ShipOrderReq) => {
    //     const url = httpClient.replacePathParams(
    //         `${import.meta.env.VITE_MERCHANTS_URL}/orders/ship/{subOrderId}`,
    //         {subOrderId: request.subOrderId}
    //     );
    //     return httpClient.put<ShipOrderResponse>(url, {
    //         trackingNumber: request.trackingNumber,
    //         carrier: request.carrier,
    //         shippingFee: request.shippingFee, // 修正：之前可能是写死的0
    //         shippingAddress: request.shippingAddress
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`
    //         }
    //     });
    // }

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
