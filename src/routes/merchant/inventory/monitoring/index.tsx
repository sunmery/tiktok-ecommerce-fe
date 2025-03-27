import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/merchant/inventory/monitoring/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/merchant/inventory/monitoring/"!</div>
}
