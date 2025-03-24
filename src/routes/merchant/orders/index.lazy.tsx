import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography, Table, Sheet, Modal, FormControl, FormLabel, Select, Option, Snackbar, Alert, IconButton } from '@mui/joy'
import { Order } from '@/types/orders'
import { PaymentStatus } from '@/types/orders'
import { orderService } from '@/api/orderService'
import Breadcrumbs from '@/components/Breadcrumbs'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const Route = createLazyFileRoute('/merchant/orders/')({ 
  component: Orders,
})

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'danger';
  }>({
    open: false,
    message: '',
    severity: 'success'
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
          paymentStatus: PaymentStatus.Paid,
          currency: 'CNY',
          email: 'user1@example.com',
          items: [
            {
              id: 'ITEM001',
              name: '智能手机',
              price: 4999,
              quantity: 1,
              item: {
                productId: 'PROD001',
                merchantId: 'MERCH001',
                quantity: 1,
                name: '智能手机',
                picture: 'https://example.com/phone.jpg',
                price: 4999
              },
              cost: 4999
            },
            {
              id: 'ITEM002',
              name: '手机壳',
              price: 99,
              quantity: 1,
              item: {
                productId: 'PROD002',
                merchantId: 'MERCH001',
                quantity: 1,
                name: '手机壳',
                picture: 'https://example.com/case.jpg',
                price: 99
              },
              cost: 99
            }
          ],
          address: {
            id: 1,
            userId: 'USR001',
            streetAddress: '科技园路1号',
            city: '深圳市',
            state: '广东省',
            country: '中国',
            zipCode: '518000',
            province: '广东省',
            district: '南山区',
            detail: '科技园路1号'
          }
        },
        {
          orderId: 'ORD20240301002',
          userId: 'USR002',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.Processing,
          currency: 'CNY',
          email: 'user2@example.com',
          items: [
            {
              id: 'ITEM003',
              name: '智能手表',
              price: 1299,
              quantity: 1,
              item: {
                productId: 'PROD003',
                merchantId: 'MERCH002',
                quantity: 1,
                name: '智能手表',
                picture: 'https://example.com/watch.jpg',
                price: 1299
              },
              cost: 1299
            }
          ],
          address: {
            id: 2,
            userId: 'USR002',
            streetAddress: '文三路100号',
            city: '杭州市',
            state: '浙江省',
            country: '中国',
            zipCode: '310012',
            province: '浙江省',
            district: '西湖区',
            detail: '文三路100号'
          }
        },
        {
          orderId: 'ORD20240301003',
          userId: 'USR003',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.NotPaid,
          currency: 'CNY',
          email: 'user3@example.com',
          items: [
            {
              id: 'ITEM004',
              name: '机械键盘',
              price: 499,
              quantity: 1,
              item: {
                productId: 'PROD004',
                merchantId: 'MERCH003',
                quantity: 1,
                name: '机械键盘',
                picture: 'https://example.com/keyboard.jpg',
                price: 499
              },
              cost: 499
            },
            {
              id: 'ITEM005',
              name: '游戏鼠标',
              price: 299,
              quantity: 1,
              item: {
                productId: 'PROD005',
                merchantId: 'MERCH003',
                quantity: 1,
                name: '游戏鼠标',
                picture: 'https://example.com/mouse.jpg',
                price: 299
              },
              cost: 299
            }
          ],
          address: {
            id: 3,
            userId: 'USR003',
            streetAddress: '建国路88号',
            city: '北京市',
            state: '北京市',
            country: '中国',
            zipCode: '100010',
            province: '北京市',
            district: '朝阳区',
            detail: '建国路88号'
          }
        },
        {
          orderId: 'ORD20240301004',
          userId: 'USR004',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.Paid,
          currency: 'CNY',
          email: 'user4@example.com',
          items: [
            {
              id: 'ITEM006',
              name: '显示器',
              price: 1499,
              quantity: 1,
              item: {
                productId: 'PROD006',
                merchantId: 'MERCH004',
                quantity: 1,
                name: '显示器',
                picture: 'https://example.com/monitor.jpg',
                price: 1499
              },
              cost: 1499
            }
          ],
          address: {
            id: 4,
            userId: 'USR004',
            streetAddress: '张江高科技园区',
            city: '上海市',
            state: '上海市',
            country: '中国',
            zipCode: '201203',
            province: '上海市',
            district: '浦东新区',
            detail: '张江高科技园区'
          }
        },
        {
          orderId: 'ORD20240301005',
          userId: 'USR005',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          paymentStatus: PaymentStatus.Processing,
          currency: 'CNY',
          email: 'user5@example.com',
          items: [
            {
              id: 'ITEM007',
              name: '游戏主机',
              price: 3999,
              quantity: 1,
              item: {
                productId: 'PROD007',
                merchantId: 'MERCH005',
                quantity: 1,
                name: '游戏主机',
                picture: 'https://example.com/console.jpg',
                price: 3999
              },
              cost: 3999
            }
          ],
          address: {
            id: 5,
            userId: 'USR005',
            streetAddress: '天府大道999号',
            city: '成都市',
            state: '四川省',
            country: '中国',
            zipCode: '610041',
            province: '四川省',
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
        severity: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, status: PaymentStatus) => {
    try {
      setLoading(true)
      if (status === PaymentStatus.Paid) {
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
        severity: 'danger'
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
                          {status === PaymentStatus.NotPaid ? '未支付' :
                           status === PaymentStatus.Processing ? '处理中' :
                           status === PaymentStatus.Paid ? '已支付' :
                           status === PaymentStatus.Failed ? '支付失败' :
                           status === PaymentStatus.Cancelled ? '已取消' : status}
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
      {snackbar.open && (
        <Snackbar open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert
            color={snackbar.severity === 'danger' ? 'danger' : 'success'}
            variant="soft"
            endDecorator={
              <IconButton variant="soft" size="sm" color={snackbar.severity === 'danger' ? 'danger' : 'success'} onClick={() => setSnackbar({ ...snackbar, open: false })}>
                <CloseRoundedIcon />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}