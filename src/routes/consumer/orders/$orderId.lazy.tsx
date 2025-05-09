import {createLazyFileRoute} from '@tanstack/react-router'
import ConsumerOrderDetail from "@/features/dashboard/consumer/orders/orderId";

export const Route = createLazyFileRoute('/consumer/orders/$orderId')({
    component: ConsumerOrderDetail,
})

