import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/merchant/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/merchant/categories/"!</div>
}
