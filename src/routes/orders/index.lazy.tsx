import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Divider, Sheet, Stack } from '@mui/joy'
import Pagination from '@/components/Pagination'
import OrderList from './components/OrderList.lazy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useOrderList } from '@/hooks/useOrder'

export const Route = createLazyFileRoute('/orders/')({ 
  component: Orders,
})

function Orders() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { account } = useSnapshot(userStore)

  // 使用useOrderList钩子获取订单列表
  const { 
    data, 
    isLoading: loading, 
    error: queryError 
  } = useOrderList({ 
    page: page - 1, // API从0开始计数，UI从1开始计数
    pageSize: pageSize 
  })

  // 计算总页数
  const totalPages = data && data.orders ? Math.ceil(data.orders.length / pageSize) : 1

  // 处理分页变化
  const handlePageChange = (_event: React.SyntheticEvent, value: number) => {
    setPage(value)
  }

  // 处理错误信息
  const error = queryError ? (queryError as Error).message : ''

  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
      {/* 面包屑导航 */}
      <Breadcrumbs pathMap={{ 'orders': '我的订单' }} />
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="h2" sx={{ mb: 2 }}>我的订单</Typography>
          <Divider sx={{ mb: 2 }} />
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size="lg" />
            </Box>
          ) : error ? (
            <Alert color="danger" sx={{ mb: 2 }}>{error}</Alert>
          ) : !data?.orders || data.orders.length === 0 ? (
            <Sheet variant="soft" color="neutral" sx={{ p: 4, borderRadius: 'md', textAlign: 'center' }}>
              <Typography level="body-lg">暂无订单记录</Typography>
              <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.500' }}>您的订单将在此处显示</Typography>
            </Sheet>
          ) : (
            <>
              <Stack spacing={2}>
                <OrderList orders={data.orders} />
              </Stack>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    size="md"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
