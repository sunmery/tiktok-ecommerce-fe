import {FC, useEffect, useRef, useState} from 'react'
import * as echarts from 'echarts'
import {Box, IconButton, Slider, Typography} from '@mui/joy'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

// 导入中国地图数据
import {registerMap} from 'echarts/core'
import * as chinaGeoJson from '@/shared/assets/data/geo/china.json'

// 定义电商数据类型
interface CityData {
    name: string
    value: number
}


// 城市坐标映射
const geoCoordMap: Record<string, [number, number]> = {
    '北京': [116.4551, 40.2539],
    '上海': [121.4648, 31.2891],
    '广州': [113.5107, 23.2196],
    '深圳': [114.5435, 22.5439],
    '杭州': [120.1675, 30.2631],
    '福州': [119.4543, 25.9222],
    '重庆': [107.7539, 30.1904],
    '郑州': [113.4668, 34.6234],
    '厦门': [118.1689, 24.6478],
    '宁波': [121.5967, 29.6466]
}


interface YearData {
    year: number
    cities: CityData[]
}


interface ChinaEcommerceMapProps {
    title?: string
    height?: string | number
    width?: string | number
}


// 模拟2013-2019年各城市电商数据
const mockEcommerceData: YearData[] = [
    {
        year: 2013,
        cities: [
            {name: '杭州', value: 100},
            {name: '广州', value: 95},
            {name: '北京', value: 90},
            {name: '上海', value: 85},
            {name: '深圳', value: 80},
            {name: '福州', value: 75},
            {name: '重庆', value: 70},
            {name: '郑州', value: 65},
            {name: '厦门', value: 60},
            {name: '宁波', value: 55},
        ]
    },
    {
        year: 2014,
        cities: [
            {name: '杭州', value: 110},
            {name: '广州', value: 105},
            {name: '北京', value: 95},
            {name: '上海', value: 90},
            {name: '深圳', value: 85},
            {name: '福州', value: 80},
            {name: '重庆', value: 75},
            {name: '郑州', value: 70},
            {name: '厦门', value: 65},
            {name: '宁波', value: 60},
        ]
    },
    {
        year: 2015,
        cities: [
            {name: '杭州', value: 120},
            {name: '广州', value: 115},
            {name: '北京', value: 105},
            {name: '上海', value: 100},
            {name: '深圳', value: 95},
            {name: '福州', value: 90},
            {name: '重庆', value: 85},
            {name: '郑州', value: 80},
            {name: '厦门', value: 75},
            {name: '宁波', value: 70},
        ]
    },
    {
        year: 2016,
        cities: [
            {name: '杭州', value: 130},
            {name: '广州', value: 125},
            {name: '北京', value: 120},
            {name: '上海', value: 115},
            {name: '深圳', value: 110},
            {name: '福州', value: 105},
            {name: '重庆', value: 100},
            {name: '郑州', value: 95},
            {name: '厦门', value: 90},
            {name: '宁波', value: 85},
        ]
    },
    {
        year: 2017,
        cities: [
            {name: '杭州', value: 145},
            {name: '广州', value: 140},
            {name: '北京', value: 135},
            {name: '上海', value: 130},
            {name: '深圳', value: 125},
            {name: '福州', value: 120},
            {name: '重庆', value: 115},
            {name: '郑州', value: 110},
            {name: '厦门', value: 105},
            {name: '宁波', value: 100},
        ]
    },
    {
        year: 2018,
        cities: [
            {name: '杭州', value: 160},
            {name: '广州', value: 155},
            {name: '北京', value: 150},
            {name: '上海', value: 145},
            {name: '深圳', value: 140},
            {name: '福州', value: 135},
            {name: '重庆', value: 130},
            {name: '郑州', value: 125},
            {name: '厦门', value: 120},
            {name: '宁波', value: 115},
        ]
    },
    {
        year: 2019,
        cities: [
            {name: '杭州', value: 175},
            {name: '广州', value: 170},
            {name: '北京', value: 165},
            {name: '上海', value: 160},
            {name: '深圳', value: 155},
            {name: '福州', value: 150},
            {name: '重庆', value: 145},
            {name: '郑州', value: 140},
            {name: '厦门', value: 135},
            {name: '宁波', value: 130},
        ]
    }


]

const ChinaEcommerceMap: FC<ChinaEcommerceMapProps> = ({
                                                           title = '跨境电商百度指数',
                                                           height = 600,
                                                           width = '100%'
                                                       }) => {
    const chartRef = useRef<HTMLDivElement>(null)
    const [chart, setChart] = useState<echarts.ECharts | null>(null)
    const [currentYearIndex, setCurrentYearIndex] = useState<number>(1) // 默认显示2014年数据
    const [playing, setPlaying] = useState<boolean>(false)
    const [playInterval, setPlayIntervalState] = useState<number | null>(null)

    // 加载中国地图数据
    useEffect(() => {
        // 注册中国地图数据
        registerMap('china', chinaGeoJson as any)
        initChart()

        return () => {
            // 组件卸载时销毁图表
            if (chart) {
                chart.dispose()
            }

            // 清除播放定时器
            if (typeof playInterval === 'number') {
                clearInterval(playInterval)
            }
        }
    }, [])

    // 初始化图表
    const initChart = () => {
        if (!chartRef.current) return

        const newChart = echarts.init(chartRef.current)
        newChart.showLoading()

        try {
            // 设置图表配置项
            const option = {
                title: {
                    text: title,
                    subtext: '数据来源：模拟数据',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    },
                    subtextStyle: {
                        color: '#ccc'
                    }


                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (指数)'
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}


                    }


                },
                visualMap: {
                    min: 55,
                    max: 175,
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: {
                        color: '#fff'
                    }


                },
                geo: {
                    map: 'china',
                    roam: true,
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff'
                        },
                        itemStyle: {
                            areaColor: '#2a333d'
                        }


                    },
                    itemStyle: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    }


                },
                series: [
                    {
                        name: '地区电商指数',
                        type: 'map',
                        map: 'china',
                        geoIndex: 0,
                        label: {
                            show: true,
                            color: '#fff'
                        },
                        data: mockEcommerceData[currentYearIndex].cities
                    },
                    {
                        name: '城市电商指数',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(mockEcommerceData[currentYearIndex].cities),
                        symbolSize: function (val: number[]) {
                            return val[2] / 10;
                        },
                        label: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }


                        },
                        itemStyle: {
                            color: '#ddb926'
                        }


                    }


                ]
            }


            newChart.hideLoading()
            newChart.setOption(option)
            setChart(newChart)

            // 监听窗口大小变化，调整图表大小
            window.addEventListener('resize', () => {
                newChart.resize()
            })
        } catch (error) {
            console.error('初始化图表失败:', error)
            newChart.hideLoading()
        }
    }

    // 转换城市数据为地图坐标点
    const convertData = (data: CityData[]) => {
        const result: any[] = []
        data.forEach(item => {
            const geoCoord = geoCoordMap[item.name]
            if (geoCoord) {
                result.push({
                    name: item.name,
                    value: [...geoCoord, item.value]
                })
            }
        })
        return result
    }


    // 更新图表数据
    const updateChartData = (yearIndex: number) => {
        if (!chart) return

        const yearData = mockEcommerceData[yearIndex]
        chart.setOption({
            title: {
                text: `${title} - ${yearData.year}数据统计情况`
            },
            series: [
                {
                    name: '电商指数',
                    data: convertData(mockEcommerceData[currentYearIndex].cities)
                },
                {
                    data: mockEcommerceData[currentYearIndex].cities
                }
            ]
        })
    }


    // 处理年份变化
    useEffect(() => {
        updateChartData(currentYearIndex)
    }, [currentYearIndex])

    // 处理播放/暂停
    const togglePlay = () => {
        if (playing) {
            // 暂停
            if (playInterval) {
                clearInterval(playInterval)
                setPlayIntervalState(null)
            }
        } else {
            // 播放
            const interval = window.setInterval(() => {
                setCurrentYearIndex(prev => {
                    const next = prev + 1
                    // 循环播放
                    return next >= mockEcommerceData.length ? 0 : next
                })
            }, 2000)

            setPlayIntervalState(interval)
        }

        setPlaying(!playing)
    }

    return (
        <Box sx={{height, width, position: 'relative', bgcolor: '#061633'}}>
            <div ref={chartRef} style={{width: '100%', height: '100%'}}/>

            {/* 年份选择器和播放控制 */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 4
            }}>
                <Typography level="body-md" sx={{color: '#fff', mb: 1}}>
                    {mockEcommerceData[currentYearIndex].year}年数据
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500}}>
                    <IconButton
                        onClick={togglePlay}
                        sx={{color: '#fff', mr: 2}}
                    >
                        {playing ? <PauseIcon/> : <PlayArrowIcon/>}
                    </IconButton>

                    <Slider
                        value={currentYearIndex}
                        min={0}
                        max={mockEcommerceData.length - 1}
                        onChange={(_, value) => setCurrentYearIndex(value as number)}
                        sx={{
                            flexGrow: 1,
                            '& .MuiSlider-thumb': {
                                bgcolor: '#fff'
                            },
                            '& .MuiSlider-track': {
                                bgcolor: '#4caf50'
                            },
                            '& .MuiSlider-rail': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ChinaEcommerceMap
