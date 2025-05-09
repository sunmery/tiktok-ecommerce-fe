import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import MerchantOrders from "@/features/dashboard/merchant/orders";

export const Route = createLazyFileRoute('/merchant/orders/')({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <MerchantOrders/>
        </Suspense>
    ),
})

