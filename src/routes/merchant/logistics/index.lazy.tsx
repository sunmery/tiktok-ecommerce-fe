import { createLazyFileRoute } from '@tanstack/react-router'
import MerchantLogistics from "@/features/dashboard/merchant/logistics";
import { Suspense } from "react";

export const Route = createLazyFileRoute('/merchant/logistics/')({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <MerchantLogistics/>
        </Suspense>
    )
})

