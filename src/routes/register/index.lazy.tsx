import {createLazyFileRoute} from '@tanstack/react-router'

import Register from '@/pages/Register'

export const Route = createLazyFileRoute('/register/')({
	component: () => <Register />,
})
