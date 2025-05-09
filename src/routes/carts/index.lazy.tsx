import {createLazyFileRoute} from '@tanstack/react-router'
import Cart from '@/features/cart'

export const Route = createLazyFileRoute('/carts/')({component: () => <Cart/>})
