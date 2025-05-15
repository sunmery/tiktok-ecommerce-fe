import { useNavigate } from '@tanstack/react-router'
import { Box, Button, Card, CardContent, Divider, Grid, List, ListItem, Typography } from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next"
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";
import { Order } from './orders/type'
import Skeleton from "@/shared/components/Skeleton";

/**
 * 消费者仪表板组件
 * @returns Element
 */
export default function ConsumerDashboard() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [, setRecentOrders] = useState<Order[]>([])

    // 检查用户是否为消费者，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'consumer') {
            navigate({to: '/'}).then(() => {
                console.log('非消费者用户，已重定向到首页')
            })
        }

        // 加载最近订单
        loadRecentOrders().then(() => {
            setLoading(false)
        }).catch(error => {
            console.error('加载最近订单失败:', error)
            setLoading(false)
        })
    }, [account.role, navigate])

    // 加载最近订单
    const loadRecentOrders = async () => {
        try {
            // 调用API获取订单列表
            const response = await orderService.getOrder({
                // userId: '', // 留空，API会使用当前登录用户的ID
                page: 1,
                pageSize: 3 // 只获取最近的3个订单
            })

            if (response && response.orders) {
                setRecentOrders(response.orders)
            }
        } catch (error) {
            console.error('获取最近订单失败:', error)
        }
    }

    return (
        <Box sx={{p: 2}}>
            <Typography level="h2" sx={{mb: 3}}>{t('consumer.dashboard.title')}</Typography>

            {loading ? (
                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <Skeleton variant="card" height={300}/>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Skeleton variant="card" height={300}/>
                    </Grid>
                </Grid>
            ) : (
                <Box>
                    <Grid container spacing={3}>
                        {/* 余额卡片 */}
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{height: '100%'}}>
                                <CardContent>
                                    <Typography level="h3">{t('consumer.balancer.title')}</Typography>
                                    <Divider sx={{my: 2}}/>
                                    <List>
                                        <ListItem>
                                            <Button
                                                variant="plain"
                                                onClick={() => navigate({to: '/consumer/balance'}).then(() => {
                                                    console.log('已跳转到余额页面')
                                                })}
                                                sx={{width: '100%', justifyContent: 'flex-start'}}
                                            >
                                                {t('consumer.balancer.view')}
                                            </Button>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* 交易记录卡片 */}
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{height: '100%'}}>
                                <CardContent>
                                    <Typography level="h3">{t('consumer.transactions.title')}</Typography>
                                    <Divider sx={{my: 2}}/>
                                    <List>
                                        <ListItem>
                                            <Button
                                                variant="plain"
                                                onClick={() => navigate({to: '/consumer/transactions'}).then(() => {
                                                    console.log('已跳转到交易记录页面')
                                                })}
                                                sx={{width: '100%', justifyContent: 'flex-start'}}
                                            >
                                                {t('consumer.transactions.view')}
                                            </Button>
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
