import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Option,
    Select,
    Stack,
    Typography
} from '@mui/joy'
import Pagination from '@/components/Pagination'
import {useQuery} from '@tanstack/react-query'
import {SyntheticEvent, useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {orderService} from '@/api/orderService'
import OrderList from '@/shared/components/OrderList.lazy'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {Order} from "@/types/orders.ts"
import {Clear, FilterList, Search} from '@mui/icons-material'
import {useTranslation} from 'react-i18next'

export const Route = createLazyFileRoute('/consumer/orders/')({
    component: ConsumerOrders,
})

// 支付状态枚举
const PAYMENT_STATUS = {
    NOT_PAID: 0,
    PROCESSING: 1,
    PAID: 2,
    FAILED: 3,
    CANCELLED: 4
}

// 订单查询参数类型
interface OrderQueryParams {
    userId: string
    page: number
    pageSize: number
    startDate?: string
    endDate?: string
    status?: number
    orderBy?: string
}

function ConsumerOrders() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const pageSize = 10
    const [isFiltering, setIsFiltering] = useState(false)
    const [displayedOrders, setDisplayedOrders] = useState<Order[]>([])

    // 查询条件
    const [queryParams, setQueryParams] = useState<OrderQueryParams>({
        userId: account.id,
        page: currentPage,
        pageSize: pageSize
    })

    // 过滤条件
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const {
        data: orders,
        isLoading,
        error,
        refetch
    } = useQuery<Order[], Error>({
        queryKey: ['orders', queryParams],
        queryFn: () => fetchOrders(queryParams),
        staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过时
        enabled: !!account.id
    })

    // 未登录重定向到登录页
    useEffect(() => {
        if (!account) {
            navigate({
                to: '/login',
            }).then(() => {
                console.log('未登录用户，已重定向到登录页')
            }).catch(e => {
                console.error('重定向到登录页失败', e)
            })
        }
    }, [account, navigate])

    // 获取订单列表
    const fetchOrders = async (params: OrderQueryParams) => {
        try {
            console.log('查询订单参数:', params)
            const response = await orderService.getConsumerOrder(params)

            // 设置分页信息
            if (response.orders) {
                setTotalOrders(response.orders.length)
                setTotalPages(Math.ceil(response.orders.length / pageSize))
                return response.orders || []
            }

            return []
        } catch (error) {
            console.error('获取订单失败:', error)
            return []
        }
    }

    // 当获取到订单数据时，更新显示的订单
    useEffect(() => {
        if (orders) {
            setDisplayedOrders(orders)
        }
    }, [orders])

    // 处理页码变化
    const handlePageChange = (_event: SyntheticEvent<Element, Event>, value: number) => {
        setCurrentPage(value)
        setQueryParams(prev => ({
            ...prev,
            page: value
        }))
    }

    // 处理查询条件变化
    const handleSearch = () => {
        // 构造查询参数
        const newParams: OrderQueryParams = {
            userId: account.id,
            page: 1,  // 重置为第一页
            pageSize: pageSize
        }

        if (startDate) newParams.startDate = startDate
        if (endDate) newParams.endDate = endDate
        if (status) newParams.status = parseInt(status, 10)

        // 更新查询参数并触发查询
        setCurrentPage(1)
        setQueryParams(newParams)
        refetch()
    }

    // 清除查询条件
    const handleClearFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('')
        setQueryParams({
            userId: account.id,
            page: 1,
            pageSize: pageSize
        })
        setIsFiltering(false)
        refetch()
    }

    // 渲染过滤器部分
    const renderFilters = () => {
        return (
            <Card variant="outlined" sx={{mb: 3, p: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Typography level="title-lg">{t('consumer.orders.filter')}</Typography>
                    <IconButton onClick={() => setIsFiltering(!isFiltering)}>
                        <FilterList/>
                    </IconButton>
                </Box>

                {isFiltering && (
                    <Stack spacing={2}>
                        <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                            <FormControl sx={{minWidth: 150}}>
                                <FormLabel>{t('consumer.orders.filter.startDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </FormControl>

                            <FormControl sx={{minWidth: 150}}>
                                <FormLabel>{t('consumer.orders.filter.endDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </FormControl>

                            <FormControl sx={{minWidth: 150}}>
                                <FormLabel>{t('consumer.orders.filter.paymentStatus')}</FormLabel>
                                <Select
                                    value={status}
                                    onChange={(_, value) => setStatus(value as string)}
                                    placeholder={t('consumer.orders.filter.selectStatus')}
                                >
                                    <Option value="">{t('consumer.orders.filter.all')}</Option>
                                    <Option
                                        value={String(PAYMENT_STATUS.NOT_PAID)}>{t('consumer.orders.status.notPaid')}</Option>
                                    <Option
                                        value={String(PAYMENT_STATUS.PROCESSING)}>{t('consumer.orders.status.processing')}</Option>
                                    <Option
                                        value={String(PAYMENT_STATUS.PAID)}>{t('consumer.orders.status.paid')}</Option>
                                    <Option
                                        value={String(PAYMENT_STATUS.FAILED)}>{t('consumer.orders.status.failed')}</Option>
                                    <Option
                                        value={String(PAYMENT_STATUS.CANCELLED)}>{t('consumer.orders.status.cancelled')}</Option>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{display: 'flex', gap: 2}}>
                            <Button
                                startDecorator={<Search/>}
                                onClick={handleSearch}
                            >
                                {t('consumer.orders.filter.search')}
                            </Button>
                            <Button
                                variant="soft"
                                color="neutral"
                                startDecorator={<Clear/>}
                                onClick={handleClearFilters}
                            >
                                {t('consumer.orders.filter.clear')}
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Card>
        )
    }

    // 渲染订单列表
    const renderOrderList = () => {
        if (isLoading) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress/>
                </Box>
            )
        }

        if (error) {
            return <Alert color="danger" sx={{mb: 2}}>{error.message}</Alert>
        }

        if (!displayedOrders || displayedOrders.length === 0) {
            return (
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="body-lg" textAlign="center">
                            {t('consumer.orders.noOrders')}
                        </Typography>
                    </CardContent>
                </Card>
            )
        }

        return (
            <>
                <OrderList orders={displayedOrders}/>

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
        )
    }

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs
                pathMap={{
                    'consumer': t('consumer.dashboard.title'),
                    'orders': t('consumer.orders.title')
                }}
            />

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('consumer.orders.title')}</Typography>
                <Typography level="body-sm">{t('consumer.orders.totalCount', {count: totalOrders})}</Typography>
            </Box>

            {/* 过滤器 */}
            {renderFilters()}

            {/* 订单列表 */}
            {renderOrderList()}
        </Box>
    )
}
