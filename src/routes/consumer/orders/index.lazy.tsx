import { createLazyFileRoute } from '@tanstack/react-router'
import ConsumerOrders from "@/features/dashboard/consumer/orders";

export const Route = createLazyFileRoute('/consumer/orders/')({
    component: ConsumerOrders,
})
