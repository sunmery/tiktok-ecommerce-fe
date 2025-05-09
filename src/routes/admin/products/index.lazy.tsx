import {createLazyFileRoute} from '@tanstack/react-router'
import ProductManagement from "@/features/dashboard/admin/product";

export const Route = createLazyFileRoute('/admin/products/')({
    component: ProductManagement,
})
