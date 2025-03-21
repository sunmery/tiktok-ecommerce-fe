import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Grid, Card, CardContent, List, ListItem, Typography, Divider, Button } from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Skeleton from '@/components/Skeleton'

export const Route = createLazyFileRoute('/consumer/')({ 
  component: ConsumerDashboard,
})

function ConsumerDashboard() {
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 检查用户是否为消费者，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'consumer') {
      navigate({ to: '/' }).then(() => {
        console.log('非消费者用户，已重定向到首页')
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
      
      <Typography level="h2" sx={{ mb: 3 }}>消费者中心</Typography>
      
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
      <Box>
        <Grid container spacing={3}>
          {/* 我的订单卡片 */}
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">我的订单</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <Button 
                      variant="plain" 
                      onClick={() => navigate({ to: '/consumer/orders' }).then(() => {
                        console.log('已跳转到订单历史页面')
                      })}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      查看所有订单历史
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="plain" 
                      onClick={() => navigate({ to: '/consumer/orders' }).then(() => {
                        console.log('已跳转到订单状态页面')
                      })}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      跟踪订单状态
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button 
                      variant="plain" 
                      onClick={() => navigate({ to: '/consumer/orders' }).then(() => {
                        console.log('已跳转到订单详情页面')
                      })}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      订单详情查询
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* 收藏夹卡片 */}
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">我的收藏</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <Typography>查看收藏的商品</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>管理收藏夹</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>收藏商品价格变动提醒</Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      )}
    </Box>
  )
}
