import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/joy'
// import { useTranslation } from 'react-i18next'
import LogisticsMap from '@/components/LogisticsMap'
import { showMessage } from '@/utils/showMessage'
import {Timeline} from "@mui/icons-material";

interface ShippingUpdate {
  location: string
  status: string
  timestamp: string
  description: string
}

interface Order {
  id: number
  orderId: string
  shippingStatus: string
  shippingInfo: {
    trackingNumber: string
    carrier: string
    estimatedDelivery: string
    updates: ShippingUpdate[]
  }
  sellerAddress: {
    latitude: number
    longitude: number
  }
  userAddress: {
    latitude: number
    longitude: number
  }
}

export const Route = createLazyFileRoute('/consumer/logistics/')({ component: LogisticsTracking })

function LogisticsTracking() {
  // const { t } = useTranslation()
  const [order, setOrder] = useState<Order | null>(null)

  // 获取订单物流信息
  useEffect(() => {
    const fetchOrderLogistics = async () => {
      try {
        // 调用获取物流信息API
        const response = await fetch('/api/orders/123/logistics')
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error('获取物流信息失败:', error)
        showMessage('获取物流信息失败', 'error')
      }
    }
    fetchOrderLogistics()
  }, [])

  // 确认收货
  const confirmReceived = async () => {
    if (!order) return

    try {
      await fetch(`/api/orders/${order.orderId}/receive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      showMessage('确认收货成功', 'success')
      // 刷新订单信息
      // fetchOrderLogistics()
    } catch (error) {
      console.error('确认收货失败:', error)
      showMessage('确认收货失败', 'error')
    }
  }

  if (!order) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>加载中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        物流跟踪
      </Typography>

      <Stack spacing={3}>
        {/* 物流地图 */}
        <Card>
          <CardContent>
            <LogisticsMap
              sellerPosition={[order.sellerAddress.latitude, order.sellerAddress.longitude]}
              userPosition={[order.userAddress.latitude, order.userAddress.longitude]}
              onDeliveryComplete={() => {}}
            />
          </CardContent>
        </Card>

        {/* 物流信息 */}
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography >物流详情</Typography>
              
              <Stack direction="row" spacing={2}>
                <Typography>物流单号：{order.shippingInfo.trackingNumber}</Typography>
                <Typography>承运商：{order.shippingInfo.carrier}</Typography>
              </Stack>

              <Typography>预计送达：{order.shippingInfo.estimatedDelivery}</Typography>

              {/* 物流时间轴 */}
              <Timeline>
                {order.shippingInfo.updates.map((update, index) => (
                  <Timeline key={index}>
                    <Typography fontSize="sm">{update.timestamp}</Typography>
                    <Typography fontSize="sm" sx={{ mt: 0.5 }}>
                      {update.location} - {update.status}
                    </Typography>
                    <Typography level="body-sm" sx={{ mt: 0.5 }}>
                      {update.description}
                    </Typography>
                  </Timeline>
                ))}
              </Timeline>

              {/* 确认收货按钮 */}
              {order.shippingStatus === 'DELIVERED' && (
                <Button
                  variant="solid"
                  color="primary"
                  onClick={confirmReceived}
                  sx={{ alignSelf: 'flex-end' }}
                >
                  确认收货
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
