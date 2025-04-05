import {Box, Button, Card, CardContent, Chip, Divider, Grid, Typography} from '@mui/joy'
import {Order, Orders, PaymentStatus} from '@/types/orders.ts'
import {formatCurrency} from '@/utils/format.ts'
import {Link} from '@tanstack/react-router'
import {useState} from 'react'
import OrderDetailModal from './OrderDetailModal'
import {orderService} from '@/api/orderService'
import {useQuery} from '@tanstack/react-query'
import {useTranslation} from 'react-i18next'
import {getStatusText} from '@/utils/status'
import {getStatusColor} from "@/utils/status.ts";

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

// 计算订单总金额
const calculateTotal = (order: Order) => {
    // 处理API订单格式
    if (order.items && order.items.some(item => 'item' in item)) {
        // 处理API订单格式（包含嵌套item对象）
        return order.items.reduce((total, item) => {
            return total + (item.cost * (item.item?.quantity || 0))
        }, 0)
    } else if (order.items) {
        // 处理前端订单格式（平铺结构）
        return order.items.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0)
    }
    return 0
}

export default function OrderList({orders}: Orders) {
    const {t} = useTranslation()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 获取订单详情
    const {data: orderDetail, isLoading} = useQuery({
        queryKey: ['orderDetail', selectedOrderId],
        queryFn: () => orderService.getOrderDetail(selectedOrderId as string),
        enabled: !!selectedOrderId, // 只有在有selectedOrderId时才执行查询
        staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过时
    });

    // 处理点击订单
    const handleOrderClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    // 关闭模态框
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {orders.map((order) => {
                    return (
                        <Card
                            key={order.orderId}
                            variant="outlined"
                            sx={{
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => handleOrderClick(order.orderId)}
                        >
                            <CardContent>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography level="title-md">
                                        {t('orders.orderId')}: {order.orderId}
                                    </Typography>
                                    <Chip
                                        variant="soft"
                                        size="sm"
                                        color={getStatusColor(order.paymentStatus)}
                                        sx={{fontWeight: 'bold'}}
                                    >
                                        {getStatusText(order.paymentStatus)}
                                    </Chip>
                                </Box>

                                <Divider sx={{my: 1}}/>

                                <Grid container spacing={2} sx={{mb: 2}}>
                                    <Grid xs={12} md={6}>
                                        <Typography level="body-sm" color="neutral">
                                            {t('orders.createdTime')}: {formatDate(order.createdAt)}
                                        </Typography>
                                        <Typography level="body-sm" color="neutral" sx={{mt: 0.5}}>
                                            {t('orders.itemCount')}: {order.items.length} {t('orders.unit')}
                                        </Typography>
                                    </Grid>
                                    <Grid xs={12} md={6} sx={{textAlign: {xs: 'left', md: 'right'}}}>
                                        <Typography level="title-sm" sx={{fontWeight: 'bold', color: 'primary.500'}}>
                                            {t('orders.total')}: {formatCurrency(calculateTotal(order), order.currency)}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* 显示部分商品信息 */}
                                {order.items.length > 0 && (
                                    <Box sx={{mb: 2, p: 1, bgcolor: 'background.level1', borderRadius: 'sm'}}>
                                        <Typography level="body-sm" sx={{mb: 1, color: 'neutral.600'}}>
                                            {t('orders.productOverview')}:
                                        </Typography>
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                            {order.items.slice(0, 3).map((item: any, index: number) => (
                                                <Chip
                                                    key={index}
                                                    size="sm"
                                                    variant="outlined"
                                                    color="neutral"
                                                >
                                                    {item.item?.name || t('orders.product')} x {item.item?.quantity || 1}
                                                </Chip>
                                            ))}
                                            {order.items.length > 3 && (
                                                <Chip size="sm" variant="soft"
                                                      color="neutral">+{order.items.length - 3} {t('orders.unit')}</Chip>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}
                                     onClick={(e) => e.stopPropagation()}>
                                    {order.paymentStatus === 'NOT_PAID' && (
                                        <Button
                                            size="sm"
                                            color="warning"
                                            variant="solid"
                                        >
                                            {t('orders.pay')}
                                        </Button>
                                    )}
                                    {order.paymentStatus === PaymentStatus.Shipped && (
                                        <Button
                                            size="sm"
                                            color="success"
                                            variant="solid"
                                            onClick={async () => {
                                                try {
                                                    await orderService.confirmReceived(order.orderId);
                                                    // 刷新页面或更新订单状态
                                                    window.location.reload();
                                                } catch (error) {
                                                    console.error('确认收货失败:', error);
                                                    alert(t('orders.confirmReceiveFailed'));
                                                }
                                            }}
                                        >
                                            {t('orders.confirmReceive')}
                                        </Button>
                                    )}
                                    <Button
                                        component={Link}
                                        to={`/orders/${order.orderId}`}
                                        size="sm"
                                        variant="outlined"
                                        sx={{minWidth: '80px'}}
                                    >
                                        查看详情
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* 订单详情模态框 */}
            <OrderDetailModal
                open={isModalOpen}
                onClose={handleCloseModal}
                order={orderDetail || null}
                loading={isLoading}
            />
        </>
    )
}
