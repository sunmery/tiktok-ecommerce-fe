import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {Box, Button, Card, CardContent, Divider, Grid, List, ListItem, Typography} from '@mui/joy'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {useEffect, useState} from 'react'
import Skeleton from '@/components/Skeleton'
import {Order, PaymentStatus} from '@/types/orders'
import {orderService} from '@/api/orderService'
import {useTranslation} from "react-i18next";

export const Route = createLazyFileRoute('/consumer/')({
    component: ConsumerDashboard,
})

function ConsumerDashboard() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [recentOrders, setRecentOrders] = useState<Order[]>([])

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
                userId: '', // 留空，API会使用当前登录用户的ID
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
    
    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }
    
    // 获取状态文本
    const getStatusText = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.Paid:
                return t('consumer.order.status.paid')
            case PaymentStatus.Processing:
                return t('consumer.order.status.processing')
            case PaymentStatus.Failed:
                return t('consumer.order.status.failed')
            case PaymentStatus.NotPaid:
                return t('consumer.order.status.notPaid')
            default:
                return t('consumer.order.status.unknown')
        }
    }

    return (
        <Box sx={{p: 2}}>
            {/* 删除了面包屑导航 */}

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
                        {/* 我的订单卡片 */}
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{height: '100%'}}>
                                <CardContent>
                                    <Typography level="h3">{t('consumer.orders.title')}</Typography>
                                    <Divider sx={{my: 2}}/>
                                    <List>
                                        <ListItem>
                                            <Button
                                                variant="plain"
                                                onClick={() => navigate({to: '/consumer/orders'}).then(() => {
                                                    console.log('已跳转到订单历史页面')
                                                })}
                                                sx={{width: '100%', justifyContent: 'flex-start'}}
                                            >
                                                {t('consumer.orders.viewAll')}
                                            </Button>
                                        </ListItem>
                                        {/*<ListItem>*/}
                                        {/*    <Button*/}
                                        {/*        variant="plain"*/}
                                        {/*        onClick={() => navigate({to: '/consumer/orders'}).then(() => {*/}
                                        {/*            console.log('已跳转到订单状态页面')*/}
                                        {/*        })}*/}
                                        {/*        sx={{width: '100%', justifyContent: 'flex-start'}}*/}
                                        {/*    >*/}
                                        {/*        {t('consumer.orders.trackStatus')}*/}
                                        {/*    </Button>*/}
                                        {/*</ListItem>*/}
                                        {/*<ListItem>*/}
                                        {/*    <Button*/}
                                        {/*        variant="plain"*/}
                                        {/*        onClick={() => navigate({to: '/consumer/orders'}).then(() => {*/}
                                        {/*            console.log('已跳转到订单详情页面')*/}
                                        {/*        })}*/}
                                        {/*        sx={{width: '100%', justifyContent: 'flex-start'}}*/}
                                        {/*    >*/}
                                        {/*        {t('consumer.orders.queryDetails')}*/}
                                        {/*    </Button>*/}
                                        {/*</ListItem>*/}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 收藏夹卡片 */}
                        {/*<Grid xs={12} md={6}>*/}
                        {/*    <Card variant="outlined" sx={{height: '100%'}}>*/}
                        {/*        <CardContent>*/}
                        {/*            <Typography level="h3">{t('consumer.favorites.title')}</Typography>*/}
                        {/*            <Divider sx={{my: 2}}/>*/}
                        {/*            <List>*/}
                        {/*                <ListItem>*/}
                        {/*                    <Typography sx={{ color: '#1890ff' }}>{t('consumer.favorites.viewProducts')}</Typography>*/}
                        {/*                </ListItem>*/}
                        {/*                <ListItem>*/}
                        {/*                    <Typography sx={{ color: '#52c41a' }}>{t('consumer.favorites.manage')}</Typography>*/}
                        {/*                </ListItem>*/}
                        {/*                <ListItem>*/}
                        {/*                    <Typography sx={{ color: '#faad14' }}>{t('consumer.favorites.priceAlert')}</Typography>*/}
                        {/*                </ListItem>*/}
                        {/*            </List>*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</Grid>*/}
                        
                        {/* 最近订单卡片 */}
                        {/*<Grid xs={12}>*/}
                        {/*    <Card variant="outlined" sx={{mt: 3}}>*/}
                        {/*        <CardContent>*/}
                        {/*            <Typography level="h3">{t('consumer.recentOrders.title')}</Typography>*/}
                        {/*            <Divider sx={{my: 2}}/>*/}
                        {/*            */}
                        {/*            {recentOrders.length === 0 ? (*/}
                        {/*                <Typography>{t('consumer.recentOrders.noData')}</Typography>*/}
                        {/*            ) : (*/}
                        {/*                <Box>*/}
                        {/*                    {recentOrders.map((order) => {*/}
                        {/*                        // 计算订单总金额*/}
                        {/*                        const total = order.items.reduce((sum, item) => sum + item.cost, 0)*/}
                        {/*                        */}
                        {/*                        return (*/}
                        {/*                            <Card */}
                        {/*                                key={order.orderId} */}
                        {/*                                variant="outlined" */}
                        {/*                                sx={{mb: 2, cursor: 'pointer'}}*/}
                        {/*                                onClick={() => navigate({*/}
                        {/*                                    to: `/consumer/orders/${order.orderId}`*/}
                        {/*                                })}*/}
                        {/*                            >*/}
                        {/*                                <CardContent>*/}
                        {/*                                    <Grid container spacing={2}>*/}
                        {/*                                        <Grid xs={12} sm={6}>*/}
                        {/*                                            <Typography level="title-sm">{t('consumer.order.orderId')}</Typography>*/}
                        {/*                                            <Typography>{order.orderId}</Typography>*/}
                        {/*                                        </Grid>*/}
                        {/*                                        <Grid xs={12} sm={6}>*/}
                        {/*                                            <Typography level="title-sm">{t('consumer.order.createdTime')}</Typography>*/}
                        {/*                                            <Typography>{formatDate(order.createdAt)}</Typography>*/}
                        {/*                                        </Grid>*/}
                        {/*                                        <Grid xs={12} sm={6}>*/}
                        {/*                                            <Typography level="title-sm">{t('consumer.order.amount')}</Typography>*/}
                        {/*                                            <Typography>{formatCurrency(total, order.currency)}</Typography>*/}
                        {/*                                        </Grid>*/}
                        {/*                                        <Grid xs={12} sm={6}>*/}
                        {/*                                            <Typography level="title-sm">{t('consumer.order.paymentStatus')}</Typography>*/}
                        {/*                                            <Typography>{getStatusText(order.paymentStatus)}</Typography>*/}
                        {/*                                        </Grid>*/}
                        {/*                                    </Grid>*/}
                        {/*                                    */}
                        {/*                                    <Box sx={{mt: 2}}>*/}
                        {/*                                        <Typography level="body-sm">*/}
                        {/*                                            {t('consumer.order.viewDetails')}*/}
                        {/*                                        </Typography>*/}
                        {/*                                    </Box>*/}
                        {/*                                </CardContent>*/}
                        {/*                            </Card>*/}
                        {/*                        )*/}
                        {/*                    })}*/}
                        {/*                </Box>*/}
                        {/*            )}*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Box>
            )}
        </Box>
    )
}
