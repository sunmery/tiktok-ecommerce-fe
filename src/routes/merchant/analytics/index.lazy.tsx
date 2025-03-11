import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { Box, Card, CardContent, Grid, Typography } from '@mui/joy'
import * as echarts from 'echarts'
import { Order } from '@/types/orders'
import { orderService } from '@/api/orderService'
import Breadcrumbs from '@/components/Breadcrumbs'

export const Route = createLazyFileRoute('/merchant/analytics/')({ 
  component: Analytics,
})

interface SalesData {
  date: string
  sales: number
  orders: number
}

// 模拟销售数据
const mockSalesData: SalesData[] = [
  { date: '2024-01-01', sales: 15800, orders: 158 },
  { date: '2024-01-02', sales: 12500, orders: 125 },
  { date: '2024-01-03', sales: 18900, orders: 189 },
  { date: '2024-01-04', sales: 16700, orders: 167 },
  { date: '2024-01-05', sales: 21500, orders: 215 },
  { date: '2024-01-06', sales: 25800, orders: 258 },
  { date: '2024-01-07', sales: 23400, orders: 234 },
  { date: '2024-01-08', sales: 19800, orders: 198 },
  { date: '2024-01-09', sales: 22300, orders: 223 },
  { date: '2024-01-10', sales: 24600, orders: 246 },
  { date: '2024-01-11', sales: 20100, orders: 201 },
  { date: '2024-01-12', sales: 17800, orders: 178 },
  { date: '2024-01-13', sales: 26500, orders: 265 },
  { date: '2024-01-14', sales: 28900, orders: 289 }
]

// 模拟商品销售数据
interface ProductSales {
  name: string
  sales: number
  quantity: number
}

const mockProductSales: ProductSales[] = [
  { name: '智能手机', sales: 189900, quantity: 189 },
  { name: '无线耳机', sales: 85600, quantity: 428 },
  { name: '智能手表', sales: 75800, quantity: 189 },
  { name: '平板电脑', sales: 158900, quantity: 159 },
  { name: '笔记本电脑', sales: 356000, quantity: 89 },
  { name: '智能音箱', sales: 43400, quantity: 217 },
  { name: '运动相机', sales: 95600, quantity: 239 },
  { name: '游戏手柄', sales: 32800, quantity: 328 },
  { name: '充电宝', sales: 28900, quantity: 578 },
  { name: '蓝牙音箱', sales: 35600, quantity: 254 },
  { name: '智能门锁', sales: 45800, quantity: 114 },
  { name: '智能台灯', sales: 25600, quantity: 256 },
  { name: '电动牙刷', sales: 18900, quantity: 189 },
  { name: '智能体重秤', sales: 15800, quantity: 158 },
  { name: '空气净化器', sales: 89600, quantity: 149 }
]

export default function Analytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [productSales, setProductSales] = useState<ProductSales[]>([])
  
  // 添加图表DOM引用
  const salesTrendChartRef = useRef<HTMLDivElement>(null)
  const productSalesChartRef = useRef<HTMLDivElement>(null)
  const productRankChartRef = useRef<HTMLDivElement>(null)
  
  // 添加图表实例状态
  const [charts, setCharts] = useState<{
    trendChart: echarts.ECharts | null,
    pieChart: echarts.ECharts | null,
    rankChart: echarts.ECharts | null
  }>({
    trendChart: null,
    pieChart: null,
    rankChart: null
  })

  useEffect(() => {
    loadSalesData()
  }, [])

  const loadSalesData = async () => {
    try {
      const response = await orderService.listOrder({
        page: 1,
        pageSize: 100
      })
      processOrdersData(response.orders || [])
    } catch (error) {
      console.error('加载销售数据失败:', error)
    }
  }

  const processOrdersData = (orders: Order[]) => {
    // 按日期分组的销售数据
    const dailySales = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString()
      const sales = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      if (!acc[date]) {
        acc[date] = { sales: 0, orders: 0 }
      }
      acc[date].sales += sales
      acc[date].orders += 1
      return acc
    }, {} as Record<string, { sales: number, orders: number }>)

    // 转换为数组格式
    const salesDataArray = Object.entries(dailySales).map(([date, data]) => ({
      date,
      sales: data.sales,
      orders: data.orders
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setSalesData(salesDataArray)

    // 按商品分组的销售数据
    const productSalesMap = new Map<string, { sales: number, quantity: number }>()
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSalesMap.get(item.name) || { sales: 0, quantity: 0 }
        productSalesMap.set(item.name, {
          sales: existing.sales + item.price * item.quantity,
          quantity: existing.quantity + item.quantity
        })
      })
    })

    const productSalesArray = Array.from(productSalesMap.entries()).map(([name, data]) => ({
      name,
      sales: data.sales,
      quantity: data.quantity
    })).sort((a, b) => b.sales - a.sales)

    setProductSales(productSalesArray)

    // 初始化图表
    initCharts(salesDataArray, productSalesArray)
  }

  const initCharts = (salesData: SalesData[], productSales: ProductSales[]) => {
    // 确保DOM元素已经渲染
    if (!salesTrendChartRef.current || !productSalesChartRef.current || !productRankChartRef.current) {
      return
    }
    
    // 销售趋势图表
    const trendChart = echarts.init(salesTrendChartRef.current)
    trendChart.setOption({
      title: { text: '销售趋势' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '订单数'] },
      xAxis: {
        type: 'category',
        data: salesData.map(item => item.date)
      },
      yAxis: [
        { type: 'value', name: '销售额' },
        { type: 'value', name: '订单数' }
      ],
      series: [
        {
          name: '销售额',
          type: 'line',
          data: salesData.map(item => item.sales),
          smooth: true,
          areaStyle: {}, // 添加区域填充样式
          itemStyle: {
            color: '#1976d2' // 设置线条颜色
          }
        },
        {
          name: '订单数',
          type: 'bar',
          yAxisIndex: 1,
          data: salesData.map(item => item.orders),
          itemStyle: {
            color: '#4caf50' // 设置柱状图颜色
          }
        }
      ]
    })

    // 商品销售占比图表
    const pieChart = echarts.init(productSalesChartRef.current)
    pieChart.setOption({
      title: { text: '商品销售占比' },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'], // 改为环形图
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10, // 圆角
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          data: productSales.map(item => ({
            name: item.name,
            value: item.sales
          }))
        }
      ]
    })

    // 商品销量排行图表
    const rankChart = echarts.init(productRankChartRef.current)
    rankChart.setOption({
      title: { text: '商品销量排行' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: productSales.slice(0, 10).map(item => item.name),
        axisLabel: {
          width: 100,
          overflow: 'truncate',
          interval: 0
        }
      },
      series: [
        {
          type: 'bar',
          data: productSales.slice(0, 10).map(item => item.quantity),
          itemStyle: {
            color: function(params) {
              // 根据销量设置不同颜色
              const colorList = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                               '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];
              return colorList[params.dataIndex % colorList.length];
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
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
  }
  
  // 添加图表清理和调整大小的副作用
  useEffect(() => {
    // 窗口大小变化时重新调整图表大小
    const handleResize = () => {
      Object.values(charts).forEach(chart => {
        chart && chart.resize()
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      Object.values(charts).forEach(chart => {
        chart && chart.dispose()
      })
    }
  }, [charts])

  return (
    <Box sx={{ p: 2 }}>
      {/* 面包屑导航 */}
      <Breadcrumbs pathMap={{ 'analytics': '销售报告' }} />

      <Typography level="h2" sx={{ mb: 3 }}>销售报告</Typography>

      <Grid container spacing={2}>
        {/* 销售概览卡片 */}
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography level="h3">总销售额</Typography>
              <Typography level="h2" color="primary">
                ¥{salesData.reduce((sum, item) => sum + item.sales, 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography level="h3">总订单数</Typography>
              <Typography level="h2" color="success">
                {salesData.reduce((sum, item) => sum + item.orders, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography level="h3">平均客单价</Typography>
              <Typography level="h2" color="warning">
                ¥{(salesData.reduce((sum, item) => sum + item.sales, 0) / 
                   Math.max(1, salesData.reduce((sum, item) => sum + item.orders, 0))).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 销售趋势图表 */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <div ref={salesTrendChartRef} style={{ height: '400px' }} />
            </CardContent>
          </Card>
        </Grid>

        {/* 商品销售占比图表 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <div ref={productSalesChartRef} style={{ height: '400px' }} />
            </CardContent>
          </Card>
        </Grid>

        {/* 商品销量排行图表 */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <div ref={productRankChartRef} style={{ height: '400px' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}