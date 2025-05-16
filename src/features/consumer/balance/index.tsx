import { useNavigate } from '@tanstack/react-router'
import { Box, IconButton, Typography } from '@mui/joy'
import { useQuery } from '@tanstack/react-query'


import { useTranslation } from 'react-i18next'

import { balancerService } from "@/features/dashboard/admin/rechargeBalance/api.ts";
import { Refresh } from '@mui/icons-material';

export default function Balance() {
    const {t} = useTranslation()

    const navigate = useNavigate()


    // 使用React Query获取余额数据
    const {data: balanceData, isLoading, refetch,isFetching} = useQuery({
        queryKey: ['userBalance'],
        queryFn: () => balancerService.getUserBalance({currency: 'CNY'}),
        staleTime: 5 * 60 * 1000 // 5分钟缓存
    })
    const handleRefresh = () => {
        refetch().then(() => {
            console.log('订单列表已刷新')
        })
    }

    // 检查用户是否为消费者，如果不是则重定向到首页
    // useEffect(() => {
    //     if (account.role !== 'consumer') {
    //         navigate({to: '/'}).then(() => {
    //             console.log('非消费者用户，已重定向到首页')
    //         })
    //     }
    // }, [account.role, navigate])

    // 初始化和更新图表
    // useEffect(() => {
    //     if (!chartRef.current) return
    //
    //     // 如果图表实例已存在，销毁它
    //     if (chart) {
    //         chart.dispose()
    //     }
    //
    //     // 创建新的图表实例
    //     const newChart = echarts.init(chartRef.current)
    //     setChart(newChart)
    //
    //     // 设置图表选项
    //     newChart.setOption({
    //         tooltip: {
    //             trigger: 'axis',
    //             formatter: '{b}: {c} 元'
    //         },
    //         grid: {
    //             left: '3%',
    //             right: '4%',
    //             bottom: '3%',
    //             top: '3%',
    //             containLabel: true
    //         },
    //         xAxis: {
    //             type: 'category',
    //             boundaryGap: false,
    //             data: chartData.map(item => item.month),
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#ccc'
    //                 }
    //             },
    //             axisLabel: {
    //                 color: '#666'
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             axisLine: {
    //                 show: false
    //             },
    //             axisTick: {
    //                 show: false
    //             },
    //             splitLine: {
    //                 lineStyle: {
    //                     color: '#eee'
    //                 }
    //             },
    //             axisLabel: {
    //                 color: '#666'
    //             }
    //         },
    //         series: [
    //             {
    //                 name: '余额',
    //                 type: 'line',
    //                 smooth: true,
    //                 symbol: 'circle',
    //                 symbolSize: 8,
    //                 itemStyle: {
    //                     color: '#00e6c9'
    //                 },
    //                 lineStyle: {
    //                     width: 3,
    //                     color: '#00e6c9'
    //                 },
    //                 areaStyle: {
    //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                         {
    //                             offset: 0,
    //                             color: 'rgba(0, 230, 201, 0.3)'
    //                         },
    //                         {
    //                             offset: 1,
    //                             color: 'rgba(0, 230, 201, 0)'
    //                         }
    //                     ])
    //                 },
    //                 data: chartData.map(item => item.value)
    //             }
    //         ]
    //     })
    //
    //     // 处理窗口大小变化
    //     const handleResize = () => {
    //         newChart.resize()
    //     }
    //     window.addEventListener('resize', handleResize)
    //
    //     return () => {
    //         window.removeEventListener('resize', handleResize)
    //         newChart.dispose()
    //     }
    // }, [chartData, chart])

    // 格式化金额显示
    const formatCurrency = (amount: number, currency: string = 'CNY') => {
        const currencySymbol = currency === 'CNY' ? '¥' : '$'
        return `${currencySymbol}${amount.toFixed(2)}`
    }


    // 渲染账户列表
    // const renderAccountsList = () => (
    //     <List>
    //         {accounts.map((account, index) => (
    //             <ListItem key={index}>
    //                 <ListItemDecorator sx={{color: 'primary.main'}}>
    //                     {accountTypeIcons[account.type]}
    //                 </ListItemDecorator>
    //                 <ListItemContent>
    //                     <Typography>{t(`consumer.balance.${account.type.toLowerCase()}`)}</Typography>
    //                     {account.note && (
    //                         <Typography level="body-xs" color="neutral">
    //                             {t('consumer.balance.upTo')} {account.note}
    //                         </Typography>
    //                     )}
    //                 </ListItemContent>
    //                 <Typography>{formatCurrency(account.balance, balanceData?.currency)}</Typography>
    //             </ListItem>
    //         ))}
    //     </List>
    // )

    // // 渲染交易列表
    // const renderTransactionsList = () => (
    //     <>
    //         <Typography level="title-sm" sx={{mt: 3, mb: 1}}>
    //             {t('consumer.balance.transactions')}
    //         </Typography>
    //         <List>
    //             {transactions.map((transaction) => (
    //                 <ListItem key={transaction.id}>
    //                     <ListItemDecorator>
    //                         <Box sx={{
    //                             bgcolor: 'background.level1',
    //                             borderRadius: '8px',
    //                             p: 1,
    //                             display: 'flex',
    //                             alignItems: 'center',
    //                             justifyContent: 'center'
    //                         }}>
    //                             {transactionTypeIcons[transaction.name]}
    //                         </Box>
    //                     </ListItemDecorator>
    //                     <ListItemContent>
    //                         <Typography>{transaction.name}</Typography>
    //                         <Typography level="body-xs" color="neutral">
    //                             {transaction.time}
    //                         </Typography>
    //                     </ListItemContent>
    //                     <Typography>{formatCurrency(transaction.amount, balanceData?.currency)}</Typography>
    //                 </ListItem>
    //             ))}
    //         </List>
    //     </>
    // )


    return (
        <Box sx={{p: 2, maxWidth: '800px', mx: 'auto'}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <IconButton
                    onClick={() => navigate({to: '/consumer'})}
                    sx={{mr: 1}}
                >
                    ←
                </IconButton>
                <Typography level="h2">{t('consumer.balancer.title')}</Typography>
            </Box>

            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <Typography>Loading...</Typography>
                </Box>
            ) : (
                <>
                    {/* 时间范围选择器 */}
                    {/*{renderTimeRangeTabs()}*/}

                    <IconButton onClick={handleRefresh} variant="outlined" disabled={isFetching}>
                        <Refresh/>
                    </IconButton>

                    {/* 总余额显示 */}
                    <Box sx={{textAlign: 'center', mb: 2}}>
                        <Typography level="body-sm" color="neutral">
                            {t('consumer.balance.total')}
                        </Typography>
                        <Typography level="h1" sx={{fontSize: '2.5rem', my: 1}}>
                            {formatCurrency(balanceData?.available || 0, balanceData?.currency)}
                        </Typography>
                        {/*{balanceData.frozen > 0 && (*/}
                        {/*    <Typography level="body-sm" color="warning">*/}
                        {/*        {t('consumer.balance.frozen')}: {formatCurrency(balanceData.frozen, balanceData.currency)}*/}
                        {/*    </Typography>*/}
                        {/*)}*/}
                        {/*<Typography*/}
                        {/*    level="body-sm"*/}
                        {/*    color="success"*/}
                        {/*    startDecorator={<ArrowUpward fontSize="small"/>}*/}
                        {/*>*/}
                        {/*    3.41% {t('consumer.balance.higherThan')}*/}
                        {/*</Typography>*/}
                    </Box>

                    {/* 余额图表 */}
                    {/*{renderBalanceChart()}*/}

                    {/* 操作按钮 */}
                    {/*{renderActionButtons()}*/}

                    {/* 账户列表 */}
                    {/*{renderAccountsList()}*/}
                    {/*<Typography level="body-xs" color="neutral">*/}
                    {/*    {t('consumer.balance.upTo')} {balance.balance}*/}
                    {/*</Typography>*/}

                    {/* 交易列表 */}
                    {/*{renderTransactionsList()}*/}
                </>


            )}

        </Box>
    )
}
