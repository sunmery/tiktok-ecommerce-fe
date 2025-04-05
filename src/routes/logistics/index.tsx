import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/logistics/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/logistics/"!</div>
}
