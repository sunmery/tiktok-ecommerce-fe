import {createLazyFileRoute} from '@tanstack/react-router'
import Analytics from "@/features/dashboard/admin/Analytics";

export const Route = createLazyFileRoute('/admin/analytics/')({
    component: Analytics,
})

