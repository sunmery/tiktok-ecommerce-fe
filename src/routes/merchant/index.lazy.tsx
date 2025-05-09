import { createLazyFileRoute } from '@tanstack/react-router'
import { CircularProgress } from '@mui/joy'
import { Suspense } from 'react'
import MerchantDashboard from '@/features/dashboard/merchant'

export const Route = createLazyFileRoute('/merchant/')({
    component: () => (
        <Suspense fallback={<CircularProgress/>}>
            <MerchantDashboard/>
        </Suspense>
    ),
})

