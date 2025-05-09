import {createLazyFileRoute} from '@tanstack/react-router'
import InventoryMonitoring from "@/features/dashboard/merchant/inventory/monitoring";
import { Suspense } from 'react';
export const Route = createLazyFileRoute('/merchant/inventory/monitoring/')({
    component: ()=>(
        <Suspense fallback={<div>Loading...</div>}>
            <InventoryMonitoring />
        </Suspense>
    ),
})

