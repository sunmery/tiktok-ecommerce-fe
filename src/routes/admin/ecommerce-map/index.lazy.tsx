import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Select,
  Option,
  Grid
} from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import ChinaEcommerceMap from '@/components/ChinaEcommerceMap'

export const Route = createLazyFileRoute('/admin/ecommerce-map/')({ 
  component: EcommerceMapDashboard,
})

function EcommerceMapDashboard() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('weekly')
  
  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' }).then(() => {
        // 跳转完成后的回调逻辑
      })
    }
  }, [account.role, navigate])

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h2" sx={{ mb: 3 }}>电子商务地图分析</Typography>
      
      <Grid container spacing={2}>
        <Grid xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>筛选条件</Typography>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>时间范围</FormLabel>
                <Select 
                  value={timeRange} 
                  onChange={(_, value) => value && setTimeRange(value)}
                >
                  <Option value="daily">日视图</Option>
                  <Option value="weekly">周视图</Option>
                  <Option value="monthly">月视图</Option>
                  <Option value="yearly">年视图</Option>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} md={9}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>销售地理分布</Typography>
              <Box sx={{ height: 500 }}>
                <ChinaEcommerceMap height="100%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}