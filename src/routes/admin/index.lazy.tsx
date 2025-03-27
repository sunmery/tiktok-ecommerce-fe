import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Typography, Grid, Card, CardContent, List, ListItem, Divider, Button } from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import StorageIcon from '@mui/icons-material/Storage'
import MapIcon from '@mui/icons-material/Map'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Breadcrumbs from '@/components/Breadcrumbs'
import Skeleton from '@/components/Skeleton'

export const Route = createLazyFileRoute('/admin/')({ 
  component: AdminDashboard,
})

function AdminDashboard() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' }).then(() => {
        // 跳转完成后的回调逻辑
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
      
      <Typography level="h2" sx={{ mb: 3 }}>管理员控制台</Typography>
      
      {loading ? (
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300} />
          </Grid>
        </Grid>
      ) : (
      
      <Grid container spacing={3}>
        {/* 用户管理卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">用户管理</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>管理所有消费者和商家账户</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>添加、编辑、删除用户</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>审批商家申请</ListItem>
                </ListItem>
              </List>
              <Button 
                variant="solid" 
                color="primary" 
                startDecorator={<PeopleAltIcon />}
                onClick={() => navigate({ to: '/admin/users' }).then(() => {
                  console.log('已进入用户管理页面')
                })}
                fullWidth
                sx={{ mt: 2 }}
              >
                进入用户管理
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 报告与分析卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">报告与分析</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>平台整体销售数据</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>用户行为分析</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>平台性能报告</ListItem>
                </ListItem>
              </List>
              <Button 
                variant="solid" 
                color="primary" 
                startDecorator={<BarChartIcon />}
                onClick={() => navigate({ to: '/admin/analytics' }).then(() => {
                  console.log('已进入数据分析页面')
                })}
                fullWidth
                sx={{ mt: 2 }}
              >
                查看数据分析
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* 商品管理卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">商品管理</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>查看所有商品</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>审核商家待审核商品</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>下架违规商品</ListItem>
                </ListItem>
              </List>
              <Button 
                variant="solid" 
                color="primary" 
                startDecorator={<ShoppingCartIcon />}
                onClick={() => navigate({ to: '/admin/products' }).then(() => {
                  console.log('已进入商品管理页面')
                })}
                fullWidth
                sx={{ mt: 2 }}
              >
                进入商品管理
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 数据库管理卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">数据库管理</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>查看数据库表结构</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>浏览表数据</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>执行SQL查询</ListItem>
                </ListItem>
              </List>
              <Button 
                variant="solid" 
                color="primary" 
                startDecorator={<StorageIcon />}
                onClick={() => navigate({ to: '/admin/database' }).then(() => {
                  console.log('已进入数据库管理页面')
                })}
                fullWidth
                sx={{ mt: 2 }}
              >
                进入数据库管理
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
    </Box>
  )
}
