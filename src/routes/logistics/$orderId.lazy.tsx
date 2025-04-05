import {createLazyFileRoute} from '@tanstack/react-router'

export const Route = createLazyFileRoute('/logistics/$orderId')({
    component: RouteComponent,
})

import {useQuery} from '@tanstack/react-query';
import {orderService} from '@/api/orderService';
import {Order} from '@/types/orders';
import {useParams} from '@tanstack/react-router';
import {t} from 'i18next';

function RouteComponent() {
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
