import { createFileRoute } from '@tanstack/react-router'
import Balance from "@/features/consumer/balancer";

export const Route = createFileRoute('/consumer/balance/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Balance/>
}
