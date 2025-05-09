import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense, } from 'react'
import { CircularProgress, } from '@mui/joy'
import MerchantTransactions from '@/features/dashboard/merchant/orders/transactions'

export const Route = createLazyFileRoute('/merchant/orders/transactions/')({
    component: () => (
        <Suspense fallback={<CircularProgress/>}>
            <MerchantTransactions/>
        </Suspense>
    )
})
