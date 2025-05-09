import {createFileRoute} from '@tanstack/react-router'
import Logistics from "@/features/logistics";

export const Route = createFileRoute('/logistics/')({
    component: Logistics,
})
