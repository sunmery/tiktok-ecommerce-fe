import {createLazyFileRoute} from '@tanstack/react-router'
import ConsumerAddresses from "@/features/dashboard/consumer/address";

export const Route = createLazyFileRoute('/consumer/addresses/')({
    component: ConsumerAddresses,
})

