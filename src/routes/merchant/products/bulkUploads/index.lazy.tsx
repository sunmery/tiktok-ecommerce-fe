import ProductBulkUploads from '@/features/dashboard/merchant/products/bulkUploads'
import { CircularProgress } from '@mui/joy'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createLazyFileRoute('/merchant/products/bulkUploads/')({
  component: ()=>(
        <Suspense fallback={<CircularProgress/>}>
        <ProductBulkUploads />
      </Suspense>
  ),
})
