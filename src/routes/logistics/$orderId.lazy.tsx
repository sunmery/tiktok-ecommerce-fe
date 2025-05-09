import {createLazyFileRoute} from '@tanstack/react-router'
import LogisticsOrderId from "@/features/logistics/orderId";

export const Route = createLazyFileRoute('/logistics/$orderId')({
    component: LogisticsOrderId,
})
