import {createLazyFileRoute} from '@tanstack/react-router'
import CallbackPage from '@/pages/Callback'

export const Route = createLazyFileRoute('/callback/')({
	component: () => <CallbackPage />,
})
