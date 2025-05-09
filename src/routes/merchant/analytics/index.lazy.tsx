import {createLazyFileRoute} from '@tanstack/react-router'
import MerchantAnalytics from "@/features/dashboard/merchant/analytics";
import { Suspense } from "react";

export const Route = createLazyFileRoute('/merchant/analytics/')({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <MerchantAnalytics />
        </Suspense>
    ),
})

