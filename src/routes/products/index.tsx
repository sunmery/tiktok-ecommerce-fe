import { createFileRoute } from '@tanstack/react-router'
import Products from "@/features/products";
import { Suspense } from 'react';
import { CircularProgress } from "@mui/joy";

export const Route = createFileRoute('/products/')({
    component: () => (
        <Suspense fallback={<CircularProgress/>}>
            <Products/>
        </Suspense>
    ),
    validateSearch: (search: Record<string, unknown>) => {
        return {
            query: search.query as string || ''
        }
    }
})
