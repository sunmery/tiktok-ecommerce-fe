import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {Alert, Box, Card, CardContent, CircularProgress, Typography} from '@mui/joy'
import Pagination from '@/components/Pagination'
import {useQuery} from '@tanstack/react-query'
import {SyntheticEvent, useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {orderService} from '@/api/orderService'
import OrderList from '@/shared/components/OrderList.lazy'
import Breadcrumbs from '@/components/Breadcrumbs'
import {Orders} from "@/types/orders.ts";

export const Route = createLazyFileRoute('/consumer/orders/')({
    component: ConsumerOrders,
})

function ConsumerOrders() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const pageSize = 10

    const {
        data: orders,
        isLoading,
        error
    } = useQuery<Orders, Error>({
        queryKey: ['orders', currentPage],
        queryFn: () => fetchOrders(currentPage),
        keepPreviousData: true
    })

    // 检查用户是否为消费者，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'consumer') {
            navigate({to: '/'}).then(() => {
                console.log('非消费者用户，已重定向到首页')
            })
        }
    }, [account.role, navigate])

    // 获取订单列表
    const fetchOrders = async (currentPage: number) => {
        const response = await orderService.listOrder({
            page: currentPage,
            pageSize: pageSize
        })
        setTotalPages(Math.ceil((response.orders?.length || 0) / pageSize))
        return response.orders || []
    }

    // 初始加载和页码变化时获取订单


    // 处理页码变化
    const handlePageChange = (_event: SyntheticEvent<Element, Event>, value: number) => {
        setCurrentPage(value)
    }

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs
                pathMap={{
                    'consumer': '消费者中心',
                    'orders': '我的订单'
                }}
            />

            <Typography level="h2" sx={{mb: 3}}>我的订单</Typography>

            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <Alert color="danger" sx={{mb: 2}}>{error.message}</Alert>
            ) : orders.length === 0 ? (
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="body-lg" textAlign="center">
                            暂无订单记录
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <OrderList orders={orders}/>

                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}
