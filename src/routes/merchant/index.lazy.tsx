import { createLazyFileRoute } from '@tanstack/react-router'
import { Box, Typography, Grid, Card, CardContent, List, ListItem, Divider, Button } from '@mui/joy'
import BarChartIcon from '@mui/icons-material/BarChart'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Skeleton from '@/components/Skeleton'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/merchant/')({ 
  component: MerchantDashboard,
})

function MerchantDashboard() {
  const { t, i18n } = useTranslation('merchant')
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        await i18n.loadNamespaces('merchant');
        console.log('商家命名空间加载成功');
      } catch (err) {
        console.error('加载商家命名空间失败:', err);
      }
    };

    if (!i18n.hasResourceBundle(i18n.language, 'merchant')) {
      loadTranslations().then((r) => {
        console.log('商家命名空间加载完成',r)
      });
    }
  }, [i18n]);

  useEffect(() => {
    if (account.role !== 'merchant') {
      navigate({ to: '/' }).then(() => {
        console.log(t('log.redirectedNonMerchant'))
      })
    }
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [account.role, navigate, t])

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h2" sx={{ mb: 3 }}>{t('merchant.dashboard')}</Typography>
      
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
          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">{t('merchant.productManagement')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>{t('merchant.productFeatures.addEditDelete')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.productFeatures.uploadImages')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.productFeatures.setPriceStock')}</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<AddIcon />}
                  onClick={() => navigate({ to: '/merchant/products' }).then(() => {
                    console.log(t('merchant.log.navigatedToProducts'))
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {t('merchant.manageProducts')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">{t('merchant.orderManagement')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>{t('merchant.orderFeatures.viewAll')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.orderFeatures.processStatus')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.orderFeatures.orderDetails')}</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<AddIcon />}
                  onClick={() => navigate({ to: '/merchant/orders' }).then(() => {
                    console.log(t('merchant.log.navigatedToOrders'))
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {t('merchant.manageOrders')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">{t('merchant.inventoryManagement')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>{t('merchant.inventoryFeatures.monitor')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.inventoryFeatures.alerts')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.inventoryFeatures.adjustments')}</ListItem>
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    variant="solid" 
                    color="primary" 
                    startDecorator={<InventoryIcon />}
                    onClick={() => navigate({ to: '/merchant/inventory' }).then(() => {
                      console.log(t('merchant.log.navigatedToInventory'))
                    })}
                    fullWidth
                  >
                    {t('merchant.adjustInventory')}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => navigate({ to: '/merchant/inventory/monitoring' }).then(() => {
                      console.log(t('merchant.log.navigatedToInventoryMonitoring'))
                    })}
                    fullWidth
                  >
                    {t('merchant.realTimeMonitoring')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="warning" 
                    onClick={() => navigate({ to: '/merchant/inventory/alerts' }).then(() => {
                      console.log(t('merchant.log.navigatedToInventoryAlerts'))
                    })}
                    fullWidth
                  >
                    {t('merchant.alertSettings')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={6} sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="h3">{t('merchant.salesReports')}</Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem>
                    <ListItem>{t('merchant.reportFeatures.generateReports')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.reportFeatures.trends')}</ListItem>
                  </ListItem>
                  <ListItem>
                    <ListItem>{t('merchant.reportFeatures.strategies')}</ListItem>
                  </ListItem>
                </List>
                <Button 
                  variant="solid" 
                  color="primary" 
                  startDecorator={<BarChartIcon />}
                  onClick={() => navigate({ to: '/merchant/analytics' }).then(() => {
                    console.log(t('merchant.log.navigatedToAnalytics'))
                  })}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {t('merchant.viewReports')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
