import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useRef, useState} from 'react'
import {
  Box,
  Card,
  CardContent,
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

export const Route = createLazyFileRoute('/admin/analytics/')({
    component: AnalyticsDashboard,
})

// 模拟销售数据
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
        {date: '第1周', sales: 85000, orders: 850},
        {date: '第2周', sales: 92000, orders: 920},
        {date: '第3周', sales: 103000, orders: 1030},
        {date: '第4周', sales: 115000, orders: 1150}
    ],
    monthly: [
        {date: '1月', sales: 320000, orders: 3200},
        {date: '2月', sales: 290000, orders: 2900},
        {date: '3月', sales: 350000, orders: 3500},
        {date: '4月', sales: 380000, orders: 3800},
        {date: '5月', sales: 420000, orders: 4200},
        {date: '6月', sales: 450000, orders: 4500}
    ]
}

// 模拟用户行为数据
const mockUserBehaviorData = {
    pageViews: [
        {date: '周一', views: 5200},
        {date: '周二', views: 5800},
        {date: '周三', views: 6100},
        {date: '周四', views: 5900},
        {date: '周五', views: 6500},
        {date: '周六', views: 7200},
        {date: '周日', views: 6800}
    ],
    conversionRate: [
        {date: '周一', rate: 2.5},
        {date: '周二', rate: 2.8},
        {date: '周三', rate: 3.2},
        {date: '周四', rate: 3.0},
        {date: '周五', rate: 3.5},
        {date: '周六', rate: 4.0},
        {date: '周日', rate: 3.8}
    ],
    userSources: [
        {name: '直接访问', value: 335},
        {name: '搜索引擎', value: 679},
        {name: '社交媒体', value: 548},
        {name: '广告', value: 420},
        {name: '其他', value: 288}
    ],
    deviceDistribution: [
        {name: '移动端', value: 65},
        {name: '桌面端', value: 30},
        {name: '平板', value: 5}
    ]
}

// 模拟平台性能数据
const mockPerformanceData = {
    responseTime: [
        {date: '周一', time: 120},
        {date: '周二', time: 132},
        {date: '周三', time: 101},
        {date: '周四', time: 134},
        {date: '周五', time: 90},
        {date: '周六', time: 85},
        {date: '周日', time: 95}
    ],
    errorRate: [
        {date: '周一', rate: 0.8},
        {date: '周二', rate: 0.6},
        {date: '周三', rate: 0.9},
        {date: '周四', rate: 0.7},
        {date: '周五', rate: 0.5},
        {date: '周六', rate: 0.3},
        {date: '周日', rate: 0.4}
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
}

function AnalyticsDashboard() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(0)
    const [timeRange, setTimeRange] = useState('daily')

    // 图表容器引用
    const salesChartRef = useRef<HTMLDivElement>(null)
    const ordersChartRef = useRef<HTMLDivElement>(null)
    const pageViewsChartRef = useRef<HTMLDivElement>(null)
    const conversionRateChartRef = useRef<HTMLDivElement>(null)
    const userSourcesChartRef = useRef<HTMLDivElement>(null)
    const deviceDistributionChartRef = useRef<HTMLDivElement>(null)
    const responseTimeChartRef = useRef<HTMLDivElement>(null)
    const errorRateChartRef = useRef<HTMLDivElement>(null)
    const serverLoadChartRef = useRef<HTMLDivElement>(null)

    // 图表实例
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

    // 检查用户是否为管理员，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'admin') {
            navigate({to: '/'}).then(() => {
                console.log('非管理员用户，已重定向到首页')
            })
        }
    }, [account.role, navigate])

    // 初始化销售数据图表
    useEffect(() => {
        if (activeTab === 0 && salesChartRef.current && ordersChartRef.current) {
            // 销售额图表
            const salesChart = echarts.init(salesChartRef.current)
            const salesOption = {
                title: {
                    text: '销售额趋势',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br />{a}: ¥{c}'
                },
                xAxis: {
                    type: 'category',
                    data: mockSalesData[timeRange].map(item => item.date)
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                },
                series: [{
                    name: '销售额',
                    data: mockSalesData[timeRange].map(item => item.sales),
                    type: 'line',
                    smooth: true,
                    areaStyle: {}
                }]
            }
            salesChart.setOption(salesOption)

            // 订单量图表
            const ordersChart = echarts.init(ordersChartRef.current)
            const ordersOption = {
                title: {
                    text: '订单量趋势',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: mockSalesData[timeRange].map(item => item.date)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '订单量',
                    data: mockSalesData[timeRange].map(item => item.orders),
                    type: 'bar'
                }]
            }
            ordersChart.setOption(ordersOption)

            setCharts(prev => ({
                ...prev,
                salesChart,
                ordersChart
            }))

            // 清理函数
            return () => {
                salesChart.dispose()
                ordersChart.dispose()
            }
        }
    }, [activeTab, timeRange])

    // 初始化平台性能图表
    useEffect(() => {
        if (activeTab === 2 &&
            responseTimeChartRef.current &&
            errorRateChartRef.current &&
            serverLoadChartRef.current) {

            // 响应时间图表
            const responseTimeChart = echarts.init(responseTimeChartRef.current)
            const responseTimeOption = {
                title: {
                    text: '平均响应时间 (ms)',
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
                    name: '响应时间',
                    data: mockPerformanceData.responseTime.map(item => item.time),
                    type: 'line',
                    smooth: true,
                    markLine: {
                        data: [{type: 'average', name: '平均值'}]
                    }
                }]
            }
            responseTimeChart.setOption(responseTimeOption)

            // 错误率图表
            const errorRateChart = echarts.init(errorRateChartRef.current)
            const errorRateOption = {
                title: {
                    text: '系统错误率 (%)',
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
                    name: '错误率',
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

            // 服务器负载图表
            const serverLoadChart = echarts.init(serverLoadChartRef.current)
            const serverLoadOption = {
                title: {
                    text: '服务器负载 (%)',
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
                    name: '负载',
                    data: mockPerformanceData.serverLoad.map(item => item.load),
                    type: 'bar',
                    itemStyle: {
                        color: function (params) {
                            // 根据负载值设置不同颜色
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

            // 清理函数
            return () => {
                responseTimeChart.dispose()
                errorRateChart.dispose()
                serverLoadChart.dispose()
            }
        }
    }, [activeTab])

    // 窗口大小变化时重新调整图表大小
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
            <Typography level="h2" sx={{mb: 3}}>数据分析</Typography>

            <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
                <TabList>
                    <Tab>销售数据</Tab>
                    <Tab>用户行为</Tab>
                    <Tab>平台性能</Tab>
                </TabList>

                {/* 销售数据面板 */}
                <TabPanel value={0}>
                    <Box sx={{mb: 3}}>
                        <FormControl size="sm">
                            <FormLabel>时间范围</FormLabel>
                            <Select
                                value={timeRange}
                                onChange={(_, value) => setTimeRange(value)}
                                sx={{minWidth: 150}}
                            >
                                <Option value="daily">日视图</Option>
                                <Option value="weekly">周视图</Option>
                                <Option value="monthly">月视图</Option>
                            </Select>
                        </FormControl>
                    </Box>

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
                </TabPanel>

                {/* 用户行为面板 */}
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

                {/* 平台性能面板 */}
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
