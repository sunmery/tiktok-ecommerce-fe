import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/features/dashboard/consumer/orders/type.ts";
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";
import { t } from "i18next";

export default function LogisticsOrderId() {
    const {orderId} = useParams({strict: false});

    const {data: orderDetail, isLoading} = useQuery<Order>({
        queryKey: ['orderDetail', orderId],
        queryFn: () => orderService.getOrderDetail(orderId as string),
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000
    });

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {orderDetail && (
                <div>
                    <h2>{t('logistics.orderDetails.title')}：{orderDetail.orderId}</h2>
                    <p>{t('logistics.orderDetails.status')}：{t(`payment.status.${orderDetail.paymentStatus}`)}</p>
                    <p>{t('logistics.orderDetails.createdAt')}：{new Date(orderDetail.createdAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}
