import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect, useRef, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import { useTranslation } from 'react-i18next'
import { ShippingStatus } from '@/types/status'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LogisticsMap from '@/components/LogisticsMap'
import { Coordinates } from '@/types/logisticsMap'
import { showMessage } from '@/utils/showMessage'
import { shippingStatus } from "@/utils/status.ts";
import { getCoordinatesByAddress } from '@/utils/geocoding';
import { merchantOrderService } from "@/features/dashboard/merchant/orders/api.ts";
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";
import { ShippingUpdate, updateOrderShippingStatusReq } from '@/features/dashboard/consumer/orders/type'

export const Route = createLazyFileRoute('/consumer/logistics/$subOrderId')({
    component: ConsumerLogistics,
})

function ConsumerLogistics() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const queryClient = useQueryClient();
    const deliverySubmittedRef = useRef(false);

    // 使用 useParams 获取路由参数
    const {subOrderId} = useParams({from: '/consumer/logistics/$subOrderId'})
    const [merchantPosition, setMerchantPosition] = useState<Coordinates | null>(null);
    const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
    const [geocodingLoading, setGeocodingLoading] = useState(false);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);
    // 添加一个状态来控制动画的执行
    const [startAnimation, setStartAnimation] = useState(false);
    // 添加一个状态来跟踪动画是否已经开始
    const [animationInProgress, setAnimationInProgress] = useState(false);

    // 添加确认收货状态
    const [confirmingReceipt, setConfirmingReceipt] = useState(false);

    const {
        data: shippingInfo,
        isLoading: shippingLoading,
        error: shippingError
    } = useQuery({
        queryKey: ['shippingInfo', subOrderId],
        queryFn: () => orderService.getSubOrderShipping(subOrderId as string),
        enabled: !!subOrderId,
        // 添加 refetchInterval 以便轮询更新物流状态，例如每30秒
        refetchInterval: 30000,
    });

    // Function to get shipping status text (moved inside or ensure it's accessible)
    const getShippingStatusText = (status: ShippingStatus) => {
        return shippingStatus(status);
    };

    // --- Mutation for updating shipping status (MOVED INSIDE) ---
    const updateStatusMutation = useMutation({
        mutationFn: (params: updateOrderShippingStatusReq) => orderService.updateOrderShippingStatus(params),
        onSuccess: (_data, variables) => { // 添加 variables 参数
            // 使用 setTimeout 延迟查询失效，避免立即触发重新渲染
            setTimeout(() => {
                // 使相关的查询失效，以便重新获取最新数据
                queryClient.invalidateQueries({queryKey: ['shippingInfo', subOrderId]});
                showMessage(t('consumer.logistics.success.statusUpdated', {status: getShippingStatusText(variables.shippingStatus)}), 'success');
            }, 1000); // 延迟1秒
        },
        onError: (error: Error, variables) => { // Ensure error type is correct
            console.error(`更新物流状态至 ${variables.shippingStatus} 失败:`, error);
            showMessage(t('consumer.logistics.error.updateFailed', {message: error.message}), 'error');
        },
    });

    // 添加确认收货的mutation
    const confirmReceiptMutation = useMutation({
        mutationFn: (subOrderId: string) => orderService.confirmReceived(subOrderId),
        onSuccess: () => {
            // 确认收货成功后刷新数据
            queryClient.invalidateQueries({queryKey: ['shippingInfo', subOrderId]});
            showMessage(t('consumer.logistics.success.receiptConfirmed'), 'success');
            setConfirmingReceipt(false);
        },
        onError: (error: Error) => {
            console.error('确认收货失败:', error);
            showMessage(t('consumer.logistics.error.confirmReceiptFailed', {message: error.message}), 'error');
            setConfirmingReceipt(false);
        }
    });

    // 处理确认收货
    const handleConfirmReceipt = () => {
        if (subOrderId && !confirmingReceipt) {
            setConfirmingReceipt(true);
            confirmReceiptMutation.mutate(subOrderId);
        }
    };

    if (shippingError) {
        showMessage(t('consumer.logistics.error.fetchShippingInfo', {message: shippingError.message}), 'error'); // <-- 使用 t() 和插值
    }
    // 地理编码逻辑 (依赖 shippingInfo)
    useEffect(() => {
        const fetchCoordinates = async () => {
            if (shippingInfo) {
                setGeocodingLoading(true);
                setGeocodingError(null);
                try {
                    // 尝试从订单信息中获取地址
                    let merchantAddr = shippingInfo.shippingAddress || {};
                    let userAddr = shippingInfo.receiverAddress || {};

                    // 如果地址信息不完整，尝试从 orders 数组中查找匹配的子订单
                    if ((!merchantAddr.city || !merchantAddr.country) && subOrderId) {
                        // 这里可以添加获取完整订单信息的逻辑
                        try {
                            const orderResponse = await merchantOrderService.getMerchantOrders({
                                page: 1,
                                pageSize: 50
                            });

                            if (orderResponse && orderResponse.orders) {
                                // 在所有订单中查找匹配的子订单
                                for (const order of orderResponse.orders) {
                                    const matchingItem = order.items.find(item =>
                                        item.subOrderId.toString() === subOrderId.toString());

                                    if (matchingItem) {
                                        // 使用找到的订单项中的地址信息
                                        userAddr = matchingItem.address || userAddr;
                                        // 商家地址可能需要从其他地方获取
                                        break;
                                    }
                                }
                            }
                        } catch (err) {
                            console.error('获取订单信息失败:', err);
                        }
                    }

                    const merchantAddressString = `${merchantAddr.country || ''} ${merchantAddr.state || ''} ${merchantAddr.city || ''} ${merchantAddr.streetAddress || ''}`.trim();
                    const userAddressString = `${userAddr.country || ''} ${userAddr.state || ''} ${userAddr.city || ''} ${userAddr.streetAddress || ''}`.trim();

                    // 检查地址信息是否完整
                    if (!merchantAddressString && !userAddressString) {
                        console.warn('地址信息不完整，使用默认坐标');
                        setMerchantPosition([39.9042, 116.4074]); // 北京
                        setUserPosition([31.2304, 121.4737]); // 上海
                        return;
                    }

                    // 如果有一个地址不完整，使用默认值
                    const merchantCoords = merchantAddressString ?
                        await getCoordinatesByAddress(merchantAddressString) :
                        [39.9042, 116.4074]; // 默认北京

                    const userCoords = userAddressString ?
                        await getCoordinatesByAddress(userAddressString) :
                        [31.2304, 121.4737]; // 默认上海

                    setMerchantPosition(merchantCoords);
                    setUserPosition(userCoords);

                } catch (err) {
                    console.error('地理编码失败:', err);
                    const errorMsg = err instanceof Error ? err.message : '未知错误';
                    setGeocodingError(t('consumer.logistics.error.geocodingFailedWithFallback', {errorMsg})); // <-- 使用 t() 和插值
                    // showMessage(`无法获取地址坐标: ${errorMsg}`, 'error');
                    console.log(`无法获取地址坐标: ${errorMsg}`, 'error');

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
            // Ensure default coordinates are set even on error
            setMerchantPosition([39.9042, 116.4074]);
            setUserPosition([31.2304, 121.4737]);
        })
    }, [shippingInfo, shippingLoading, subOrderId, t]);

    // --- Callback functions for LogisticsMap ---
    // 使用 useCallback 包装回调函数，确保引用稳定
    const handleInTransit = useCallback(() => {
        console.log("触发运输中回调 - 仅动画效果，不更新后端状态");
        // 不再调用后端API更新状态，只保留日志
    }, []); // 空依赖数组，因为此函数不依赖外部变量

    const handleDeliveryComplete = useCallback(() => {
        console.log("触发送达回调");
        // 检查是否已经提交过送达状态，避免重复更新
        if (subOrderId &&
            shippingInfo?.shippingStatus !== ShippingStatus.ShippingDelivered &&
            !updateStatusMutation.isPending &&
            !deliverySubmittedRef.current) {

            // 标记已经提交过送达状态
            deliverySubmittedRef.current = true;

            const delivery = new Date().toISOString(); // 使用当前日期时间
            updateStatusMutation.mutate({
                subOrderId: subOrderId as string,
                shippingStatus: ShippingStatus.ShippingDelivered,
                trackingNumber: shippingInfo?.trackingNumber || '',
                carrier: shippingInfo?.carrier || '',
                shippingAddress: shippingInfo?.shippingAddress,
                shippingFee: shippingInfo?.shippingFee || 0,
                delivery: delivery, // 只在送达状态时传递送达时间
            }, {
                // 添加成功回调，确保状态更新后不再触发动画
                onSuccess: () => {
                    // 重置动画状态
                    setAnimationInProgress(false);
                    setStartAnimation(false);
                    // 强制刷新数据
                    queryClient.invalidateQueries({queryKey: ['shippingInfo', subOrderId]});
                    // 显示成功消息
                    console.log("物流状态已成功更新为已送达");
                    showMessage(t('consumer.logistics.success.statusUpdated', {status: getShippingStatusText(ShippingStatus.ShippingDelivered)}), 'success') // <-- 使用 t() 和插值
                }
            });
        } else {
            console.warn(`当前状态不适合更新为 '已送达' 或更新已在进行中或已经提交过`);
            // 重置动画状态，防止循环
            setAnimationInProgress(false);
            setStartAnimation(false);
        }
        // 依赖项应包含所有在函数内部使用的、可能变化的外部变量
    }, [subOrderId, shippingInfo, updateStatusMutation, queryClient, t]); // Added t to dependencies

    // 处理初始状态变化
    useEffect(() => {
        // 如果物流信息已加载且状态为"已发货"，启动动画
        if (shippingInfo &&
            !shippingLoading &&
            shippingInfo.shippingStatus === ShippingStatus.ShippingShipped &&
            !animationInProgress &&
            !startAnimation) {

            console.log("检测到已发货状态，启动动画...");
            // 设置开始动画标志，确保动画开始执行
            setStartAnimation(true);
            setAnimationInProgress(true);
        }

        // 如果状态已经是"已送达"，重置所有状态
        if (shippingInfo?.shippingStatus === ShippingStatus.ShippingDelivered) {
            setAnimationInProgress(false);
            setStartAnimation(false);
        }

        // 如果状态重置为初始状态，重置引用
        if (shippingInfo?.shippingStatus === ShippingStatus.ShippingPending ||
            shippingInfo?.shippingStatus === ShippingStatus.ShippingWaitCommand) {
            deliverySubmittedRef.current = false;
        }
    }, [shippingInfo, shippingLoading, animationInProgress, startAnimation]);

    const renderContent = () => {
        if (shippingLoading || geocodingLoading) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                    <CircularProgress/>
                    {geocodingLoading &&
                        <Typography sx={{ml: 1}}>{t('consumer.logistics.loadingGeocoding')}</Typography>}
                </Box>
            );
        }

        if (!shippingInfo) {
            return <Alert color="warning">{geocodingError || t('orders.shipping.noInfo')}</Alert>;
        }

        if (geocodingError && (!merchantPosition || !userPosition)) {
            return <Alert color="danger">{geocodingError}</Alert>;
        }


        // 确保传递正确的初始状态
        const initialMapStatus = shippingInfo?.shippingStatus || ShippingStatus.ShippingPending;

        return (
            <Grid container spacing={3}>
                {/* 物流基本信息 */}
                <Grid xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-lg" sx={{mb: 2}}>{t('consumer.logistics.basicInfo')}</Typography>
                            <Divider sx={{my: 2}}/>
                            {shippingInfo ? (
                                <Stack spacing={1}>
                                    <Typography
                                        level="body-md">{t('consumer.logistics.shippingId')}: {shippingInfo.orderId}</Typography>
                                    <Typography
                                        level="body-md">{t('consumer.logistics.orderSubId')}: {shippingInfo.subOrderId}</Typography>
                                    <Typography
                                        level="body-md">{t('consumer.logistics.shippingStatus')}: {getShippingStatusText(shippingInfo.shippingStatus)}</Typography>
                                    <Typography
                                        level="body-md">{t('consumer.logistics.trackingNumber')}: {shippingInfo.trackingNumber}</Typography>
                                    <Typography
                                        level="body-md">{t('consumer.logistics.carrier')}: {shippingInfo.carrier}</Typography>
                                    {shippingInfo.shippingAddress && (
                                        <Typography level="body-sm" color="neutral">
                                            {t('consumer.logistics.shippingAddress')}: {`${shippingInfo.shippingAddress.state || ''} ${shippingInfo.shippingAddress.city || ''} ${shippingInfo.shippingAddress.streetAddress || ''}`}
                                        </Typography>
                                    )}
                                    {shippingInfo.receiverAddress && (
                                        <Typography level="body-sm" color="neutral">
                                            {t('consumer.logistics.receiverAddress')}: {`${shippingInfo.receiverAddress.state || ''} ${shippingInfo.receiverAddress.city || ''} ${shippingInfo.receiverAddress.streetAddress || ''}`}
                                        </Typography>
                                    )}
                                </Stack>
                            ) : (
                                <Typography>{t('consumer.logistics.noShippingInfo')}</Typography>
                            )}

                            {/* 添加确认收货按钮 */}
                            {shippingInfo && shippingInfo.shippingStatus === ShippingStatus.ShippingDelivered && (
                                <Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
                                    <Button
                                        color="success"
                                        variant="solid"
                                        onClick={handleConfirmReceipt}
                                        disabled={confirmingReceipt || confirmReceiptMutation.isPending}
                                        startDecorator={confirmingReceipt && <CircularProgress size="sm"/>}
                                    >
                                        {confirmingReceipt ? t('consumer.logistics.confirming') : t('consumer.logistics.confirmReceipt')}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* 物流地图 */}
                <Grid xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-lg" sx={{mb: 2}}>{t('consumer.logistics.route')}</Typography>
                            {geocodingError && <Alert color="warning" sx={{mb: 1}}>{geocodingError}</Alert>}
                            <Divider sx={{my: 2}}/>
                            <Box sx={{height: '400px', width: '100%'}}>
                                {merchantPosition && userPosition && shippingInfo && (
                                    <LogisticsMap
                                        sellerPosition={merchantPosition}
                                        userPosition={userPosition}
                                        initialShippingStatus={initialMapStatus}
                                        onInTransit={handleInTransit}
                                        onDeliveryComplete={handleDeliveryComplete}
                                        startAnimation={startAnimation}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 物流更新记录 */}
                {shippingInfo?.updates && shippingInfo.updates.length > 0 && (
                    <Grid xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-lg" sx={{mb: 2}}>{t('consumer.logistics.updates')}</Typography>
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={2}>
                                    {shippingInfo.updates.map((update: ShippingUpdate, index: number) => (
                                        <Box key={index}>
                                            <Typography level="title-sm">{update.timestamp}</Typography>
                                            <Typography
                                                level="body-md">{t('consumer.logistics.status')}: {update.status} - {update.location}</Typography>
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
