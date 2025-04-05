import {createLazyFileRoute} from '@tanstack/react-router'

export const Route = createLazyFileRoute('/consumer/favorites/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/consumer/favorites/"!</div>
}
