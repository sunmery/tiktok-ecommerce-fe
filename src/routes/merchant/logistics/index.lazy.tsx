import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/merchant/logistics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/merchant/logistics/"!</div>
}
