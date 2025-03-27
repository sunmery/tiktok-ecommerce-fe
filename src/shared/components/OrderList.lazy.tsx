import {Box, Button, Card, CardContent, Chip, Divider, Grid, Typography} from '@mui/joy'
import {Order, Orders, PaymentStatus} from '@/types/orders.ts'
import {formatCurrency} from '@/utils/format.ts'
import {Link} from '@tanstack/react-router'

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

// 获取状态颜色
const getStatusColor = (status: PaymentStatus) => {
    // 如果不是数字类型的枚举，则可能是旧版本的字符串枚举
    switch (status) {
        case 'NOT_PAID':
            return 'warning'
        case 'PROCESSING':
            return 'primary'
        case 'PAID':
            return 'success'
        case 'FAILED':
            return 'danger'
        case 'CANCELLED':
            return 'neutral'
        default:
            return 'neutral'
    }
}

// 获取状态文本
const getStatusText = (status: string | PaymentStatus) => {
    // 如果是前端的OrderStatus（字符串枚举）
    switch (status) {
        case 'NOT_PAID':
            return '待支付'
        case 'PROCESSING':
            return '处理中'
        case 'PAID':
            return '已支付'
        case 'FAILED':
            return '支付失败'
        case 'CANCELLED':
            return '已取消'
        case 'SHIPPED':
            return '已发货'
        case 'OUT_OF_STOCK':
            return '无库存'
        default:
            return '未知状态'
    }
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
    return (
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
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                <Typography level="title-md">
                                    订单号: {order.orderId}
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
                                        下单时间: {formatDate(order.createdAt)}
                                    </Typography>
                                    <Typography level="body-sm" color="neutral" sx={{mt: 0.5}}>
                                        商品数量: {order.items.length} 件
                                    </Typography>
                                </Grid>
                                <Grid xs={12} md={6} sx={{textAlign: {xs: 'left', md: 'right'}}}>
                                    <Typography level="title-sm" sx={{fontWeight: 'bold', color: 'primary.500'}}>
                                        总计: {formatCurrency(calculateTotal(order), order.currency)}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* 显示部分商品信息 */}
                            {order.items.length > 0 && (
                                <Box sx={{mb: 2, p: 1, bgcolor: 'background.level1', borderRadius: 'sm'}}>
                                    <Typography level="body-sm" sx={{mb: 1, color: 'neutral.600'}}>
                                        商品概览:
                                    </Typography>
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {order.items.slice(0, 3).map((item: any, index: number) => (
                                            <Chip
                                                key={index}
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                            >
                                                {item.item?.name || '商品'} x {item.item?.quantity || 1}
                                            </Chip>
                                        ))}
                                        {order.items.length > 3 && (
                                            <Chip size="sm" variant="soft"
                                                  color="neutral">+{order.items.length - 3}件</Chip>
                                        )}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                                {order.paymentStatus === 'NOT_PAID' && (
                                    <Button
                                        size="sm"
                                        color="warning"
                                        variant="solid"
                                    >
                                        去支付
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
    )
}
