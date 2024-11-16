import {createLazyFileRoute} from '@tanstack/react-router'

export const Route = createLazyFileRoute('/logout/')({
	component: () => <div>Hello /logout/!</div>,
})
