import {createLazyFileRoute} from '@tanstack/react-router'
import CreditCard from '@/features/dashboard/consumer/creditCard'

export const Route = createLazyFileRoute('/consumer/creditCards/')({
  component: () => <CreditCard/>,
})
