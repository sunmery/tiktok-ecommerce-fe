import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from "react";
import MerchantProducts from "@/features/dashboard/merchant/products";

export const Route = createLazyFileRoute('/merchant/products/')({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <MerchantProducts/>
        </Suspense>
    ),
})
