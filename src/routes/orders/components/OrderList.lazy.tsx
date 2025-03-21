import { Box, Card, CardContent, Typography, Chip, Grid, Divider, Button } from '@mui/joy'
import { Order as FrontendOrder, Order as ApiOrder, PaymentStatus } from '@/types/orders'
import { formatCurrency } from '@/utils/format'
import { Link } from '@tanstack/react-router'

// 定义一个通用的Order类型，兼容前端和API的Order类型
type Order = FrontendOrder | ApiOrder

interface OrderListProps {
  orders: Order[]
}

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
const getStatusColor = (status: PaymentStatus | ApiPaymentStatus) => {
  // 如果是API的PaymentStatus（数字枚举），转换为前端的OrderStatus（字符串枚举）
  if (typeof status === 'number') {
    switch (status) {
      case ApiPaymentStatus.notPaid:
        return 'warning'
      case ApiPaymentStatus.processing:
        return 'primary'
      case ApiPaymentStatus.paid:
        return 'success'
      case ApiPaymentStatus.failed:
        return 'danger'
      case ApiPaymentStatus.cancelled:
        return 'neutral'
      default:
        return 'neutral'
    }
  }
  // 如果不是数字类型的枚举，则可能是旧版本的字符串枚举
  switch (status) {
    case 'notPaid':
      return 'warning'
    case 'processing':
      return 'primary'
    case 'paid':
      return 'success'
    case 'failed':
      return 'danger'
    case 'cancelled':
      return 'neutral'
    default:
      return 'neutral'
  }
}

// 获取状态文本
const getStatusText = (status: string | ApiPaymentStatus) => {
  // 如果是API的PaymentStatus（数字枚举），转换为对应的文本
  if (typeof status === 'number') {
    switch (status) {
      case ApiPaymentStatus.notPaid:
        return '待支付'
      case ApiPaymentStatus.processing:
        return '处理中'
      case ApiPaymentStatus.paid:
        return '已支付'
      case ApiPaymentStatus.failed:
        return '支付失败'
      case ApiPaymentStatus.cancelled:
        return '已取消'
      default:
        return '未知状态'
    }
  }
  // 如果是前端的OrderStatus（字符串枚举）
  switch (status) {
    case 'notPaid':
      return '待支付'
    case 'processing':
      return '处理中'
    case 'paid':
      return '已支付'
    case 'failed':
      return '支付失败'
    case 'cancelled':
      return '已取消'
    case 'shipped':
      return '已发货'
    case 'outOfStock':
      return '无库存'
    default:
      return '未知状态'
  }
}

// 计算订单总金额
const calculateTotal = (order: Order) => {
  // 处理API订单格式
  if ('orderItems' in order && order.orderItems) {
    return order.orderItems.reduce((total, item) => {
      return total + (item.cost || 0)
    }, 0)
  } 
  // 处理前端订单格式
  else if ('items' in order && order.items) {
    return order.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }
  return 0
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {orders.map((order) => {
        const orderId = 'orderId' in order ? order.orderId : order.orderId;
        const paymentStatus = 'paymentStatus' in order ? order.paymentStatus : order.paymentStatus;
        const createdAt = 'createdAt' in order ? order.createdAt : order.createdAt;
        const orderItems = 'orderItems' in order ? order.orderItems : ('items' in order ? order.items : []);
        const itemCount = 'orderItems' in order ? order.orderItems.length : ('items' in order ? order.items.length : 0);
        
        return (
          <Card 
            key={orderId} 
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography level="title-md">
                  订单号: {orderId}
                </Typography>
                <Chip
                  variant="soft"
                  size="sm"
                  color={getStatusColor(paymentStatus)}
                  sx={{ fontWeight: 'bold' }}
                >
                  {getStatusText(paymentStatus)}
                </Chip>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid xs={12} md={6}>
                  <Typography level="body-sm" color="neutral">
                    下单时间: {formatDate(createdAt)}
                  </Typography>
                  <Typography level="body-sm" color="neutral" sx={{ mt: 0.5 }}>
                    商品数量: {itemCount} 件
                  </Typography>
                </Grid>
                <Grid xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'primary.500' }}>
                    总计: {formatCurrency(calculateTotal(order), order.currency)}
                  </Typography>
                </Grid>
              </Grid>
              
              {/* 显示部分商品信息 */}
              {itemCount > 0 && (
                <Box sx={{ mb: 2, p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
                  <Typography level="body-sm" sx={{ mb: 1, color: 'neutral.600' }}>
                    商品概览:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {orderItems.slice(0, 3).map((item: any, index: number) => (
                      <Chip 
                        key={index} 
                        size="sm" 
                        variant="outlined"
                        color="neutral"
                      >
                        {item.item?.name || '商品'} x {item.item?.quantity || 1}
                      </Chip>
                    ))}
                    {itemCount > 3 && (
                      <Chip size="sm" variant="soft" color="neutral">+{itemCount - 3}件</Chip>
                    )}
                  </Box>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {paymentStatus === 0 && (
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
                  to={`/orders/${orderId}`}
                  size="sm"
                  variant="outlined"
                  sx={{ minWidth: '80px' }}
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