import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Card, CardContent, Typography, Alert } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import { useTranslation } from 'react-i18next'
import LogisticsMap from '@/components/LogisticsMap'
import { Coordinates } from '@/types/logisticsMap'

export const Route = createLazyFileRoute('/consumer/map/')({ 
  component: ConsumerMapView,
})

function ConsumerMapView() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  
  // 示例坐标 - 实际应用中应从API获取或通过props传入
  const [sellerPosition, setSellerPosition] = useState<Coordinates>([39.9042, 116.4074]) // 北京
  const [userPosition, setUserPosition] = useState<Coordinates>([31.2304, 121.4737]) // 上海
  
  // 检查用户是否为消费者，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'consumer') {
      navigate({ to: '/' }).then(() => {
        console.log('非消费者用户，已重定向到首页')
      })
    }
  }, [account.role, navigate])
  
  // 模拟获取物流信息
  useEffect(() => {
    // 这里可以添加实际的API调用来获取物流信息
    // 例如：fetchLogisticsInfo().then(data => {
    //   setSellerPosition(data.sellerPosition);
    //   setUserPosition(data.userPosition);
    // }).catch(err => setError(err.message));
  }, [])
  
  const handleDeliveryComplete = () => {
    console.log('配送完成')
    // 可以添加其他逻辑，如通知用户或更新状态
  }
  
  return (
    <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
      <Button
        startDecorator={<ArrowBackIcon />}
        variant="plain"
        onClick={() => navigate({ to: '/consumer' }).then(() => {
          console.log('已返回消费者首页')
        })}
        sx={{ mb: 2 }}
      >
        {t('consumer.backToDashboard')}
      </Button>
      
      {/* 面包屑导航 */}
      <Breadcrumbs
        pathMap={{
          'consumer': t('consumer.dashboard.title'),
          'map': '物流地图'
        }}
      />
      
      <Typography level="h2" sx={{ mb: 3 }}>物流地图</Typography>
      
      {error ? (
        <Alert color="danger" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography level="title-lg" sx={{ mb: 2 }}>实时物流跟踪</Typography>
            <Box sx={{ height: '500px', width: '100%' }}>
              <LogisticsMap
                sellerPosition={sellerPosition}
                userPosition={userPosition}
                onDeliveryComplete={handleDeliveryComplete}
              />
            </Box>
            <Typography level="body-sm" sx={{ mt: 2, color: 'neutral.500' }}>
              注：地图显示的是物流配送路线，从商家位置到收货地址。
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
