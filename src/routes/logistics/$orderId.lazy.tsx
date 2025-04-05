import {createLazyFileRoute} from '@tanstack/react-router'

export const Route = createLazyFileRoute('/logistics/$orderId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/logistics/$orderId"!</div>
}
