import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import Inventory from "@/features/dashboard/merchant/inventory";

export const Route = createLazyFileRoute('/merchant/inventory/')({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <Inventory/>
        </Suspense>
    )
})

