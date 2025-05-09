import { createLazyFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import MerchantAddresses from "@/features/dashboard/merchant/addresses";

export const Route = createLazyFileRoute('/merchant/addresses/')({  
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <MerchantAddresses />
    </Suspense>
  ),
});
