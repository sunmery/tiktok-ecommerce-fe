import {createLazyFileRoute} from '@tanstack/react-router'

import Products from '@/pages/Products'

export const Route = createLazyFileRoute('/products/')({
	component: () => <Products />,
})
