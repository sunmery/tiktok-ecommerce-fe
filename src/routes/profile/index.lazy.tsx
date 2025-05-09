import { createLazyFileRoute } from '@tanstack/react-router'

import { CircularProgress } from '@mui/joy'
import Profile from '@/features/profile'
import { Suspense } from "react";


export const Route = createLazyFileRoute('/profile/')({
    component: () => () => (
        <Suspense fallback={<CircularProgress/>}>
            <Profile/>
        </Suspense>
    ),
})
