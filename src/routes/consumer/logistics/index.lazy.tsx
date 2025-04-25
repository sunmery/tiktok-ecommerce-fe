import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Stack, Typography} from '@mui/joy'
import {useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {useTranslation} from 'react-i18next'
import {ShippingUpdate} from '@/types/orders'
import {orderService} from '@/api/orderService'
import {useQuery} from '@tanstack/react-query'
import {addressService} from '@/api/merchant/addressService'
import {userService} from '@/api/userService'
import LogisticsMap from '@/components/LogisticsMap'
import {Coordinates} from '@/types/logisticsMap'
import {showMessage} from '@/utils/showMessage'
import {shippingStatus} from "@/utils/status.ts";

export const Route = createLazyFileRoute('/consumer/logistics/')({
    component: ConsumerLogistics,
})

function ConsumerLogistics() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [sellerPosition, setSellerPosition] = useState<Coordinates>([39.9042, 116.4074]) // 默认北京坐标
    const [userPosition, setUserPosition] = useState<Coordinates>([31.2304, 121.4737]) // 默认上海坐标

    // 获取订单信息
    const {data: orderData, isLoading: orderLoading} = useQuery({
        queryKey: ['consumerOrder'],
        queryFn: () => orderService.getConsumerOrder({page: 1, pageSize: 50})
    })

    // 获取用户地址
    const {data: userAddresses} = useQuery({
        queryKey: ['userAddresses'],
        queryFn: () => userService.getAddresses()
    })

    // // 获取商家地址
    // const {data: merchantAddresses} = useQuery({
    //     queryKey: ['merchantAddresses'],
    //     queryFn: () => addressService.listAddresses({page: 1, pageSize: 10})
    // })

    // 获取物流信息
    const {data: shippingInfo, isLoading: shippingLoading} = useQuery({
        queryKey: ['shippingInfo'],
        queryFn: async () => {
            if (!orderData?.orders?.[0]?.subOrderId) return null
            return orderService.getSubOrderShipping(orderData.orders[0].subOrderId.toString())
        },
        enabled: !!orderData?.orders?.[0]?.subOrderId
    })

    // 检查用户是否为消费者
    useEffect(() => {
        if (account.role !== 'consumer') {
            navigate({to: '/'}).then(() => {
                showMessage(t('consumer.order.notAllowed'), 'error')
            })
        }
    }, [account.role, navigate])

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            <Button
                startDecorator={<ArrowBackIcon/>}
                variant="plain"
                onClick={() => navigate({to: '/consumer/orders'})}
                sx={{mb: 2}}
            >
                {t('consumer.order.backToList')}
            </Button>

            <Breadcrumbs
                pathMap={{
                    'consumer': t('consumer.dashboard.title'),
                    'logistics': t('orders.shipping.status')
                }}
            />

            <Typography level="h2" sx={{mb: 3}}>{t('orders.shipping.status')}</Typography>

            {orderLoading || shippingLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                    <CircularProgress/>
                </Box>
            ) : !shippingInfo ? (
                <Alert color="warning">{t('orders.shipping.noInfo')}</Alert>
            ) : (
                <Grid container spacing={3}>
                    {/* 物流基本信息 */}
                    <Grid xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg" sx={{mb: 2}}>{t('orders.shipping.basic')}</Typography>
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography level="body-md">主订单号: {shippingInfo.orderId}</Typography>
                                        <Typography level="body-md">子订单号: {shippingInfo.subOrderId}</Typography>
                                        <Typography level="body-md">支付状态: {shippingInfo.paymentStatus}</Typography>
                                        <Typography
                                            level="body-md">货运状态: {shippingStatus(shippingInfo.shippingStatus)}</Typography>
                                        <Typography level="body-md">物流单号: {shippingInfo.trackingNumber}</Typography>
                                        <Typography level="body-md">物流公司: {shippingInfo.carrier}</Typography>
                                        <Typography
                                            level="body-md">预计送达: {shippingInfo.estimatedDelivery}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 物流地图 */}
                    <Grid xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg" sx={{mb: 2}}>物流路线</Typography>
                                <Divider sx={{my: 2}}/>
                                <Box sx={{height: '400px', width: '100%'}}>
                                    <LogisticsMap
                                        sellerPosition={sellerPosition}
                                        userPosition={userPosition}
                                        onDeliveryComplete={() => console.log('配送完成')}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 物流更新记录 */}
                    {shippingInfo.updates && shippingInfo.updates.length > 0 && (
                        <Grid xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography level="title-lg"
                                                sx={{mb: 2}}>{t('orders.shipping.updates')}</Typography>
                                    <Divider sx={{my: 2}}/>
                                    <Stack spacing={2}>
                                        {shippingInfo.updates.map((update: ShippingUpdate, index: number) => (
                                            <Box key={index}>
                                                <Typography level="title-sm">{update.timestamp}</Typography>
                                                <Typography
                                                    level="body-md">{update.status} - {update.location}</Typography>
                                                <Typography level="body-md">{update.description}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    )
}
