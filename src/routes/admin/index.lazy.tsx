import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {Box, Grid, Typography} from '@mui/joy'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {useEffect, useState} from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Skeleton from '@/components/Skeleton'
import {useTranslation} from 'react-i18next'
import DashboardCard from '@/components/DashboardCard'

export const Route = createLazyFileRoute('/admin/')({
    component: AdminDashboard,
})

function AdminDashboard() {
  const { t } = useTranslation()
  const {account} = useSnapshot(userStore)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({to: '/'}).then(() => {
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
      <Typography level="h2" sx={{ mb: 3 }}>{t('admin.dashboard.title')}</Typography>

      {loading ? (
        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300}/>
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="card" height={300}/>
          </Grid>
        </Grid>
      ) : (

        <Grid container spacing={4}>
          {/* 用户管理卡片 */}
          <Grid xs={12} md={6}>
            <DashboardCard
              title={t('admin.dashboard.userManagement')}
              items={[
                t('admin.dashboard.userManagement.addEditDelete'),
                t('admin.dashboard.userManagement.manageRoles'),
                t('admin.dashboard.userManagement.merchantApproval')
              ]}
              buttonText={t('admin.dashboard.enterUserManagement')}
              icon={<PeopleAltIcon/>}
              onClick={() => navigate({to: '/admin/users'}).then(() => {
                console.log(t('admin.log.enteredUserManagement'))
              })}
            />
          </Grid>

          {/* 报告与分析卡片 */}
          <Grid xs={12} md={6}>
            <DashboardCard
              title={t('admin.reports')}
              items={[
                t('admin.reports.platformSales'),
                t('admin.reports.userBehavior'),
                t('admin.reports.performance')
              ]}
              buttonText={t('admin.viewDataAnalytics')}
              icon={<BarChartIcon/>}
              onClick={() => navigate({to: '/admin/analytics'}).then(() => {
                console.log(t('admin.log.enteredAnalytics'))
              })}
              cardSx={{mb: 2}}
              contentSx={{p: 3}}
            />
          </Grid>

          {/* 用户充值卡片 */}
          <Grid xs={12} md={6}>
            <DashboardCard
              title={t('admin.rechargeBalance.title')}
              items={[
                t('admin.rechargeBalance.userRecharge'),
                t('admin.rechargeBalance.viewTransactions'),
                t('admin.rechargeBalance.manageBalance')
              ]}
              buttonText={t('admin.enterRechargeBalance')}
              icon={<AccountBalanceWalletIcon/>}
              onClick={() => navigate({to: '/admin/rechargeBalance'}).then(() => {
                console.log(t('admin.log.enteredRechargeBalance'))
              })}
              cardSx={{mt: 3}}
            />
          </Grid>

          {/* 商品管理卡片 */}
          <Grid xs={12} md={6}>
            <DashboardCard
              title={t('admin.productManagement')}
              items={[
                t('admin.productManagement.viewAll'),
                t('admin.productManagement.approvalPending'),
                t('admin.productManagement.delisted')
              ]}
              buttonText={t('admin.enterProductManagement')}
              icon={<ShoppingCartIcon/>}
              onClick={() => navigate({to: '/admin/products'}).then(() => {
                console.log(t('admin.log.enteredProductManagement'))
              })}
              cardSx={{mt: 3}}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
