import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/consumer/logistics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/consumer/logistics/"!</div>
}
