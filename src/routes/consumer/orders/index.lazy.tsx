import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Grid, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/joy'
import Pagination from '@/components/Pagination'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { orderService } from '@/api/orderService'
import { Order } from '@/types/orders'
import OrderList from '@/routes/orders/components/OrderList.lazy'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/consumer/orders/')({ 
  component: ConsumerOrders,
})

function ConsumerOrders() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  // 检查用户是否为消费者，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'consumer') {
      navigate({ to: '/' })
    }
  }, [account.role, navigate])

  // 获取订单列表
  const fetchOrders = async (currentPage: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await orderService.listOrder({
        page: currentPage,
        pageSize: pageSize
      })
      
      setOrders(response.orders || [])
      setTotalPages(Math.ceil((response.orders?.length || 0) / pageSize))
    } catch (err) {
      console.error('获取订单列表失败:', err)
      setError('获取订单列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和页码变化时获取订单
  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  // 处理页码变化
  const handlePageChange = (_event: React.MouseEvent | null, value: number) => {
    setCurrentPage(value)
  }

  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
      {/* 面包屑导航 */}
      <Breadcrumbs 
        pathMap={{
          'consumer': '消费者中心',
          'orders': '我的订单'
        }}
      />
      
      <Typography level="h2" sx={{ mb: 3 }}>我的订单</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert color="danger" sx={{ mb: 2 }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography level="body-lg" textAlign="center">
              暂无订单记录
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <OrderList orders={orders} />
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}