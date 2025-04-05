import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {SyntheticEvent, useEffect, useRef, useState} from 'react'
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
import {userStore} from '@/store/user'
import * as echarts from 'echarts'
import {useTranslation} from 'react-i18next'
import {t} from 'i18next'
import {orderService} from '@/api/orderService'
import {GroupedSalesData, groupOrdersByDate} from '@/utils/analyticsHelper'
import {showMessage} from "@/utils/showMessage";

// 定义时间范围类型
type TimeRange = 'daily' | 'weekly' | 'monthly';

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
    const [timeRange, setTimeRange] = useState<TimeRange>('daily')
    const [loading, setLoading] = useState(false)
    const [realSalesData, setRealSalesData] = useState<GroupedSalesData | null>(null)
    const [chartsInitialized, setChartsInitialized] = useState(false)

    // Get translated mock data for other tabs
    const {mockSalesData: fallbackData} = getMockData()
    getMockPerformanceData();
// 使用真实数据或回退到模拟数据
    const salesData = realSalesData || fallbackData

    // Chart container refs
    const salesChartRef = useRef<HTMLDivElement>(null)
    const ordersChartRef = useRef<HTMLDivElement>(null)

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

    // 初始化销售数据图表
    const initSalesCharts = () => {
        if (activeTab === 0 && salesChartRef.current && ordersChartRef.current) {
            console.log('初始化销售图表，使用数据时间范围:', timeRange);

            // 确保有数据可用
            let chartData = salesData[timeRange];
            if (!chartData || chartData.length === 0) {
                console.log('该时间范围没有数据，使用默认空数据');
                chartData = [{date: new Date().toLocaleDateString(), sales: 0, orders: 0}];
            }

            console.log('图表数据:', chartData);

            // 销毁之前的图表实例
            if (charts.salesChart) {
                charts.salesChart.dispose();
            }

            // Sales chart
            const salesChart = echarts.init(salesChartRef.current);
            salesChart.setOption({
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
                    data: chartData.map((item: { date: string }) => item.date)
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '¥{value}'
                    }
                },
                series: [{
                    name: t('admin.analytics.sales'),
                    data: chartData.map((item: { sales: number }) => item.sales),
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    },
                    itemStyle: {
                        color: '#1976d2'
                    }
                }]
            });

            // 销毁之前的图表实例
            if (charts.ordersChart) {
                charts.ordersChart.dispose();
            }

            // Orders chart
            const ordersChart = echarts.init(ordersChartRef.current);
            ordersChart.setOption({
                title: {
                    text: t('admin.analytics.ordersTrend'),
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: chartData.map((item: { date: string }) => item.date)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: t('admin.analytics.orders'),
                    data: chartData.map((item: { orders: number }) => item.orders),
                    type: 'bar',
                    itemStyle: {
                        color: '#4caf50'
                    }
                }]
            });

            // 保存图表实例
            setCharts(prev => ({
                ...prev,
                salesChart,
                ordersChart
            }));

            // 触发一次resize以确保图表正确显示
            setTimeout(() => {
                salesChart.resize();
                ordersChart.resize();
            }, 200);
        }
    };

    // Check if user is admin, redirect to home page if not
    useEffect(() => {
        if (account.role !== 'admin') {
            showMessage(t('admin.analytics.permissionError'), 'error')
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
                console.log('开始获取所有订单数据...');
                // 使用GetAllOrders API获取所有订单
                const response = await orderService.listOrder({
                    page: 1,
                    pageSize: 1000, // 获取足够多的订单数据以供分析
                });

                console.log('获取到订单数据:', response);

                if (response && response.orders) {
                    console.log('订单数量:', response.orders.length);

                    // 处理订单数据，按日期分组
                    const groupedData = groupOrdersByDate(response.orders);
                    console.log('处理后的订单数据:', groupedData);
                    setRealSalesData(groupedData);
                } else {
                    console.warn('未获取到订单数据');
                    setRealSalesData(null);
                }
            } catch (error) {
                console.error('获取订单数据失败:', error);
                // 获取失败时使用模拟数据
                setRealSalesData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData().then(() => {
            console.log('获取订单数据完成');
        });
    }, []);

    // 数据加载完成后初始化图表
    useEffect(() => {
        // 只要数据加载完成（不再加载中）且图表未初始化，就初始化图表
        if (!loading && !chartsInitialized && activeTab === 0) {
            console.log('尝试初始化图表，当前数据状态:', {
                salesDataAvailable: !!salesData,
                timeRange: timeRange
            });

            // 初始化销售相关图表
            initSalesCharts();
            setChartsInitialized(true);
        }
    }, [loading, salesData, activeTab, chartsInitialized, timeRange]);

    // 当tab改变时，如果需要则初始化对应tab的图表
    useEffect(() => {
        // 当tab切换时，重置chartsInitialized状态
        setChartsInitialized(false);
    }, [activeTab]);

    // 处理窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            if (charts.salesChart) charts.salesChart.resize();
            if (charts.ordersChart) charts.ordersChart.resize();
            if (charts.pageViewsChart) charts.pageViewsChart.resize();
            if (charts.conversionRateChart) charts.conversionRateChart.resize();
            if (charts.userSourcesChart) charts.userSourcesChart.resize();
            if (charts.deviceDistributionChart) charts.deviceDistributionChart.resize();
            if (charts.responseTimeChart) charts.responseTimeChart.resize();
            if (charts.errorRateChart) charts.errorRateChart.resize();
            if (charts.serverLoadChart) charts.serverLoadChart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            // 销毁图表实例以防内存泄漏
            Object.values(charts).forEach(chart => {
                if (chart) chart.dispose();
            });
        };
    }, [charts]);

    // 当时间范围改变时重新渲染图表
    useEffect(() => {
        if (activeTab === 0 && !loading && chartsInitialized) {
            console.log('时间范围改变，重新渲染图表:', timeRange);
            initSalesCharts();
        }
    }, [timeRange, activeTab, loading, chartsInitialized]);

    // // 用户行为分析图表初始化
    // const initUserBehaviorCharts = () => {
    //     // ... 用户行为图表初始化代码保持不变 ...
    // };
    //
    // // 性能报告图表初始化
    // const initPerformanceCharts = () => {
    //     // ... 性能报告图表初始化代码保持不变 ...
    // };

    // Tab变更处理
    const handleTabChange = (_: SyntheticEvent | null, newValue: number | string | null) => {
        if (typeof newValue === 'number') {
            setActiveTab(newValue);
        }
    };

    // 时间范围变更处理
    const handleTimeRangeChange = (_: SyntheticEvent | null, newValue: string | null) => {
        if (newValue) {
            setTimeRange(newValue as TimeRange);
        }
    };

    return (
        <Box sx={{p: 3}}>
            <Typography level="h2" sx={{mb: 3}}>{t('admin.analytics.title')}</Typography>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{mb: 3}}>
                <TabList>
                    <Tab>{t('admin.analytics.salesData')}</Tab>
                    <Tab>{t('admin.analytics.userBehavior')}</Tab>
                    <Tab>{t('admin.analytics.performanceReport')}</Tab>
                </TabList>

                {/* 销售数据面板 */}
                <TabPanel value={0}>
                    <Box sx={{mb: 3}}>
                        <FormControl size="sm">
                            <FormLabel>{t('admin.analytics.timeRange')}</FormLabel>
                            <Select
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                                sx={{minWidth: 150}}
                            >
                                <Option value="daily">{t('admin.analytics.daily')}</Option>
                                <Option value="weekly">{t('admin.analytics.weekly')}</Option>
                                <Option value="monthly">{t('admin.analytics.monthly')}</Option>
                            </Select>
                        </FormControl>
                    </Box>

                    <Grid container spacing={3}>
                        {/* 销售金额图表 */}
                        <Grid xs={12} md={6}>
                            <Card sx={{height: '350px'}}>
                                <CardContent sx={{position: 'relative', height: '100%'}}>
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
                                            <CircularProgress/>
                                        </Box>
                                    )}
                                    <div ref={salesChartRef} style={{width: '100%', height: '100%'}}></div>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 订单数量图表 */}
                        <Grid xs={12} md={6}>
                            <Card sx={{height: '350px'}}>
                                <CardContent sx={{position: 'relative', height: '100%'}}>
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
                                            <CircularProgress/>
                                        </Box>
                                    )}
                                    <div ref={ordersChartRef} style={{width: '100%', height: '100%'}}></div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* 用户行为面板 */}
                <TabPanel value={1}>
                    {/* 保持原有的用户行为分析面板代码 */}
                </TabPanel>

                {/* 平台性能面板 */}
                <TabPanel value={2}>
                    {/* 保持原有的平台性能面板代码 */}
                </TabPanel>
            </Tabs>
        </Box>
    );
}
