import {createLazyFileRoute, useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography} from '@mui/joy'
import {useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {ConsumerOrder} from '@/types/orders'
import {formatCurrency} from '@/utils/format'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import Skeleton from '@/components/Skeleton'
import {orderService} from '@/api/orderService'
import {useTranslation} from 'react-i18next'
import {getStatusColor, getStatusText, shippingStatus} from "@/utils/status.ts";
import {showMessage} from "@/utils/showMessage";

export const Route = createLazyFileRoute('/consumer/orders/$orderId')({
    component: ConsumerOrderDetail,
})

function ConsumerOrderDetail() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const {orderId} = useParams({from: '/consumer/orders/$orderId'})
    const [order, setOrder] = useState<ConsumerOrder | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')


    // 检查用户是否为消费者，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'consumer') {
            navigate({to: '/'}).then(() => {
                console.log('非消费者用户，已重定向到首页')
            })
        }
    }, [account.role, navigate])

    // 获取订单详情
    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) return

            setLoading(true)
            setError('')
            try {
                // 调用API获取订单列表
                const response = await orderService.getConsumerOrder({
                    page: 1,
                    pageSize: 50,
                    userId: account.id
                })

                // 查找指定ID的订单
                if (response && response.items) {
                    // 找到所有具有相同orderId的子订单
                    const foundOrders = response.items.filter(o => o.orderId === orderId)
                    if (foundOrders.length > 0) {
                        // 合并所有子订单的信息
                        const mergedOrder = {
                            ...foundOrders[0], // 使用第一个订单的基本信息
                            items: foundOrders.flatMap(order => order.items.map(item => ({
                                ...item,
                                subOrderId: order.subOrderId, // 将子订单ID添加到每个商品项
                                shippingStatus: order.shippingStatus // 将配送状态添加到每个商品项
                            })))
                        }
                        setOrder(mergedOrder)
                    } else {
                        setError('未找到订单信息')
                        // 改为：
                        setError(t('consumer.order.notFound'))
                        
                        // 以及
                        setError('获取订单信息失败')
                        // 改为：
                        setError(t('consumer.order.fetchFailed'))
                        
                        console.error('获取订单详情失败:', err)
                        setError('获取订单详情失败，请稍后重试')
                        // 改为：
                        console.error(t('consumer.order.error.fetchDetailFailed'), err)
                        setError(t('consumer.order.error.fetchDetailRetry'))
                    }
                } else {
                    setError('获取订单信息失败')
                }
            } catch (err) {
                console.error('获取订单详情失败:', err)
                setError('获取订单详情失败，请稍后重试')
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            fetchOrderDetail().then(() => {
                console.log("订单详情获取完成")
            }).catch(e => {
                console.error("获取订单详情失败", e)
                showMessage("获取订单详情失败", 'error')
            })
        }
    }, [orderId])


    // 计算订单总金额
    const calculateTotal = (order: ConsumerOrder) => {
        return order.items.reduce((total, item) => {
            console.log("计算商品cost", item.cost)
            console.log("计算商品总价total", total + (item.cost || 0))
            return total + (item.cost || 0)
        }, 0)
    }

    const {t} = useTranslation();

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            <Button
                startDecorator={<ArrowBackIcon/>}
                variant="plain"
                onClick={() => navigate({to: '/consumer/orders'}).then(() => {
                    console.log('已返回消费者订单列表页面')
                })}
                sx={{mb: 2}}
            >
                {t('consumer.order.backToList')}
            </Button>

            {/* 面包屑导航 */}
            <Breadcrumbs
                pathMap={{
                    'consumer': t('consumer.dashboard.title'),
                    'orders': t('consumer.orders.title'),
                    [orderId || '']: t('consumer.order.details')
                }}
            />

            <Typography level="h2" sx={{mb: 3}}>{t('consumer.order.details')}</Typography>

            {loading ? (
                <Skeleton variant="order"/>
            ) : error ? (
                <Alert color="danger" sx={{mb: 2}}>{error}</Alert>
            ) : !order ? (
                <Alert color="warning" sx={{mb: 2}}>{t('consumer.order.notFound')}</Alert>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {/* 订单基本信息 */}
                        <Grid xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography
                                            level="title-lg">{t('consumer.order.orderId')}: {order.orderId}</Typography>
                                        <Chip
                                            variant="soft"
                                            size="md"
                                            color={getStatusColor(order.paymentStatus)}
                                        >
                                            {getStatusText(order.paymentStatus)}
                                        </Chip>
                                    </Box>
                                    <Divider sx={{my: 2}}/>
                                    <Grid container spacing={2}>
                                        <Grid xs={12} md={6}>
                                            <Typography
                                                level="body-md">{t('consumer.order.createdTime')}: {order.createdAt}</Typography>
                                            <Typography
                                                level="body-md">{t('consumer.order.userId')}: {order.userId}</Typography>
                                            <Typography
                                                level="body-md">{t('consumer.order.contactEmail')}: {order.email}</Typography>
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <Typography level="title-sm"
                                                        sx={{mb: 1}}>{t('consumer.order.shippingAddress')}:</Typography>
                                            <Typography level="body-md">
                                                {order.address.streetAddress || t('consumer.order.noAddress')},
                                                {order.address.city || ''},
                                                {order.address.state || ''},
                                                {order.address.country || ''},
                                                {order.address.zipCode || ''}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 订单商品列表 */}
                        <Grid xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography level="title-lg" sx={{mb: 2}}>{t('orders.productOverview')}</Typography>
                                    <Divider sx={{my: 2}}/>

                                    {order.items.map((item, index) => (
                                        <Box key={index} sx={{mb: 2}}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid xs={2} sm={1}>
                                                    {item.item.picture && (
                                                        <Box
                                                            component="img"
                                                            src={item.item.picture}
                                                            alt={item.item.name || t('orders.product')}
                                                            sx={{width: '100%', maxWidth: 60, borderRadius: 'sm'}}
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid xs={6} sm={7}>
                                                    <Typography level="title-sm">
                                                        {item.item.name || `${item.item.productId.substring(0, 8)}`}
                                                    </Typography>
                                                    <Typography level="body-sm" color="neutral">
                                                        {t('orders.unitPrice')}: {formatCurrency(item.cost / item.item.quantity, order.currency)}
                                                    </Typography>

                                                    <Typography level="body-sm" color="neutral">
                                                        商家ID: {item.item.merchantId}
                                                    </Typography>

                                                    <Typography level="body-sm" color="neutral">
                                                        子订单号: {item.subOrderId || '暂无'}
                                                    </Typography>

                                                    <Typography level="body-sm" color="neutral">
                                                        配送状态: {shippingStatus(item.shippingStatus)}
                                                    </Typography>

                                                </Grid>
                                                <Grid xs={2} sm={2} sx={{textAlign: 'center'}}>
                                                    <Typography level="body-md">x {item.item.quantity}</Typography>
                                                </Grid>
                                                <Grid xs={2} sm={2} sx={{textAlign: 'right'}}>
                                                    <Stack spacing={1}>
                                                        <Typography level="body-md">
                                                            {formatCurrency(item.cost, order.currency)}
                                                        </Typography>
                                                        <Button
                                                            size="sm"
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (!item.subOrderId) {
                                                                    showMessage('该订单没有子订单信息，无法查询物流', 'warning');
                                                                    return;
                                                                }
                                                                navigate({ to: `/consumer/logistics/${item.subOrderId}` });
                                                            }}
                                                        >
                                                            查看物流
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                            {index < order.items.length - 1 && <Divider sx={{my: 2}}/>}
                                        </Box>
                                    ))}

                                    <Divider sx={{my: 2}}/>
                                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <Typography level="title-lg">
                                            {t('orders.total')}: {formatCurrency(calculateTotal(order), order.currency)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 确认收货按钮 */}
                        {order.shippingStatus === 'DELIVERED' && (
                            <Grid xs={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography level="title-md">商品已送达，请确认收货</Typography>
                                            <Button
                                                color="success"
                                                variant="solid"
                                                onClick={async () => {
                                                    try {
                                                        await orderService.confirmReceived(order.orderId);
                                                        showMessage('确认收货成功', 'success');
                                                        // 刷新订单详情
                                                        window.location.reload();
                                                    } catch (error) {
                                                        console.error('确认收货失败:', error);
                                                        showMessage('确认收货失败', 'error');
                                                    }
                                                }}
                                            >
                                                确认收货
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </>
            )}


        </Box>
    )
}
