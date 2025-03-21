import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography, Table, Sheet, Modal, FormControl, FormLabel, Select, Option, Snackbar, Alert } from '@mui/joy'
import { Order } from '@/types/orders'
import { PaymentStatus } from '@/types/orders'
import { orderService } from '@/api/orderService'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/merchant/orders/')({ 
  component: Orders,
})

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      // 添加示例数据
      const mockOrders = [
        {
          orderId: 'ORD20240301001',
          userId: 'USR001',
          createdAt: new Date().toISOString(),
          paymentStatus: PaymentStatus.paid,
          currency: 'CNY',
          items: [
            {
              id: 'ITEM001',
              name: '高级蓝牙耳机',
              price: 299,
              quantity: 2
            },
            {
              id: 'ITEM002',
              name: '无线充电器',
              price: 129,
              quantity: 1
            }
          ],
          address: {
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            detail: '科技园路1号'
          }
        },
        {
          orderId: 'ORD20240301002',
          userId: 'USR002',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.processing,
          currency: 'CNY',
          items: [
            {
              id: 'ITEM003',
              name: '智能手表',
              price: 1299,
              quantity: 1
            }
          ],
          address: {
            province: '浙江省',
            city: '杭州市',
            district: '西湖区',
            detail: '文三路100号'
          }
        },
        {
          orderId: 'ORD20240301003',
          userId: 'USR003',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.notPaid,
          currency: 'CNY',
          items: [
            {
              id: 'ITEM004',
              name: '机械键盘',
              price: 499,
              quantity: 1
            },
            {
              id: 'ITEM005',
              name: '游戏鼠标',
              price: 299,
              quantity: 1
            }
          ],
          address: {
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            detail: '建国路88号'
          }
        },
        {
          orderId: 'ORD20240301004',
          userId: 'USR004',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.paid,
          currency: 'CNY',
          items: [
            {
              id: 'ITEM006',
              name: '显示器',
              price: 1499,
              quantity: 1
            }
          ],
          address: {
            province: '上海市',
            city: '上海市',
            district: '浦东新区',
            detail: '张江高科技园区'
          }
        },
        {
          orderId: 'ORD20240301005',
          userId: 'USR005',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.processing,
          currency: 'CNY',
          items: [
            {
              id: 'ITEM007',
              name: '游戏主机',
              price: 3999,
              quantity: 1
            }
          ],
          address: {
            province: '四川省',
            city: '成都市',
            district: '武侯区',
            detail: '天府大道999号'
          }
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('加载订单失败:', error)
      setSnackbar({
        open: true,
        message: '加载订单失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, status: PaymentStatus) => {
    try {
      setLoading(true)
      if (status === PaymentStatus.paid) {
        await orderService.markOrderPaid({ orderId: orderId })
      } else {
        // 使用新的API更新订单状态
        await orderService.updateOrderStatus(orderId, status)
      }
      
      setSnackbar({
        open: true,
        message: '订单状态更新成功',
        severity: 'success'
      })
      loadOrders() // 重新加载订单列表
    } catch (error) {
      console.error('更新订单状态失败:', error)
      setSnackbar({
        open: true,
        message: '更新订单状态失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* 面包屑导航 */}
      <Breadcrumbs pathMap={{ 'orders': '订单管理' }} />
      
      <Typography level="h2" sx={{ mb: 2 }}>订单管理</Typography>

      <Sheet>
        <Table>
          <thead>
            <tr>
              <th>订单ID</th>
              <th>用户ID</th>
              <th>创建时间</th>
              <th>支付状态</th>
              <th>总金额</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.userId}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <FormControl size="sm">
                    <Select
                      value={order.paymentStatus}
                      onChange={(_, value) => handleStatusChange(order.orderId, value as PaymentStatus)}
                    >
                      {Object.values(PaymentStatus).map((status) => (
                        <Option key={status} value={status}>
                          {status === PaymentStatus.notPaid ? '未支付' :
                           status === PaymentStatus.processing ? '处理中' :
                           status === PaymentStatus.paid ? '已支付' :
                           status === PaymentStatus.failed ? '支付失败' :
                           status === PaymentStatus.cancelled ? '已取消' : status}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                </td>
                <td>
                  {order.items.reduce((total, item) => total + item.price * item.quantity, 0)}
                  {order.currency}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(order)
                      setDetailOpen(true)
                    }}
                  >
                    查看详情
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 600, mx: 2 }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 2 }}>订单详情</Typography>
            {selectedOrder && (
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <Typography level="body-sm">订单ID:</Typography>
                  <Typography>{selectedOrder.orderId}</Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography level="body-sm">用户ID:</Typography>
                  <Typography>{selectedOrder.userId}</Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography level="body-sm">创建时间:</Typography>
                  <Typography>{formatDate(selectedOrder.createdAt)}</Typography>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography level="body-sm">支付状态:</Typography>
                  <Typography>{selectedOrder.paymentStatus}</Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography level="body-sm">收货地址:</Typography>
                  <Typography>
                    {`${selectedOrder.address.province} ${selectedOrder.address.city} ${selectedOrder.address.district} ${selectedOrder.address.detail}`}
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography level="body-sm" sx={{ mb: 1 }}>订单商品:</Typography>
                  <Sheet>
                    <Table>
                      <thead>
                        <tr>
                          <th>商品名称</th>
                          <th>单价</th>
                          <th>数量</th>
                          <th>小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Sheet>
                </Grid>
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Typography level="h4">
                    总计: {selectedOrder.items.reduce((total, item) => total + item.price * item.quantity, 0)}
                    {selectedOrder.currency}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setDetailOpen(false)}
              >
                关闭
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Modal>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          color={snackbar.severity}
          variant="soft"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}