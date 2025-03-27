import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/merchant/inventory/')({
    component: () => import('./index.lazy').then(mod => <mod.default/>)
})
