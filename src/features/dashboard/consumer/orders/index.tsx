import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio/react";
import { userStore } from "@/store/user.ts";
import { useEffect, useState } from "react";
import { GetConsumerOrdersReq, MergedOrder } from "./type";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "./api";
import { showMessage } from "@/utils/showMessage.ts";
import {
    Alert,
    Box, Button,
    Card,
    CardContent, CircularProgress,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Option,
    Select,
    Stack,
    Typography
} from "@mui/joy";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Clear, FilterList, Refresh, Search } from "@mui/icons-material";
import { PaymentStatus, ShippingStatus } from "@/types/status.ts";
import OrderList from "./components/OrderList.tsx";
import PaginationBar from "@/shared/components/PaginationBar.tsx";
import { cartStore } from "@/store/cartStore.ts";
import { usePagination } from "../../merchant/orders/hooks.ts";

export default function ConsumerOrders() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const [isFiltering, setIsFiltering] = useState(false)
    const [displayedOrders, setDisplayedOrders] = useState<MergedOrder[]>([])
    const [count, setCount] = useState<number>(0)

    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 20,
    });

    // 查询条件
    const [queryParams, setQueryParams] = useState<GetConsumerOrdersReq>({
        userId: account.id,
        page: pagination.page,
        pageSize: pagination.pageSize
    })

    // 过滤条件
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    // 使用React Query获取订单数据
    const {
        data,
        isLoading,
        error,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['consumerOrders', queryParams],
        queryFn: () => orderService.getConsumerOrders(queryParams),
        staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过时
    })

    // 当数据加载完成后，合并订单并更新显示的订单列表
    useEffect(() => {
        if (data && data.orders) {
            // 合并相同orderId的订单
            const mergedOrders = orderService.mergeConsumerOrders(data.orders);
            setDisplayedOrders(mergedOrders);
            setCount(mergedOrders.length);
        }
    }, [data])

    // 当分页参数变化时，更新查询参数
    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            page: pagination.page,
            pageSize: pagination.pageSize
        }))
    }, [pagination.page, pagination.pageSize])

    // 应用过滤条件
    const applyFilters = () => {
        setQueryParams(prev => ({
            ...prev,
            startDate,
            endDate,
            status,
            page: 1 // 重置到第一页
        }))
        pagination.setPage(1)
    }

    // 清除过滤条件
    const clearFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('')
        setQueryParams({
            userId: account.id,
            page: 1,
            pageSize: pagination.pageSize
        })
        pagination.setPage(1)
    }

    // 切换过滤面板
    const toggleFiltering = () => {
        setIsFiltering(!isFiltering)
    }

    // 刷新订单列表
    const handleRefresh = () => {
        refetch().then(() => {
            console.log('订单列表已刷新')
        })
    }

    // 处理支付订单
    const handlePayOrder = (orderId: number) => {
        // 这里可以实现支付逻辑或跳转到支付页面
        console.log('支付订单:', orderId);
        showMessage(t('consumer.orders.paymentInitiated'), 'info');
    };

    // 处理添加到购物车
    const handleAddToCart = (items: any[]) => {
        try {
            items.forEach(item => {
                cartStore.addItem(
                    item.item.productId,
                    item.item.name,
                    item.merchantId,
                    item.item.picture,
                    item.item.quantity
                );
            });
            showMessage(t('consumer.orders.addedToCart'), 'success');
        } catch (error) {
            console.error('添加到购物车失败:', error);
            showMessage(t('consumer.orders.addToCartFailed'), 'error');
        }
    };

    return (
        <Box sx={{p: 2}}>
            <Breadcrumbs
                pathMap={{
                    orders: t('consumer.orders.title'),
                }}
            />

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography level="h2">{t('consumer.orders.title')}</Typography>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={toggleFiltering} variant="outlined">
                        <FilterList/>
                    </IconButton>
                    <IconButton onClick={handleRefresh} variant="outlined" disabled={isFetching}>
                        <Refresh/>
                    </IconButton>
                </Stack>
            </Box>

            {isFiltering && (
                <Card sx={{mb: 3}}>
                    <CardContent>
                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{mb: 2}}>
                            <FormControl sx={{flex: 1}}>
                                <FormLabel>{t('consumer.orders.filter.startDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </FormControl>
                            <FormControl sx={{flex: 1}}>
                                <FormLabel>{t('consumer.orders.filter.endDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </FormControl>
                            <FormControl sx={{flex: 1}}>
                                <FormLabel>{t('consumer.orders.filter.status')}</FormLabel>
                                <Select
                                    value={status}
                                    onChange={(_, value) => setStatus(value as string)}
                                    placeholder={t('consumer.orders.filter.allStatuses')}
                                >
                                    <Option value="">{t('consumer.orders.filter.allStatuses')}</Option>
                                    <Option value={PaymentStatus.NotPaid}>{t('status.notPaid')}</Option>
                                    <Option value={PaymentStatus.Processing}>{t('status.processing')}</Option>
                                    <Option value={PaymentStatus.Paid}>{t('status.paid')}</Option>
                                    <Option
                                        value={ShippingStatus.ShippingPending}>{t('status.pendingShipment')}</Option>
                                    <Option value={ShippingStatus.ShippingShipped}>{t('status.shipped')}</Option>
                                    <Option value={ShippingStatus.ShippingDelivered}>{t('status.delivered')}</Option>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="neutral"
                                startDecorator={<Clear/>}
                                onClick={clearFilters}
                            >
                                {t('consumer.orders.filter.clear')}
                            </Button>
                            <Button
                                variant="solid"
                                color="primary"
                                startDecorator={<Search/>}
                                onClick={applyFilters}
                            >
                                {t('consumer.orders.filter.apply')}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <CircularProgress/>
            ) : error ? (
                <Alert color="danger">{error.message}</Alert>
            ) : displayedOrders.length === 0 ? (
                <Alert color="neutral">{t('consumer.orders.noOrders')}</Alert>
            ) : (
                <>
                    <OrderList
                        orders={displayedOrders}
                        showPaymentButton={true}
                        showLogisticsButton={true}
                        onPayOrder={handlePayOrder}
                        onAddToCart={handleAddToCart}
                    />
                    <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}>
                        <PaginationBar
                            page={pagination.page}
                            pageSize={pagination.pageSize}
                            totalItems={count}
                            // onPageChange={pagination.setPage}
                            onPageSizeChange={pagination.setPageSize} totalPages={0}
                            onPageChange={function (_event: React.SyntheticEvent, _value: number): void {
                                throw new Error('Function not implemented.')
                            }}/>
                    </Box>
                </>
            )}
        </Box>
    )
}
