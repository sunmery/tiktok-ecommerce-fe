import {useTranslation} from "react-i18next";
import {useSnapshot} from "valtio/react";
import {userStore} from "@/store/user.ts";
// import {useNavigate} from "@tanstack/react-router";
import {SyntheticEvent, useEffect, useRef, useState, useCallback} from "react";
import {getAllOrders} from "./api";
import {GroupedSalesData, groupOrdersByDate} from "./helper";
import * as echarts from "echarts";
import {showMessage} from "@/utils/showMessage.ts";
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
    TabPanel,
    Tabs,
    Typography
} from "@mui/joy";

// 防抖函数
function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(...args: any[]) {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 图表实例类型
type ChartInstances = {
    salesChart: echarts.ECharts | null;
    ordersChart: echarts.ECharts | null;
    pageViewsChart: echarts.ECharts | null;
    conversionRateChart: echarts.ECharts | null;
    userSourcesChart: echarts.ECharts | null;
    deviceDistributionChart: echarts.ECharts | null;
    responseTimeChart: echarts.ECharts | null;
    errorRateChart: echarts.ECharts | null;
    serverLoadChart: echarts.ECharts | null;
};

export default function Analytics() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    // const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(0)
    const [timeRange, setTimeRange] = useState<TimeRange>('daily')
    const [loading, setLoading] = useState(false)
    const [realSalesData, setRealSalesData] = useState<GroupedSalesData | null>(null)
    const [chartsInitialized, setChartsInitialized] = useState(false)

    // 使用真实数据
    const salesData = realSalesData || {daily: [], weekly: [], monthly: []}

    // Chart container refs
    const salesChartRef = useRef<HTMLDivElement>(null)
    const ordersChartRef = useRef<HTMLDivElement>(null)

    // 使用 useRef 存储图表实例，避免状态更新导致的重新渲染
    const chartsRef = useRef<ChartInstances>({
        salesChart: null,
        ordersChart: null,
        pageViewsChart: null,
        conversionRateChart: null,
        userSourcesChart: null,
        deviceDistributionChart: null,
        responseTimeChart: null,
        errorRateChart: null,
        serverLoadChart: null
    });

    // 安全地销毁图表实例
    const disposeChart = useCallback((chartName: keyof ChartInstances) => {
        try {
            if (chartsRef.current[chartName]) {
                chartsRef.current[chartName]?.dispose();
                chartsRef.current[chartName] = null;
            }
        } catch (e) {
            console.warn(`销毁${chartName}图表实例失败:`, e);
        }
    }, []);

    // 安全地调整图表大小
    const resizeChart = useCallback((chartName: keyof ChartInstances) => {
        try {
            const chart = chartsRef.current[chartName];
            if (chart && !(chart as any).isDisposed?.()) {
                chart.resize();
            }
        } catch (e) {
            console.warn(`调整${chartName}图表大小失败:`, e);
        }
    }, []);

    // 初始化销售数据图表
    const initSalesCharts = useCallback(() => {
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
            disposeChart('salesChart');
            disposeChart('ordersChart');

            // 确保DOM元素存在
            if (!salesChartRef.current || !ordersChartRef.current) {
                console.warn('图表DOM元素不存在，跳过初始化');
                return;
            }

            try {
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
                chartsRef.current.salesChart = salesChart;

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
                chartsRef.current.ordersChart = ordersChart;

                // 延迟调整图表大小，确保渲染完成
                setTimeout(() => {
                    resizeChart('salesChart');
                    resizeChart('ordersChart');
                }, 200);
            } catch (e) {
                console.error('初始化图表失败:', e);
            }
        }
    }, [activeTab, timeRange, salesData, t, disposeChart, resizeChart]);

    // 在组件内添加获取订单数据的方法
    useEffect(() => {
        const fetchOrderData = async () => {
            if (account?.role !== 'admin') {
                return;
            }

            setLoading(true);
            try {
                const response = await getAllOrders({
                    page: 1,
                    pageSize: 100 // 获取足够多的订单以进行分析
                });

                if (response.orders) {
                    // 使用新的数据结构处理订单数据
                    const groupedData = groupOrdersByDate(response.orders);
                    setRealSalesData(groupedData);
                } else {
                    showMessage(t('admin.analytics.noOrderData'), 'warning');
                }
            } catch (error) {
                console.error('获取订单数据失败:', error);
                showMessage(t('admin.analytics.fetchDataError'), 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [account, t]);

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
    }, [loading, salesData, activeTab, chartsInitialized, timeRange, initSalesCharts]);

    // 当tab改变时，如果需要则初始化对应tab的图表
    useEffect(() => {
        // 当tab切换时，重置chartsInitialized状态
        setChartsInitialized(false);
    }, [activeTab]);

    // 使用防抖函数处理窗口大小变化
    const debouncedResize = useCallback(
        debounce(() => {
            const chartNames: (keyof ChartInstances)[] = [
                'salesChart', 'ordersChart', 'pageViewsChart', 
                'conversionRateChart', 'userSourcesChart', 'deviceDistributionChart',
                'responseTimeChart', 'errorRateChart', 'serverLoadChart'
            ];
            
            chartNames.forEach(name => resizeChart(name));
        }, 300),
        [resizeChart]
    );

    // 处理窗口大小变化
    useEffect(() => {
        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);

            // 销毁所有图表实例以防内存泄漏
            const chartNames: (keyof ChartInstances)[] = [
                'salesChart', 'ordersChart', 'pageViewsChart', 
                'conversionRateChart', 'userSourcesChart', 'deviceDistributionChart',
                'responseTimeChart', 'errorRateChart', 'serverLoadChart'
            ];
            
            chartNames.forEach(name => disposeChart(name));
        };
    }, [debouncedResize, disposeChart]);

    // 当时间范围改变时重新渲染图表
    useEffect(() => {
        if (activeTab === 0 && !loading) {
            console.log('时间范围改变，重新渲染图表:', timeRange);
            // 重置初始化状态，以便重新初始化图表
            setChartsInitialized(false);
        }
    }, [timeRange, activeTab, loading]);

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
