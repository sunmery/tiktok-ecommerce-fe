import {createLazyFileRoute, useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography} from '@mui/joy'
import {useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {Order, PaymentStatus} from '@/types/orders'
import {formatCurrency} from '@/utils/format'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import Skeleton from '@/components/Skeleton'
import {orderService} from '@/api/orderService'
import {useTranslation} from 'react-i18next'
import {getStatusColor, getStatusText} from "@/utils/status.ts";
import {showMessage} from "@/utils/showMessage.ts";

// 格式化时间戳
const formatDate = (timestamp: any) => {
    if (!timestamp) return ''

    // 处理不同格式的时间戳
    let date
    if (timestamp.seconds) {
        // Firestore 时间戳格式
        date = new Date(timestamp.seconds * 1000)
    } else {
        // ISO 字符串或其他格式
        date = new Date(timestamp)
    }

    return date.toLocaleString()
}

export const Route = createLazyFileRoute('/consumer/orders/$orderId')({
    component: ConsumerOrderDetail,
})

function ConsumerOrderDetail() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const {orderId} = useParams({from: '/consumer/orders/$orderId'})
    const [order, setOrder] = useState<Order | null>(null)
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
                    userId: '', // 留空，API会使用当前登录用户的ID
                    page: 1,
                    pageSize: 50
                })

                // 查找指定ID的订单
                if (response && response.orders) {
                    const foundOrder = response.orders.find(o => o.orderId === orderId)
                    if (foundOrder) {
                        setOrder(foundOrder)
                    } else {
                        setError('未找到订单信息')
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
    const calculateTotal = (order: Order) => {
        return order.items.reduce((total, item) => {
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
                                            level="body-md">{t('consumer.order.createdTime')}: {formatDate(order.createdAt)}</Typography>
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
                                            </Grid>
                                            <Grid xs={2} sm={2} sx={{textAlign: 'center'}}>
                                                <Typography level="body-md">x {item.item.quantity}</Typography>
                                            </Grid>
                                            <Grid xs={2} sm={2} sx={{textAlign: 'right'}}>
                                                <Typography level="body-md">
                                                    {formatCurrency(item.cost, order.currency)}
                                                </Typography>
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

                    {/* 订单状态跟踪 */}
                    <Grid xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg" sx={{mb: 2}}>{t('orders.status.tracking')}</Typography>
                                <Divider sx={{my: 2}}/>

                                <Stack spacing={2}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Chip
                                            variant="soft"
                                            color="success"
                                            sx={{mr: 2}}
                                        >
                                            {t('orders.status.completed')}
                                        </Chip>
                                        <Typography level="body-md">{t('orders.status.created')}</Typography>
                                        <Typography level="body-sm" color="neutral" sx={{ml: 'auto'}}>
                                            {formatDate(order.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Chip
                                            variant="soft"
                                            color={order.paymentStatus !== PaymentStatus.NotPaid ? 'success' : 'neutral'}
                                            sx={{mr: 2}}
                                        >
                                            {order.paymentStatus !== PaymentStatus.NotPaid ? t('orders.status.completed') : t('orders.status.waiting')}
                                        </Chip>
                                        <Typography level="body-md">{t('orders.status.paymentProcessing')}</Typography>
                                        <Typography level="body-sm" color="neutral" sx={{ml: 'auto'}}>
                                            {order.paymentStatus !== PaymentStatus.NotPaid ? formatDate(order.createdAt) : t('orders.status.pending')}
                                        </Typography>
                                    </Box>

                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Chip
                                            variant="soft"
                                            color={order.paymentStatus === PaymentStatus.Paid ? 'success' : 'neutral'}
                                            sx={{mr: 2}}
                                        >
                                            {order.paymentStatus === PaymentStatus.Paid ? t('orders.status.completed') : t('orders.status.waiting')}
                                        </Chip>
                                        <Typography level="body-md">{t('orders.status.orderConfirmed')}</Typography>
                                        <Typography level="body-sm" color="neutral" sx={{ml: 'auto'}}>
                                            {order.paymentStatus === PaymentStatus.Paid ? formatDate(order.createdAt) : t('orders.status.pending')}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>


                </Grid>
            )}
        </Box>
    )
}
