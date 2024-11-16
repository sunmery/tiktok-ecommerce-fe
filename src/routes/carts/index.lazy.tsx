import {createLazyFileRoute} from '@tanstack/react-router'
import Carts from '@/pages/Carts'
export const Route = createLazyFileRoute('/carts/')({
	component: () => <Carts />,
})
