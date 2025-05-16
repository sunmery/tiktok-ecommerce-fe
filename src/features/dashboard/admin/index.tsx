import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio/react";
import { userStore } from "@/store/user.ts";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { showMessage } from "@/utils/showMessage.ts";
import { Box, Grid, Typography } from "@mui/joy";
import DashboardCard from "@/components/DashboardCard";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Skeleton from "@/shared/components/Skeleton";

export default function AdminDashboard() {
    const { t } = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // 检查用户是否为管理员，如果不是则重定向到首页
    useEffect(() => {
        const checkAuth = async () => {
            // 等待account数据加载完成（valtio的响应式更新）
            await new Promise(resolve => setTimeout(resolve, 100));

            if (account?.id && account.role) {
                console.log("Valid account:", account)
                if (account.role !== 'admin') {
                    showMessage(t('error.adminAccessOnly'), 'error')
                    navigate({to: '/'}).then(() => {
                        console.log(t('admin.log.enteredHome'))
                    })
                }
            } else {
                // 如果account数据未加载完成，显示加载状态
                setLoading(true)
            }
        }

        checkAuth().finally(() => {
            setLoading(false)
        })


        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [account])

    return (
        <Box sx={{ p: 2 }}>
            <Typography level="h2" sx={{ mb: 3 }}>{t('admin.dashboard.title')}</Typography>
            <Typography level="h4" sx={{ mb: 3 }}>尊敬的管理员 {account.id}, 您好！您可以通过侧栏或者下方按钮操作</Typography>

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
                            cardSx={{mt: 0}}
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
                    {/* 敏感词管理卡片 */}
                    <Grid xs={12} md={6}>
                        <DashboardCard
                            title={t('admin.sensitiveWords.title')}
                            items={[
                                t('admin.sensitiveWords.management'),
                                t('admin.sensitiveWords.configuration'),
                                t('admin.sensitiveWords.monitoring')
                            ]}
                            buttonText={t('admin.sensitiveWords.enter')}
                            icon={<ShoppingCartIcon/>}
                            onClick={() => navigate({to: '/admin/sensitiveWords'}).then(() => {
                                console.log(t('admin.log.enteredSensitiveWords'))
                            })}
                            cardSx={{mt: 3}}
                        />
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}
