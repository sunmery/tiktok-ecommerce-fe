/**
 * 订单服务API
 * 基于proto文件定义实现的订单服务API
 */

import {httpClient} from '@/utils/http-client';
import {
    ConsumerOrder,
    ConsumerOrders,
    GetConsumerOrdersReq,
    GetSubOrderShippingReply,
    ListOrderReq,
    ListOrderResp, MarkOrderPaidReq, MarkOrderPaidResp, MergedOrder, Order,
    PlaceOrderReq,
    PlaceOrderResp,
    updateOrderShippingStatusReq,
} from './type';

import { ShippingStatus, } from '@/types/status';

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
            `${import.meta.env.VITE_CONSUMERS_URL}/orders/{subOrderId}/ship/status`,
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
     * @param subOrderId 子订单ID
     */
    getOrderDetail: (subOrderId: string) => {
        const url = httpClient.replacePathParams(`${import.meta.env.VITE_CONSUMERS_URL}/orders/{subOrderId}`, {
            subOrderId
        })

        return httpClient.get<Order>(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    },

    /**
     * 获取消费者订单列表
     * GET /v1/consumers/orders
     */
    getConsumerOrders: (request: GetConsumerOrdersReq) => {
        return httpClient.get<ConsumerOrders>(
            `${import.meta.env.VITE_CONSUMERS_URL}/orders`,
            {
                params: {
                    page: request.page,
                    pageSize: request.pageSize,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    },

    /**
     * 合并相同orderId的订单
     * @param orders 原始订单列表
     * @returns 合并后的订单列表
     */
    mergeConsumerOrders: (orders: ConsumerOrder[]): MergedOrder[] => {
        if (!orders || orders.length === 0) return [];

        // 使用Map按orderId分组
        const orderMap = new Map<number, MergedOrder>();

        orders.forEach(order => {
            const orderId = order.orderId;

            if (orderMap.has(orderId)) {
                // 已存在相同orderId的订单，合并items
                const existingOrder = orderMap.get(orderId)!;

                // 合并商品项
                existingOrder.items = [...existingOrder.items, ...order.items];

                // 添加子订单
                existingOrder.subOrders.push(order);

                // 更新总金额
                existingOrder.totalAmount += order.items.reduce((total, item) => {
                    return total + (item.cost * item.item.quantity);
                }, 0);

            } else {
                // 新的orderId，创建合并订单
                const totalAmount = order.items.reduce((total, item) => {
                    return total + (item.cost * item.item.quantity);
                }, 0);

                orderMap.set(orderId, <MergedOrder>{
                    orderId: orderId,
                    items: [...order.items],
                    userId: order.userId || '',
                    currency: order.currency,
                    address: order.address,
                    email: order.email,
                    createdAt: order.createdAt,
                    paymentStatus: order.paymentStatus,
                    shippingStatus: order.shippingStatus,
                    totalAmount: totalAmount,
                    subOrders: [order]
                });
            }
        });

        // 将Map转换回数组
        return Array.from(orderMap.values());
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
    // updateOrderShippingStatus: (subOrderId: number, shippingStatus: ShippingStatus, request: updateOrderShippingStatusReq) => { // 更新参数类型
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

    /**
     * 用户确认收货
     * PUT /v1/orders/{orderId}/receive
     */
    confirmReceived: (orderId: string) => {
        const url = httpClient.replacePathParams(
            `${import.meta.env.VITE_CONSUMERS_URL}/orders/{orderId}/receive`,
            {orderId: orderId}
        );
        return httpClient.patch(url, null, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },
};
