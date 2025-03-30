import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useRef, useState} from 'react'
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    Grid,
    Option,
    Select,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Typography,
} from '@mui/joy'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import * as echarts from 'echarts'
import {useTranslation} from 'react-i18next'
import {t} from 'i18next'
import {orderService} from '@/api/orderService'
import {GroupedSalesData, groupOrdersByDate} from '@/utils/analyticsHelper'

export const Route = createLazyFileRoute('/admin/analytics/')({
    component: AnalyticsDashboard,
})

// Define mock data function to be called inside component to get translated data
const getMockData = () => {


    // Mock sales data
    const mockSalesData = {
        daily: [
            {date: '2023-06-01', sales: 12500, orders: 125},
            {date: '2023-06-02', sales: 14200, orders: 142},
            {date: '2023-06-03', sales: 16800, orders: 168},
            {date: '2023-06-04', sales: 15300, orders: 153},
            {date: '2023-06-05', sales: 18900, orders: 189},
            {date: '2023-06-06', sales: 21500, orders: 215},
            {date: '2023-06-07', sales: 19800, orders: 198}
        ],
        weekly: [
            {date: t('admin.analytics.week') + '1', sales: 85000, orders: 850},
            {date: t('admin.analytics.week') + '2', sales: 92000, orders: 920},
            {date: t('admin.analytics.week') + '3', sales: 103000, orders: 1030},
            {date: t('admin.analytics.week') + '4', sales: 115000, orders: 1150}
        ],
        monthly: [
            {date: t('admin.analytics.month') + '1', sales: 320000, orders: 3200},
            {date: t('admin.analytics.month') + '2', sales: 290000, orders: 2900},
            {date: t('admin.analytics.month') + '3', sales: 350000, orders: 3500},
            {date: t('admin.analytics.month') + '4', sales: 380000, orders: 3800},
            {date: t('admin.analytics.month') + '5', sales: 420000, orders: 4200},
            {date: t('admin.analytics.month') + '6', sales: 450000, orders: 4500}
        ]
    }

    // Mock user behavior data
    const mockUserBehaviorData = {
        pageViews: [
            {date: t('admin.analytics.monday'), views: 5200},
            {date: t('admin.analytics.tuesday'), views: 5800},
            {date: t('admin.analytics.wednesday'), views: 6100},
            {date: t('admin.analytics.thursday'), views: 5900},
            {date: t('admin.analytics.friday'), views: 6500},
            {date: t('admin.analytics.saturday'), views: 7200},
            {date: t('admin.analytics.sunday'), views: 6800}
        ],
        conversionRate: [
            {date: t('admin.analytics.monday'), rate: 2.5},
            {date: t('admin.analytics.tuesday'), rate: 2.8},
            {date: t('admin.analytics.wednesday'), rate: 3.2},
            {date: t('admin.analytics.thursday'), rate: 3.0},
            {date: t('admin.analytics.friday'), rate: 3.5},
            {date: t('admin.analytics.saturday'), rate: 4.0},
            {date: t('admin.analytics.sunday'), rate: 3.8}
        ],
        userSources: [
            {name: t('admin.analytics.directAccess'), value: 335},
            {name: t('admin.analytics.searchEngine'), value: 679},
            {name: t('admin.analytics.socialMedia'), value: 548},
            {name: t('admin.analytics.advertising'), value: 420},
            {name: t('admin.analytics.others'), value: 288}
        ],
        deviceDistribution: [
            {name: t('admin.analytics.mobile'), value: 65},
            {name: t('admin.analytics.desktop'), value: 30},
            {name: t('admin.analytics.tablet'), value: 5}
        ]
    }

    return {mockSalesData, mockUserBehaviorData};
}

// Define mock platform performance data function to be called inside component to get translated data
const getMockPerformanceData = () => {
    return {
        responseTime: [
            {date: t('admin.analytics.monday'), time: 120},
            {date: t('admin.analytics.tuesday'), time: 132},
            {date: t('admin.analytics.wednesday'), time: 101},
            {date: t('admin.analytics.thursday'), time: 134},
            {date: t('admin.analytics.friday'), time: 90},
            {date: t('admin.analytics.saturday'), time: 85},
            {date: t('admin.analytics.sunday'), time: 95}
        ],
        errorRate: [
            {date: t('admin.analytics.monday'), rate: 0.8},
            {date: t('admin.analytics.tuesday'), rate: 0.6},
            {date: t('admin.analytics.wednesday'), rate: 0.9},
            {date: t('admin.analytics.thursday'), rate: 0.7},
            {date: t('admin.analytics.friday'), rate: 0.5},
            {date: t('admin.analytics.saturday'), rate: 0.3},
            {date: t('admin.analytics.sunday'), rate: 0.4}
        ],
        serverLoad: [
            {date: '00:00', load: 30},
            {date: '03:00', load: 15},
            {date: '06:00', load: 25},
            {date: '09:00', load: 65},
            {date: '12:00', load: 85},
            {date: '15:00', load: 75},
            {date: '18:00', load: 90},
            {date: '21:00', load: 60}
        ]
    };
}

function AnalyticsDashboard() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(0)
    const [timeRange, setTimeRange] = useState('daily')
    const [loading, setLoading] = useState(false)
    const [realSalesData, setRealSalesData] = useState<GroupedSalesData | null>(null)

    // Get translated mock data for other tabs
    const {mockSalesData: fallbackData} = getMockData()
    const mockPerformanceData = getMockPerformanceData()

    // 使用真实数据或回退到模拟数据
    const salesData = realSalesData || fallbackData

    // Chart container refs
    const salesChartRef = useRef<HTMLDivElement>(null)
    const ordersChartRef = useRef<HTMLDivElement>(null)
    const pageViewsChartRef = useRef<HTMLDivElement>(null)
    const conversionRateChartRef = useRef<HTMLDivElement>(null)
    const userSourcesChartRef = useRef<HTMLDivElement>(null)
    const deviceDistributionChartRef = useRef<HTMLDivElement>(null)
    const responseTimeChartRef = useRef<HTMLDivElement>(null)
    const errorRateChartRef = useRef<HTMLDivElement>(null)
    const serverLoadChartRef = useRef<HTMLDivElement>(null)

    // Chart instances
    const [charts, setCharts] = useState<{
        salesChart: echarts.ECharts | null,
        ordersChart: echarts.ECharts | null,
        pageViewsChart: echarts.ECharts | null,
        conversionRateChart: echarts.ECharts | null,
        userSourcesChart: echarts.ECharts | null,
        deviceDistributionChart: echarts.ECharts | null,
        responseTimeChart: echarts.ECharts | null,
        errorRateChart: echarts.ECharts | null,
        serverLoadChart: echarts.ECharts | null
    }>({
        salesChart: null,
        ordersChart: null,
        pageViewsChart: null,
        conversionRateChart: null,
        userSourcesChart: null,
        deviceDistributionChart: null,
        responseTimeChart: null,
        errorRateChart: null,
        serverLoadChart: null
    })

    // Check if user is admin, redirect to home page if not
    useEffect(() => {
        if (account.role !== 'admin') {
            // Import showMessage function to display permission error
            import('@/utils/casdoor').then(({showMessage}) => {
                showMessage(t('admin.analytics.permissionError'), 'error')
            })
            navigate({to: '/'}).then(() => {
                console.log(t('admin.analytics.redirected'))
            })
        }
    }, [account.role, navigate, t])

    // 获取真实订单数据
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setLoading(true);
                const response = await orderService.listOrder({
                    page: 0,
                    pageSize: 1000,
                })
                if (response && response.orders) {
                    // 处理订单数据，按日期分组
                    const groupedData = groupOrdersByDate(response.orders);
                    setRealSalesData(groupedData);
                }
            } catch (error) {
                console.error('获取订单数据失败:', error);
                // 获取失败时使用模拟数据
                setRealSalesData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [])

    // Initialize sales data charts
    useEffect(() => {
        if (activeTab === 0 && salesChartRef.current && ordersChartRef.current) {
            // Sales chart
            const salesChart = echarts.init(salesChartRef.current)
            const salesOption = {
                title: {
                    text: t('admin.analytics.salesTrend'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br />{a}: ¥{c}'
                },
                xAxis: {
                    type: 'category',
                    data: salesData[timeRange].map(item => item.date)
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                },
                series: [{
                    name: t('admin.analytics.sales'),
                    data: salesData[timeRange].map(item => item.sales),
                    type: 'line',
                    smooth: true,
                    areaStyle: {}
                }]
            }
            salesChart.setOption(salesOption)

            // Orders chart
            const ordersChart = echarts.init(ordersChartRef.current)
            const ordersOption = {
                title: {
                    text: t('admin.analytics.orderTrend'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: salesData[timeRange].map(item => item.date)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: t('admin.analytics.orders'),
                    data: salesData[timeRange].map(item => item.orders),
                    type: 'bar'
                }]
            }
            ordersChart.setOption(ordersOption)

            setCharts(prev => ({
                ...prev,
                salesChart,
                ordersChart
            }))

            // Cleanup function
            return () => {
                salesChart.dispose()
                ordersChart.dispose()
            }
        }
    }, [activeTab, timeRange])

    // Initialize platform performance charts
    useEffect(() => {
        if (activeTab === 2 &&
            responseTimeChartRef.current &&
            errorRateChartRef.current &&
            serverLoadChartRef.current) {

            // Response time chart
            const responseTimeChart = echarts.init(responseTimeChartRef.current)
            const responseTimeOption = {
                title: {
                    text: t('admin.analytics.responseTime'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: mockPerformanceData.responseTime.map(item => item.date)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: t('admin.analytics.responseTime'),
                    data: mockPerformanceData.responseTime.map(item => item.time),
                    type: 'line',
                    smooth: true,
                    markLine: {
                        data: [{type: 'average', name: t('admin.analytics.average')}]
                    }
                }]
            }
            responseTimeChart.setOption(responseTimeOption)

            // Error rate chart
            const errorRateChart = echarts.init(errorRateChartRef.current)
            const errorRateOption = {
                title: {
                    text: t('admin.analytics.errorRate'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br />{a}: {c}%'
                },
                xAxis: {
                    type: 'category',
                    data: mockPerformanceData.errorRate.map(item => item.date)
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [{
                    name: t('admin.analytics.errorRate'),
                    data: mockPerformanceData.errorRate.map(item => item.rate),
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        color: '#ff4d4f'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(255,77,79,0.3)'
                            }, {
                                offset: 1, color: 'rgba(255,77,79,0)'
                            }]
                        }
                    }
                }]
            }
            errorRateChart.setOption(errorRateOption)

            // Server load chart
            const serverLoadChart = echarts.init(serverLoadChartRef.current)
            const serverLoadOption = {
                title: {
                    text: t('admin.analytics.serverLoad'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br />{a}: {c}%'
                },
                xAxis: {
                    type: 'category',
                    data: mockPerformanceData.serverLoad.map(item => item.date)
                },
                yAxis: {
                    type: 'value',
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [{
                    name: t('admin.analytics.serverLoad'),
                    data: mockPerformanceData.serverLoad.map(item => item.load),
                    type: 'bar',
                    itemStyle: {
                        color: function (params) {
                            // Set different colors based on load value
                            if (params.value > 80) {
                                return '#ff4d4f';
                            } else if (params.value > 60) {
                                return '#faad14';
                            } else {
                                return '#52c41a';
                            }
                        }
                    }
                }]
            }
            serverLoadChart.setOption(serverLoadOption)

            setCharts(prev => ({
                ...prev,
                responseTimeChart,
                errorRateChart,
                serverLoadChart
            }))

            // Cleanup function
            return () => {
                responseTimeChart.dispose()
                errorRateChart.dispose()
                serverLoadChart.dispose()
            }
        }
    }, [activeTab])

    // Resize charts when window size changes
    useEffect(() => {
        const handleResize = () => {
            Object.values(charts).forEach(chart => {
                chart && chart.resize()
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [charts])

    return (
        <Box sx={{p: 2}}>
            <Typography level="h2" sx={{mb: 3}}>{t('admin.analytics.title')}</Typography>

            <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
                <TabList>
                    <Tab>{t('admin.analytics.sales')}</Tab>
                    <Tab>{t('admin.analytics.userBehavior')}</Tab>
                    <Tab>{t('admin.analytics.performance')}</Tab>
                </TabList>

                {/* Sales data panel */}
                <TabPanel value={0}>
                    <Box sx={{mb: 3}}>
                        <FormControl size="sm">
                            <FormLabel>{t('admin.analytics.timeRange')}</FormLabel>
                            <Select
                                value={timeRange}
                                onChange={(_, value) => setTimeRange(value)}
                                sx={{minWidth: 150}}
                                disabled={loading}
                            >
                                <Option value="daily">{t('admin.analytics.daily')}</Option>
                                <Option value="weekly">{t('admin.analytics.weekly')}</Option>
                                <Option value="monthly">{t('admin.analytics.monthly')}</Option>
                            </Select>
                        </FormControl>
                    </Box>

                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
                            <CircularProgress/>
                            <Typography level="body-md" sx={{ml: 2}}>
                                {t('admin.analytics.loadingData')}
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <div ref={salesChartRef} style={{height: 400}}></div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <div ref={ordersChartRef} style={{height: 400}}></div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </TabPanel>

                {/* User behavior panel */}
                <TabPanel value={1}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{mb: 3}}>
                                <CardContent>
                                    <div ref={pageViewsChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{mb: 3}}>
                                <CardContent>
                                    <div ref={conversionRateChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div ref={userSourcesChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div ref={deviceDistributionChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Platform performance panel */}
                <TabPanel value={2}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{mb: 3}}>
                                <CardContent>
                                    <div ref={responseTimeChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Card variant="outlined" sx={{mb: 3}}>
                                <CardContent>
                                    <div ref={errorRateChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <div ref={serverLoadChartRef} style={{height: 300}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Tabs>
        </Box>
    )

}
