import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { CircularProgress } from '@mui/joy'
import Checkout from '@/features/checkout'

export const Route = createLazyFileRoute('/checkout/')({
    component: () => (
        <Suspense fallback={<CircularProgress/>}>
            <Checkout/>
        </Suspense>
    ),
})
