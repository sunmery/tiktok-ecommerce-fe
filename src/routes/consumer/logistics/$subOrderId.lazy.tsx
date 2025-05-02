import {createLazyFileRoute, useNavigate, useParams} from '@tanstack/react-router'
import {Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Stack, Typography} from '@mui/joy'
import {useEffect, useState} from 'react'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {useTranslation} from 'react-i18next'
import {GetSubOrderShippingReply, ShippingStatus, ShippingUpdate, updateOrderShippingStatusReq} from '@/types/orders'
import {orderService} from '@/api/orderService'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import LogisticsMap from '@/components/LogisticsMap'
import {Coordinates} from '@/types/logisticsMap'
import {showMessage} from '@/utils/showMessage'
import {shippingStatus} from "@/utils/status.ts";
import {getCoordinatesByAddress} from '@/utils/geocoding';


export const Route = createLazyFileRoute('/consumer/logistics/$subOrderId')({
    component: ConsumerLogistics,
})

function ConsumerLogistics() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const queryClient = useQueryClient();
    // 使用 useParams 获取路由参数
    const {subOrderId} = useParams({from: '/consumer/logistics/$subOrderId'})
    const [merchantPosition, setMerchantPosition] = useState<Coordinates | null>(null);
    const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
    const [geocodingLoading, setGeocodingLoading] = useState(false);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);

    // 移除获取订单列表的 useQuery
    // const {data: orderData, isLoading: orderLoading} = useQuery({ ... })

    // 获取物流信息 - 使用从 useParams 获取的 subOrderId
    const {
        data: shippingInfo,
        isLoading: shippingLoading,
        refetch: refetchShippingInfo
    } = useQuery<GetSubOrderShippingReply | null>({
        // 更新 queryKey 以包含 subOrderId
        queryKey: ['shippingInfo', subOrderId],
        queryFn: async () => {
            // 确保 subOrderId 存在
            if (!subOrderId) {
                console.error("SubOrderId not found in route params");
                showMessage(t('errors.missingSubOrderId'), 'error');
                return null;
            }
            try {
                return await orderService.getSubOrderShipping(subOrderId);
            } catch (error) {
                console.error("获取物流信息失败:", error);
                showMessage(t('errors.fetchShippingFailed'), 'error');
                return null;
            }
        },
        // 仅在 subOrderId 存在时启用查询
        enabled: !!subOrderId
    })

    // --- Mutation for updating shipping status ---
    const updateStatusMutation = useMutation({
        mutationFn: (params: updateOrderShippingStatusReq) => orderService.updateOrderShippingStatus(params),
        onSuccess: (_data, variables) => {
            // 显示一次成功消息
            showMessage(`物流状态已更新为: ${shippingStatus(variables.shippingStatus)}`, 'success');
            // 使相关的查询失效，以便重新获取最新数据
            queryClient.invalidateQueries({queryKey: ['shippingInfo', subOrderId]});
            // 移除 .then() 中的重复消息
        },
        onError: (error, variables) => {
            console.error(`更新物流状态至 ${variables.shippingStatus} 失败:`, error);
            showMessage(`更新物流状态失败: ${error.message}`, 'error');
        },
    });
    // --- End Mutation ---

    // 检查用户是否为消费者 (保持不变)
    useEffect(() => {
        if (account.role !== 'consumer') {
            navigate({to: '/'}).then(() => {
                showMessage(t('consumer.order.notAllowed'), 'error')
            })
        }
    }, [account.role, navigate, t])

    // 地理编码逻辑 (依赖 shippingInfo)
    useEffect(() => {
        const fetchCoordinates = async () => {
            if (shippingInfo && shippingInfo.shippingAddress && shippingInfo.receiverAddress) {
                setGeocodingLoading(true);
                setGeocodingError(null);
                try {
                    // @ts-ignore
                    const merchantAddr = shippingInfo.shippingAddress;
                    // @ts-ignore
                    const userAddr = shippingInfo.receiverAddress;
                    const merchantAddressString = `${merchantAddr.country || ''} ${merchantAddr.state || ''} ${merchantAddr.city || ''} ${merchantAddr.streetAddress || ''}`.trim();
                    const userAddressString = `${userAddr.country || ''} ${userAddr.state || ''} ${userAddr.city || ''} ${userAddr.streetAddress || ''}`.trim();

                    if (!merchantAddressString || !userAddressString) {
                        throw new Error("地址信息不完整");
                    }

                    const [merchantCoords, userCoords] = await Promise.all([
                        getCoordinatesByAddress(merchantAddressString),
                        getCoordinatesByAddress(userAddressString)
                    ]);

                    setMerchantPosition(merchantCoords);
                    setUserPosition(userCoords);

                } catch (err) {
                    console.error('地理编码失败:', err);
                    const errorMsg = err instanceof Error ? err.message : '未知错误';
                    setGeocodingError(`无法获取地址坐标: ${errorMsg}。将使用默认坐标。`);
                    showMessage(`无法获取地址坐标: ${errorMsg}`, 'error');
                    setMerchantPosition([39.9042, 116.4074]); // 北京
                    setUserPosition([31.2304, 121.4737]); // 上海
                } finally {
                    setGeocodingLoading(false);
                }
            } else if (!shippingLoading && !shippingInfo && subOrderId) { // 检查 subOrderId 是否存在
                setGeocodingError(t('orders.shipping.noInfo'));
                setMerchantPosition([39.9042, 116.4074]);
                setUserPosition([31.2304, 121.4737]);
            }
        };
        fetchCoordinates().catch((err) => {
            console.error('地理编码失败:', err);
            setGeocodingError(t('errors.geocodingFailed'));
            setGeocodingLoading(false);
        })
        // 移除 orderData 依赖
    }, [shippingInfo, shippingLoading, subOrderId, t]); // 添加 subOrderId 依赖

    // --- Callback functions for LogisticsMap ---
    const handleInTransit = () => {
        console.log("触发运输中回调");
        // 保持不变：仅当状态为 '已发货' 时更新为 '运输中'
        if (subOrderId && shippingInfo?.shippingStatus === ShippingStatus.ShippingShipped) {
            updateStatusMutation.mutate({
                subOrderId: subOrderId as string,
                shippingStatus: ShippingStatus.ShippingInTransit,
                trackingNumber: shippingInfo.trackingNumber || '',
                carrier: shippingInfo.carrier || '',
                shippingAddress: shippingInfo.shippingAddress,
                shippingFee: shippingInfo.shippingFee || 0,
                delivery: ''
            });
        } else {
            console.warn("状态不是 '已发货' 或 subOrderId/shippingInfo 不存在，无法更新为 '运输中'");
        }
    };

    const handleDeliveryComplete = () => {
        console.log("触发送达回调");
        // 使用从 useParams 获取的 subOrderId
        // 修改条件：允许在状态为 ShippingInTransit 或 ShippingShipped 时触发
        // 因为 onInTransit 刚触发，状态可能还没更新
        if (subOrderId && shippingInfo &&
            (shippingInfo.shippingStatus === ShippingStatus.ShippingInTransit ||
             shippingInfo.shippingStatus === ShippingStatus.ShippingShipped)) {
            const delivery = new Date().toISOString()
            // 确保只在状态不是 Delivered 时才更新
            if (shippingInfo.shippingStatus !== ShippingStatus.ShippingDelivered) {
                updateStatusMutation.mutate({
                    subOrderId: subOrderId, // 使用从 useParams 获取的 subOrderId
                    shippingStatus: ShippingStatus.ShippingDelivered, // 更新为已送达
                    trackingNumber: shippingInfo.trackingNumber || '',
                    carrier: shippingInfo.carrier || '',
                    shippingAddress: shippingInfo.shippingAddress,
                    shippingFee: shippingInfo.shippingFee || 0,
                    delivery: delivery,
                });
            } else {
                 console.log("状态已经是 '已送达'，无需重复更新");
            }
        } else {
            console.warn("状态不符合更新为 '已送达' 的条件或 subOrderId/shippingInfo 不存在");
        }
    };
    // --- End Callbacks ---


    // --- Render Logic ---
    const renderContent = () => {
        // 移除 orderLoading 检查
        if (shippingLoading || geocodingLoading) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                    <CircularProgress/>
                    {geocodingLoading && <Typography sx={{ml: 1}}>正在获取地址坐标...</Typography>}
                </Box>
            );
        }

        if (!shippingInfo) {
            return <Alert color="warning">{geocodingError || t('orders.shipping.noInfo')}</Alert>;
        }

        if (geocodingError && (!merchantPosition || !userPosition)) {
            return <Alert color="danger">{geocodingError}</Alert>;
        }

        if (!merchantPosition || !userPosition) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                    <CircularProgress/>
                    <Typography sx={{ml: 1}}>等待坐标数据...</Typography>
                </Box>
            );
        }

        // 确保传递正确的初始状态
        const initialMapStatus = shippingInfo?.shippingStatus || ShippingStatus.ShippingPending;

        return (
            <Grid container spacing={3}>
                {/* 物流基本信息 */}
                <Grid xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-lg" sx={{mb: 2}}>{t('orders.shipping.basic')}</Typography>
                            <Divider sx={{my: 2}}/>
                            {/* 确保 shippingInfo 存在再渲染 */}
                            {shippingInfo ? (
                                <Stack spacing={1}>
                                    <Typography level="body-md">主订单号: {shippingInfo.orderId}</Typography>
                                    <Typography level="body-md">子订单号: {shippingInfo.subOrderId}</Typography>
                                    <Typography level="body-md">支付状态: {shippingInfo.paymentStatus}</Typography>
                                    <Typography
                                        level="body-md">货运状态: {shippingStatus(shippingInfo.shippingStatus)}</Typography>
                                    <Typography level="body-md">物流单号: {shippingInfo.trackingNumber}</Typography>
                                    <Typography level="body-md">物流公司: {shippingInfo.carrier}</Typography>
                                    {/* @ts-ignore */}
                                    {shippingInfo.shippingAddress && (
                                        <Typography level="body-sm" color="neutral">
                                            {/* @ts-ignore */}
                                            发货地址: {`${shippingInfo.shippingAddress.state || ''} ${shippingInfo.shippingAddress.city || ''} ${shippingInfo.shippingAddress.streetAddress || ''}`}
                                        </Typography>
                                    )}
                                    {/* @ts-ignore */}
                                    {shippingInfo.receiverAddress && (
                                        <Typography level="body-sm" color="neutral">
                                            {/* @ts-ignore */}
                                            收货地址: {`${shippingInfo.receiverAddress.state || ''} ${shippingInfo.receiverAddress.city || ''} ${shippingInfo.receiverAddress.streetAddress || ''}`}
                                        </Typography>
                                    )}
                                </Stack>
                            ) : (
                                <Typography>无法加载物流信息。</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 物流地图 */}
                <Grid xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-lg" sx={{mb: 2}}>物流路线</Typography>
                            {geocodingError && <Alert color="warning" sx={{mb: 1}}>{geocodingError}</Alert>}
                            <Divider sx={{my: 2}}/>
                            <Box sx={{height: '400px', width: '100%'}}>
                                {/* 确保坐标和 shippingInfo 都存在 */}
                                {merchantPosition && userPosition && shippingInfo && (
                                    <LogisticsMap
                                        sellerPosition={merchantPosition}
                                        userPosition={userPosition}
                                        initialShippingStatus={initialMapStatus}
                                        onInTransit={handleInTransit}
                                        onDeliveryComplete={handleDeliveryComplete}
                                        paymentStatus={shippingInfo.paymentStatus}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 物流更新记录 */}
                {/* @ts-ignore */}
                {shippingInfo?.updates && shippingInfo.updates.length > 0 && (
                    <Grid xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg" sx={{mb: 2}}>{t('orders.shipping.updates')}</Typography>
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={2}>
                                    {/* @ts-ignore */}
                                    {shippingInfo.updates.map((update: ShippingUpdate, index: number) => (
                                        <Box key={index}>
                                            <Typography level="title-sm">{update.timestamp}</Typography>
                                            <Typography level="body-md">{update.status} - {update.location}</Typography>
                                            <Typography level="body-md">{update.description}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        );
    };

    return (
        <Box sx={{maxWidth: '1200px', margin: '0 auto', p: 3}}>
            {/* 更新面包屑路径 */}
            <Breadcrumbs pathMap={{
                'consumer': t('consumer.dashboard.title'),
                'orders': t('consumer.orders.title'),
                'logistics': t('consumer.logistics.title') // 添加物流层级
            }}/>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 3}}>
                <Typography level="h2">{t('consumer.logistics.title')}</Typography>
                <Button
                    variant="outlined"
                    startDecorator={<ArrowBackIcon/>}
                    // 返回到订单列表页
                    onClick={() => navigate({to: '/consumer/orders'})}
                >
                    {t('common.back')}
                </Button>
            </Stack>
            {renderContent()}
        </Box>
    );
}
