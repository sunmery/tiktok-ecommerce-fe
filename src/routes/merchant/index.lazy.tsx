import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Typography, Grid, Card, CardContent, List, ListItem, Divider, Button } from '@mui/joy'
import BarChartIcon from '@mui/icons-material/BarChart'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import Skeleton from '@/components/Skeleton'

export const Route = createLazyFileRoute('/merchant/')({ 
  component: MerchantDashboard,
})

function MerchantDashboard() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 检查用户是否为商家，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'merchant') {
      navigate({ to: '/' }).then(() => {
        console.log('非商家用户，已重定向到首页')
      })
    }
    // 模拟加载数据
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [account.role, navigate])

  return (
    <Box sx={{ p: 2 }}>
      {/* 删除了面包屑导航 */}
      
      <Typography level="h2" sx={{ mb: 3 }}>商家控制台</Typography>
      
      {loading ? (
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300} />
          </Grid>
          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Skeleton variant="card" height={300} />
          </Grid>
          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Skeleton variant="card" height={300} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* 产品管理卡片 */}
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">产品管理</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>添加、编辑、删除产品</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>上传产品图片和描述</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>设置价格和库存</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<AddIcon />}
                  onClick={() => navigate({ to: '/merchant/products' }).then(() => {
                    console.log('已跳转到产品管理页面')
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  管理产品
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 订单管理卡片 */}
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">订单管理</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>查看所有订单</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>处理订单状态</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>订单详情查询</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<AddIcon />}
                  onClick={() => navigate({ to: '/merchant/orders' }).then(() => {
                    console.log('已跳转到订单管理页面')
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  管理订单
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 库存管理卡片 */}
          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">库存管理</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>实时监控库存水平</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>设置低库存警报</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>库存调整记录</ListItem>
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    variant="solid" 
                    color="primary" 
                    startDecorator={<InventoryIcon />}
                    onClick={() => navigate({ to: '/merchant/inventory' }).then(() => {
                      console.log('已跳转到库存管理页面')
                    })}
                    fullWidth
                  >
                    库存调整
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => navigate({ to: '/merchant/inventory/monitoring' }).then(() => {
                      console.log('已跳转到库存监控页面')
                    })}
                    fullWidth
                  >
                    实时监控
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="warning" 
                    onClick={() => navigate({ to: '/merchant/inventory/alerts' }).then(() => {
                      console.log('已跳转到库存警报设置页面')
                    })}
                    fullWidth
                  >
                    警报设置
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 销售报告卡片 */}
          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">销售报告</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>生成销售数据分析报告</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>销售趋势图表</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>优化经营策略建议</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<BarChartIcon />}
                  onClick={() => navigate({ to: '/merchant/analytics' }).then(() => {
                    console.log('已跳转到销售报告页面')
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  查看销售报告
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
