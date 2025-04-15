import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {Box, Card, CardContent, FormControl, FormLabel, Grid, Option, Select, Typography} from '@mui/joy'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import ChinaEcommerceMap from '@/components/ChinaEcommerceMap'
import {useTranslation} from 'react-i18next'

export const Route = createLazyFileRoute('/admin/ecommerce-map/')({
    component: EcommerceMapDashboard,
})

function EcommerceMapDashboard() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [timeRange, setTimeRange] = useState('weekly')

    // 检查用户是否为管理员，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'admin') {
            navigate({to: '/'}).then(() => {
                // 跳转完成后的回调逻辑
            })
        }
    }, [account.role, navigate])

    return (
        <Box sx={{p: 2}}>
            <Typography level="h2" sx={{mb: 3}}>{t('admin.ecommerce.title')}</Typography>

            <Grid container spacing={2}>
                <Grid xs={12} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h3" sx={{mb: 2}}>{t('admin.ecommerce.filters')}</Typography>

                            <FormControl sx={{mb: 2}}>
                                <FormLabel>{t('admin.ecommerce.timeRange')}</FormLabel>
                                <Select
                                    value={timeRange}
                                    onChange={(_, value) => value && setTimeRange(value)}
                                >
                                    <Option value="daily">{t('admin.ecommerce.daily')}</Option>
                                    <Option value="weekly">{t('admin.ecommerce.weekly')}</Option>
                                    <Option value="monthly">{t('admin.ecommerce.monthly')}</Option>
                                    <Option value="yearly">{t('admin.ecommerce.yearly')}</Option>
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={9}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h3" sx={{mb: 2}}>{t('admin.ecommerce.salesDistribution')}</Typography>
                            <Box sx={{height: 500}}>
                                <ChinaEcommerceMap height="100%"/>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
