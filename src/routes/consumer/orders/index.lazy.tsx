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
import {useQuery} from '@tanstack/react-query'
import { useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {orderService} from '@/api/orderService'
import OrderList from '@/shared/components/OrderList.lazy'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {Order} from "@/types/orders.ts"
import {Clear, FilterList, Search, Refresh} from '@mui/icons-material'
import {useTranslation} from 'react-i18next'
import PaginationBar from "@/components/PaginationBar";
import { usePagination } from '@/hooks/usePagination'

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
    const [isFiltering, setIsFiltering] = useState(false)
    const [displayedOrders, setDisplayedOrders] = useState<Order[]>([])
    const [count, setCount] = useState<number>(0)

    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 20,
    });

    // 查询条件
    const [queryParams, setQueryParams] = useState<OrderQueryParams>({
        userId: account.id,
        page: pagination.page,
        pageSize: pagination.pageSize
    })

    // 过滤条件
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const {
        data: orders,
        isLoading,
        error,
        refetch,
        isFetching
    } = useQuery<Order[], Error>({
        queryKey: ['orders', queryParams],
        queryFn: () => fetchOrders(queryParams),
        staleTime: 5 * 60 * 1000,
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
                // 更新总条目数
                const total = response.orders.length
                pagination.setTotalItems(total)
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
            setDisplayedOrders(orders) // 更新显示的订单列表
            setCount(pagination.totalCount) // 更新总条目数
        }
    }, [orders])

    // 监听分页变化
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            page: pagination.page,
            pageSize: pagination.pageSize
        }))
    }, [pagination.page, pagination.pageSize])

    // 处理查询条件变化
    const handleSearch = () => {
        // 构造查询参数
        const newParams: OrderQueryParams = {
            userId: account.id,
            page: 1,  // 重置为第一页
            pageSize: pagination.pageSize
        }

        if (startDate) newParams.startDate = startDate
        if (endDate) newParams.endDate = endDate
        if (status) newParams.status = parseInt(status, 10)

        // 更新查询参数并触发查询
        // setCurrentPage(1)
        setQueryParams(newParams)
        refetch().then(() => {
            console.log('查询条件更新成功')
        }).catch(e => {
            console.error('查询条件更新失败', e)
        })
    }

    // 清除查询条件
    const handleClearFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('')
        setQueryParams({
            userId: account.id,
            page: 1,
            pageSize: pagination.pageSize
        })
        setIsFiltering(false)
        refetch().then(() => {
            console.log('查询条件已清除')
        }).catch(e => {
            console.error('清除查询条件失败', e)
        })
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

    return (
        <Box sx={{p: 2, maxWidth: '100%', margin: '0 auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs
                pathMap={{
                    'consumer': t('consumer.dashboard.title'),
                    'orders': t('consumer.orders.title')
                }}
            />

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('consumer.orders.title')}</Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <IconButton 
                        variant="outlined"
                        color="primary"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        sx={{
                            animation: isFetching ? 'spin 1s linear infinite' : 'none',
                            '@keyframes spin': {
                                '0%': {
                                    transform: 'rotate(0deg)',
                                },
                                '100%': {
                                    transform: 'rotate(360deg)',
                                },
                            },
                        }}
                    >
                        <Refresh />
                    </IconButton>
                    <Typography level="body-sm">
                        {t('consumer.orders.totalCount', {count: count })}
                    </Typography>
                </Box>
            </Box>

            {/* 过滤器 */}
            {renderFilters()}

            {/* 分页控制 */}
            <PaginationBar
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalCount}
                totalPages={pagination.totalPages}
                onPageChange={pagination.handlePageChange}
                onPageSizeChange={pagination.handlePageSizeChange}
                showPageSizeSelector
                showTotalItems
            />

            {/* 订单列表 */}
            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <Alert color="danger" sx={{mb: 2}}>{error.message}</Alert>
            ) : !displayedOrders || displayedOrders.length === 0 ? (
                <Card variant="outlined">
                    <CardContent>
                        <Typography level="body-lg" textAlign="center">
                            {t('consumer.orders.noOrders')}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <OrderList orders={displayedOrders}/>
            )}
        </Box>
    )
}
