import {createLazyFileRoute} from '@tanstack/react-router'
import Logout from '@/features/auth/logout'

export const Route = createLazyFileRoute('/auth/logout/')({
    component: () => <Logout/>,
})
