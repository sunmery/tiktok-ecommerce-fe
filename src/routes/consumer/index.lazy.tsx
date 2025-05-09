import {createLazyFileRoute} from '@tanstack/react-router'
import ConsumerDashboard from "@/features/dashboard/consumer";  // 添加 t 的导入
import { Suspense } from 'react';
import { CircularProgress } from "@mui/joy";

export const Route = createLazyFileRoute('/consumer/')({
    component: ()=>(
        <Suspense fallback={<CircularProgress/>}>
            <ConsumerDashboard/>
        </Suspense>
    )
})
