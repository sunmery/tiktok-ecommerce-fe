import {createLazyFileRoute} from '@tanstack/react-router'
import InventoryAlerts from "@/features/dashboard/merchant/inventory/alerts";
import { Suspense } from 'react';

export const Route = createLazyFileRoute('/merchant/inventory/alerts/')({
    component: ()=>(
        <Suspense fallback={<div>Loading...</div>}>
            <InventoryAlerts />
        </Suspense>
    ),
})

