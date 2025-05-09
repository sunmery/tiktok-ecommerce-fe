import {createLazyFileRoute} from '@tanstack/react-router'
import RechargeBalance from '@/features/dashboard/admin/rechargeBalance'

export const Route = createLazyFileRoute('/admin/rechargeBalance/')({
    component: RechargeBalance,
})
