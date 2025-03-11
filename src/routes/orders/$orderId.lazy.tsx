import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert, Button, Card, CardContent, Chip, Divider, Grid, Stack } from '@mui/joy'
import { Order, PaymentStatus } from '@/types/order'
import { formatCurrency } from '@/utils/format'
import { useNavigate } from '@tanstack/react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/orders/$orderId')({ 
  component: OrderDetail,
})

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
  switch (status) {
    case PaymentStatus.NOT_PAID:
      return 'warning'
    case PaymentStatus.PROCESSING:
      return 'primary'
    case PaymentStatus.PAID:
      return 'success'
    case PaymentStatus.FAILED:
      return 'danger'
    case PaymentStatus.CANCELLED:
      return 'neutral'
    default:
      return 'neutral'
  }
}

// 获取状态文本
const getStatusText = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.NOT_PAID:
      return '待支付'
    case PaymentStatus.PROCESSING:
      return '处理中'
    case PaymentStatus.PAID:
      return '已支付'
    case PaymentStatus.FAILED:
      return '支付失败'
    case PaymentStatus.CANCELLED:
      return '已取消'
    default:
      return '未知状态'
  }
}

function OrderDetail() {
  const { orderId } = useParams({ from: '/orders/$orderId' })
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true)
      setError('')
      try {
        // 这里应该调用获取订单详情的API
        // 由于当前API中没有获取单个订单的方法，这里模拟从订单列表中获取
        const response = await fetch(`/api/orders/${orderId}`)
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error('获取订单详情失败:', err)
        setError('获取订单详情失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetail()
    }
  }, [orderId])

  // 计算订单总金额
  const calculateTotal = (order: Order) => {
    return order.order_items.reduce((total, item) => {
      return total + (item.cost || 0)
    }, 0)
  }

  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
      <Button
        startDecorator={<ArrowBackIcon />}
        variant="plain"
        onClick={() => navigate({ to: '/orders' })}
        sx={{ mb: 2 }}
      >
        返回订单列表
      </Button>

      {/* 面包屑导航 */}
      <Breadcrumbs 
        pathMap={{
          'orders': '我的订单',
          [orderId || '']: '订单详情'
        }}
      />

      <Typography level="h2" sx={{ mb: 3 }}>订单详情</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert color="danger" sx={{ mb: 2 }}>{error}</Alert>
      ) : !order ? (
        <Alert color="warning" sx={{ mb: 2 }}>未找到订单信息</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* 订单基本信息 */}
          <Grid xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography level="title-lg">订单号: {order.order_id}</Typography>
                  <Chip
                    variant="soft"
                    size="md"
                    color={getStatusColor(order.payment_status)}
                  >
                    {getStatusText(order.payment_status)}
                  </Chip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <Typography level="body-md">创建时间: {formatDate(order.created_at)}</Typography>
                    <Typography level="body-md">用户ID: {order.user_id}</Typography>
                    <Typography level="body-md">联系邮箱: {order.email}</Typography>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography level="title-sm" sx={{ mb: 1 }}>收货地址:</Typography>
                    <Typography level="body-md">
                      {order.address.street_address}, {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zip_code}
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
                <Typography level="title-lg" sx={{ mb: 2 }}>商品列表</Typography>
                <Divider sx={{ my: 2 }} />
                
                {order.order_items.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid xs={2} sm={1}>
                        {item.item.picture && (
                          <Box
                            component="img"
                            src={item.item.picture}
                            alt={item.item.name}
                            sx={{ width: '100%', maxWidth: 60, borderRadius: 'sm' }}
                          />
                        )}
                      </Grid>
                      <Grid xs={6} sm={7}>
                        <Typography level="title-sm">{item.item.name}</Typography>
                        <Typography level="body-sm" color="neutral">
                          单价: {formatCurrency(item.cost / item.item.quantity, order.currency)}
                        </Typography>
                      </Grid>
                      <Grid xs={2} sm={2} sx={{ textAlign: 'center' }}>
                        <Typography level="body-md">x {item.item.quantity}</Typography>
                      </Grid>
                      <Grid xs={2} sm={2} sx={{ textAlign: 'right' }}>
                        <Typography level="body-md">
                          {formatCurrency(item.cost, order.currency)}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < order.order_items.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography level="title-lg">
                    总计: {formatCurrency(calculateTotal(order), order.currency)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}