import {createLazyFileRoute} from '@tanstack/react-router'

import AdminDashboard from "@/features/dashboard/admin";

export const Route = createLazyFileRoute('/admin/')({
    component: AdminDashboard,
})
