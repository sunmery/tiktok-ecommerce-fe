import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useRef, useState} from 'react'
import {Box, Card, CardContent, CircularProgress, Grid, Typography} from '@mui/joy'
import * as echarts from 'echarts'
import {Order, PaymentStatus} from '@/types/orders'
import {orderService} from '@/api/orderService'
import Breadcrumbs from '@/components/Breadcrumbs'
import {t} from "i18next";
import {formatCurrency} from '@/utils/format'

export const Route = createLazyFileRoute('/merchant/analytics/')({
    component: Analytics,
})

interface SalesData {
    date: string
    sales: number
    orders: number
}

interface ProductSales {
    name: string
    sales: number
    quantity: number
}

interface AnalyticsSummary {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    currency: string
}

export default function Analytics() {
    const [salesData, setSalesData] = useState<SalesData[]>([])
    const [productSales, setProductSales] = useState<ProductSales[]>([])
    const [summary, setSummary] = useState<AnalyticsSummary>({
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        currency: 'CNY'
    })
    const [loading, setLoading] = useState(true)
    const [chartsInitialized, setChartsInitialized] = useState(false)

    // Add chart DOM references
    const salesTrendChartRef = useRef<HTMLDivElement>(null)
    const productSalesChartRef = useRef<HTMLDivElement>(null)
    const productRankChartRef = useRef<HTMLDivElement>(null)

    // Add chart instance states
    const [charts, setCharts] = useState<{
        trendChart: echarts.ECharts | null,
        pieChart: echarts.ECharts | null,
        rankChart: echarts.ECharts | null
    }>({
        trendChart: null,
        pieChart: null,
        rankChart: null
    })

    // 加载数据
    useEffect(() => {
        loadSalesData().catch(error => {
            console.error(t('analytics.load_sales_data_failed'), error)
            setLoading(false)
            
            // 处理权限错误
            if (error.message && (error.message.includes('未授权') || error.message.includes('权限不足'))) {
                import('@/utils/casdoor').then(({showMessage}) => {
                    showMessage(error.message, 'error')
                })
            }
        })
    }, [])

    // 数据加载完成后初始化图表
    useEffect(() => {
        // 只要数据加载完成（不再加载中），就初始化图表，不再强制要求有数据
        if (!loading && !chartsInitialized) {
            console.log('尝试初始化图表，当前数据状态:', {
                salesDataLength: salesData.length,
                productSalesLength: productSales.length
            })
            
            // 即使没有数据，也要初始化图表，避免白屏
            initCharts(salesData, productSales)
            setChartsInitialized(true)
        }
    }, [loading, salesData, productSales, chartsInitialized])

    // 处理窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            const {trendChart, pieChart, rankChart} = charts
            if (trendChart) trendChart.resize()
            if (pieChart) pieChart.resize()
            if (rankChart) rankChart.resize()
        }
        
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
            
            // 销毁图表实例以防内存泄漏
            if (charts.trendChart) charts.trendChart.dispose()
            if (charts.pieChart) charts.pieChart.dispose() 
            if (charts.rankChart) charts.rankChart.dispose()
        }
    }, [charts])

    const loadSalesData = async () => {
        setLoading(true)
        try {
            console.log('加载订单数据...')
            // 获取订单数据
            const response = await orderService.getOrder({
                userId: '', // 留空，API会使用当前登录用户的ID
                page: 1,
                pageSize: 100 // 获取更多订单数据以提高分析准确性
            })
            
            console.log('订单数据加载完成:', response)
            
            if (response && response.orders) {
                processOrdersData(response.orders)
            } else {
                console.error(t('analytics.no_orders_data'))
                setLoading(false)
            }
        } catch (error) {
            console.error(t('analytics.load_sales_data_failed'), error)
            setLoading(false)
        }
    }

    const processOrdersData = (orders: Order[]) => {
        console.log('处理订单数据...', orders.length)
        if (!orders || orders.length === 0) {
            console.warn(t('analytics.no_orders_data'))
            setSummary({
                totalSales: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                currency: 'CNY'
            })
            setSalesData([])
            setProductSales([])
            setLoading(false)
            return
        }
        
        console.log('订单状态示例:', orders[0].paymentStatus)
        
        // 使用所有订单进行分析，不再过滤支付状态
        // 前端分析页面需要显示所有订单数据，包括未支付订单
        const allOrders = orders
        
        // 计算总销售额
        let totalSales = 0
        allOrders.forEach(order => {
            order.items.forEach(item => {
                totalSales += item.cost
            })
        })
        
        // 获取货币类型（假设所有订单使用同一种货币）
        const currency = orders[0]?.currency || 'CNY'
        
        // 计算总订单数和平均客单价
        const totalOrders = allOrders.length
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
        
        // 更新汇总数据
        setSummary({
            totalSales,
            totalOrders,
            averageOrderValue,
            currency
        })
        
        // 按日期分组销售数据
        const dailySales: Record<string, { sales: number, orders: number }> = {}
        
        allOrders.forEach(order => {
            // 确保日期格式一致
            const orderDate = new Date(order.createdAt)
            const date = orderDate.toLocaleDateString()
            console.log('订单日期:', order.createdAt, '格式化后:', date)
            
            let orderTotal = 0
            
            order.items.forEach(item => {
                orderTotal += item.cost
            })
            
            if (!dailySales[date]) {
                dailySales[date] = { sales: 0, orders: 0 }
            }
            
            dailySales[date].sales += orderTotal
            dailySales[date].orders += 1
        })
        
        // 检查按日期分组后的结果
        console.log('按日期分组后的销售数据:', dailySales)
        
        // 转换为数组格式并按日期排序
        const salesDataArray = Object.entries(dailySales).map(([date, data]) => ({
            date,
            sales: data.sales,
            orders: data.orders
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        console.log('销售数据处理完成:', salesDataArray)
        
        // 按商品分组销售数据
        const productSalesMap = new Map<string, { sales: number, quantity: number }>()
        
        allOrders.forEach(order => {
            order.items.forEach(item => {
                // 生成商品名称，如果没有名称则使用ID的一部分
                const productId = item.item.productId
                const productName = item.item.name || `商品#${productId.substring(0, 8)}`
                
                const existing = productSalesMap.get(productName) || { sales: 0, quantity: 0 }
                productSalesMap.set(productName, {
                    sales: existing.sales + item.cost,
                    quantity: existing.quantity + item.item.quantity
                })
            })
        })
        
        // 转换为数组并按销售额排序
        const productSalesArray = Array.from(productSalesMap.entries()).map(([name, data]) => ({
            name,
            sales: data.sales,
            quantity: data.quantity
        })).sort((a, b) => b.sales - a.sales)
        
        console.log('商品销售数据处理完成:', productSalesArray)
        
        // 确保至少有一条数据
        if (salesDataArray.length === 0) {
            salesDataArray.push({
                date: new Date().toLocaleDateString(),
                sales: 0,
                orders: 0
            })
        }
        
        if (productSalesArray.length === 0) {
            productSalesArray.push({
                name: '暂无商品数据',
                sales: 0,
                quantity: 0
            })
        }
        
        // 更新状态
        setSalesData(salesDataArray)
        setProductSales(productSalesArray)
        setLoading(false)
    }

    const initCharts = (salesData: SalesData[], productSales: ProductSales[]) => {
        console.log('初始化图表中...', salesData.length, productSales.length)
        // 确保DOM元素已经渲染
        if (!salesTrendChartRef.current || !productSalesChartRef.current || !productRankChartRef.current) {
            console.error('图表DOM元素未准备好')
            return
        }

        // 确保有数据可用
        let chartSalesData = salesData
        let chartProductData = productSales
        
        // 如果没有数据，提供默认值避免图表空白
        if (chartSalesData.length === 0) {
            const today = new Date().toLocaleDateString()
            chartSalesData = [{ date: today, sales: 0, orders: 0 }]
        }
        
        if (chartProductData.length === 0) {
            chartProductData = [{ name: '暂无数据', sales: 0, quantity: 0 }]
        }

        // 销售趋势图表
        try {
            console.log('初始化销售趋势图表...')
            
            // 先销毁之前的实例
            if (charts.trendChart) {
                charts.trendChart.dispose()
            }
            
            const trendChart = echarts.init(salesTrendChartRef.current)
            trendChart.setOption({
                title: {text: t('analytics.sales_trend')},
                tooltip: {trigger: 'axis'},
                legend: {data: [t('analytics.sales_amount'), t('analytics.order_count')]},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: chartSalesData.map(item => item.date)
                },
                yAxis: [
                    {type: 'value', name: '销售额'},
                    {type: 'value', name: '订单数', alignTicks: true}
                ],
                series: [
                    {
                        name: t('analytics.sales_amount'),
                        type: 'line',
                        data: chartSalesData.map(item => item.sales),
                        smooth: true,
                        areaStyle: {
                            opacity: 0.3
                        },
                        itemStyle: {
                            color: '#1976d2'
                        }
                    },
                    {
                        name: t('analytics.order_count'),
                        type: 'bar',
                        yAxisIndex: 1,
                        data: chartSalesData.map(item => item.orders),
                        itemStyle: {
                            color: '#4caf50'
                        }
                    }
                ]
            })

            // 商品销售占比图表
            console.log('初始化商品销售占比图表...')
            
            // 先销毁之前的实例
            if (charts.pieChart) {
                charts.pieChart.dispose()
            }
            
            const pieChart = echarts.init(productSalesChartRef.current)
            pieChart.setOption({
                title: {text: t('analytics.product_sales_ratio')},
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: ¥{c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    type: 'scroll'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: chartProductData.map(item => ({
                            name: item.name,
                            value: item.sales
                        }))
                    }
                ]
            })

            // 商品销量排行图表
            console.log('初始化商品销量排行图表...')
            
            // 先销毁之前的实例
            if (charts.rankChart) {
                charts.rankChart.dispose()
            }
            
            const rankChart = echarts.init(productRankChartRef.current)
            const topProducts = chartProductData.slice(0, 10)
            
            rankChart.setOption({
                title: {text: '商品销量排行'},
                tooltip: {trigger: 'axis'},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {type: 'value'},
                yAxis: {
                    type: 'category',
                    data: topProducts.map(item => item.name),
                    axisLabel: {
                        width: 100,
                        overflow: 'truncate',
                        interval: 0
                    }
                },
                series: [
                    {
                        name: t('analytics.sales_quantity'),
                        type: 'bar',
                        data: topProducts.map(item => item.quantity),
                        itemStyle: {
                            color: function(params: any) {
                                // 根据数值生成不同深浅的颜色
                                const colorList = ['#83bff6', '#188df0', '#0065cf', '#004b9a', '#00337a'];
                                const index = Math.floor(params.dataIndex / 2) % colorList.length;
                                return colorList[index];
                            }
                        }
                    }
                ]
            })

            // 保存图表实例
            setCharts({
                trendChart,
                pieChart,
                rankChart
            })
            
            console.log('图表初始化完成')
            
            // 触发一次resize以确保图表正确显示
            setTimeout(() => {
                trendChart.resize()
                pieChart.resize()
                rankChart.resize()
            }, 200)
        } catch (error) {
            console.error('图表初始化失败:', error)
        }
    }

    return (
        <Box sx={{p: 2}}>
            <Breadcrumbs pathMap={{
                'merchant': t('merchant.title'),
                'analytics': t('merchant.analytics.title')
            }}/>

            <Typography level="h2" sx={{mb: 3}}>{t('merchant.analytics.title')}</Typography>

            {/* 销售统计卡片 */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-md" color="primary">{t('analytics.total_sales')}</Typography>
                            <Typography level="h2" sx={{mt: 1, color: 'success.600'}}>
                                {formatCurrency(summary.totalSales, summary.currency)}
                            </Typography>
                            <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                {loading ? t('analytics.loading') : t('analytics.total_sales_desc')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-md" color="primary">{t('analytics.total_orders')}</Typography>
                            <Typography level="h2" sx={{mt: 1, color: 'primary.600'}}>
                                {summary.totalOrders}
                            </Typography>
                            <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                {loading ? t('analytics.loading') : t('analytics.total_orders_desc')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="title-md" color="primary">{t('analytics.average_order_value')}</Typography>
                            <Typography level="h2" sx={{mt: 1, color: 'warning.600'}}>
                                {formatCurrency(summary.averageOrderValue, summary.currency)}
                            </Typography>
                            <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                {loading ? t('analytics.loading') : t('analytics.average_order_value_desc')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 图表卡片 */}
            <Grid container spacing={2}>
                <Grid xs={12} lg={8}>
                    <Card variant="outlined" sx={{mb: 2, height: {xs: '300px', md: '400px'}}}>
                        <CardContent sx={{height: '100%', position: 'relative'}}>
                            {loading && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    zIndex: 1
                                }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            <div ref={salesTrendChartRef} style={{width: '100%', height: '100%'}}></div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} lg={4}>
                    <Card variant="outlined" sx={{mb: 2, height: {xs: '300px', md: '400px'}}}>
                        <CardContent sx={{height: '100%', position: 'relative'}}>
                            {loading && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    zIndex: 1
                                }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            <div ref={productSalesChartRef} style={{width: '100%', height: '100%'}}></div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12}>
                    <Card variant="outlined" sx={{height: '400px'}}>
                        <CardContent sx={{height: '100%', position: 'relative'}}>
                            {loading && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    zIndex: 1
                                }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            <div ref={productRankChartRef} style={{width: '100%', height: '100%'}}></div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
