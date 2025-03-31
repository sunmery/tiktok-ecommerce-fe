import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Typography, Grid, Card, CardContent, List, ListItem, Divider, Button } from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import StorageIcon from '@mui/icons-material/Storage'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Skeleton from '@/components/Skeleton'
import { useTranslation } from 'react-i18next';

export const Route = createLazyFileRoute('/admin/')({ 
  component: AdminDashboard,
})

function AdminDashboard() {
  const { t } = useTranslation()
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' }).then(() => {
        console.log(t('admin.log.redirectedNonAdmin'))
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
      
      <Typography level="h2" sx={{ mb: 3 }}>{t('admin.dashboard')}</Typography>
      
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
              <Typography level="h3">{t('admin.userManagement')}</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>{t('admin.userManagement.addEditDelete')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.userManagement.manageRoles')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.userManagement.merchantApproval')}</ListItem>
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
                {t('admin.enterUserManagement')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 报告与分析卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">{t('admin.reports')}</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>{t('admin.reports.platformSales')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.reports.userBehavior')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.reports.performance')}</ListItem>
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
                {t('admin.viewDataAnalytics')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* 商品管理卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">{t('admin.productManagement')}</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>{t('admin.productManagement.viewAll')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.productManagement.approvalPending')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.productManagement.delisted')}</ListItem>
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
                {t('admin.enterProductManagement')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 数据库管理卡片 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography level="h3">{t('admin.databaseManagement')}</Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem>
                  <ListItem>{t('admin.databaseManagement.schema')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.databaseManagement.tables')}</ListItem>
                </ListItem>
                <ListItem>
                  <ListItem>{t('admin.databaseManagement.query')}</ListItem>
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
                {t('admin.enterDatabaseManagement')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
    </Box>
  )
}
