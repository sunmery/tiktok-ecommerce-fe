import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemContent,
    Sheet,
    Tab,
    Table,
    TabList,
    TabPanel,
    Tabs,
    Typography
} from '@mui/joy'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user'
import {inventoryService, LowStockProduct, StockAdjustment, StockAlert} from '@/api/inventoryService'
import WarningIcon from '@mui/icons-material/Warning'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import InventoryIcon from '@mui/icons-material/Inventory'
import TimelineIcon from '@mui/icons-material/Timeline'

export const Route = createLazyFileRoute('/merchant/inventory/monitoring/')({
    component: InventoryMonitoring,
})

export default function InventoryMonitoring() {
    const {account} = useSnapshot(userStore)
    const [loading, setLoading] = useState(true)
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
    const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
    const [recentAdjustments, setRecentAdjustments] = useState<StockAdjustment[]>([])
    const [activeTab, setActiveTab] = useState(0)
    const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)

    // 加载低库存产品数据
    const loadLowStockProducts = async () => {
        try {
            const response = await inventoryService.getLowStockProducts({
                threshold: 10,
                merchantId: account.id,
                page: 1,
                pageSize: 10
            })
            setLowStockProducts(response.products || [])
            setError(null)
        } catch (err) {
            console.error('加载低库存产品失败:', err)
            setError('加载低库存产品失败')
        }
    }

    // 加载库存警报配置
    const loadStockAlerts = async () => {
        try {
            const response = await inventoryService.getStockAlerts({
                merchantId: account.id,
                page: 1,
                pageSize: 10
            })
            setStockAlerts(response.alerts || [])
            setError(null)
        } catch (err) {
            console.error('加载库存警报配置失败:', err)
            setError('加载库存警报配置失败')
        }
    }

    // 加载最近的库存调整记录
    const loadRecentAdjustments = async () => {
        try {
            // 这里我们获取所有产品的调整记录
            const response = await inventoryService.getStockAdjustmentHistory({
                // productId: 'all', // 假设后端支持使用'all'获取所有产品的记录
                merchantId: account.id,
                page: 1,
                pageSize: 5
            })
            setRecentAdjustments(response.adjustments || [])
            setError(null)
        } catch (err) {
            console.error('加载库存调整记录失败:', err)
            setError('加载库存调整记录失败')
        }
    }

    // 刷新所有数据
    const refreshData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                loadLowStockProducts(),
                loadStockAlerts(),
                loadRecentAdjustments()
            ])
            setLastUpdated(new Date())
        } catch (err) {
            console.error('刷新数据失败:', err)
        } finally {
            setLoading(false)
        }
    }

    // 切换自动刷新
    const toggleAutoRefresh = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval)
            setRefreshInterval(null)
        } else {
            const interval = window.setInterval(() => {
                refreshData()
            }, 30000) // 每30秒刷新一次
            setRefreshInterval(interval)
        }
    }

    // 初始加载数据
    useEffect(() => {
        refreshData()
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval)
            }
        }
    }, [])

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">库存监控中心</Typography>
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    {lastUpdated && (
                        <Typography level="body-sm" color="neutral">
                            最后更新: {lastUpdated.toLocaleTimeString()}
                        </Typography>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={refreshData}
                        startDecorator={<TimelineIcon/>}
                        loading={loading}
                    >
                        刷新数据
                    </Button>
                    <Button
                        variant={refreshInterval ? "solid" : "outlined"}
                        color={refreshInterval ? "success" : "neutral"}
                        onClick={toggleAutoRefresh}
                    >
                        {refreshInterval ? "自动刷新: 开" : "自动刷新: 关"}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert color="danger" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value as number)}
                sx={{mb: 2}}
            >
                <TabList>
                    <Tab value={0} variant={activeTab === 0 ? "solid" : "plain"}>低库存产品</Tab>
                    <Tab value={1} variant={activeTab === 1 ? "solid" : "plain"}>库存警报配置</Tab>
                    <Tab value={2} variant={activeTab === 2 ? "solid" : "plain"}>最近调整记录</Tab>
                </TabList>

                {/* 低库存产品 */}
                <TabPanel value={0}>
                    <Card>
                        <CardContent>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <WarningIcon color="warning" sx={{mr: 1}}/>
                                <Typography level="h3">低库存产品</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {loading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : lowStockProducts.length > 0 ? (
                                <Sheet>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>产品名称</th>
                                            <th>当前库存</th>
                                            <th>警戒值</th>
                                            <th>状态</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {lowStockProducts.map((product) => (
                                            <tr key={product.productId}>
                                                <td>
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        {product.imageUrl && (
                                                            <Box
                                                                component="img"
                                                                src={product.imageUrl}
                                                                alt={product.productName}
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    mr: 2,
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                        )}
                                                        {product.productName}
                                                    </Box>
                                                </td>
                                                <td>{product.currentStock}</td>
                                                <td>{product.threshold}</td>
                                                <td>
                                                    <Alert
                                                        color={product.currentStock === 0 ? "danger" : "warning"}
                                                        size="sm"
                                                        variant="soft"
                                                    >
                                                        {product.currentStock === 0 ? "缺货" : "库存不足"}
                                                    </Alert>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Sheet>
                            ) : (
                                <Box sx={{p: 2, textAlign: 'center'}}>
                                    <Typography>没有低库存产品</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* 库存警报配置 */}
                <TabPanel value={1}>
                    <Card>
                        <CardContent>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <NotificationsActiveIcon color="primary" sx={{mr: 1}}/>
                                <Typography level="h3">库存警报配置</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {loading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : stockAlerts.length > 0 ? (
                                <Sheet>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>产品名称</th>
                                            <th>当前库存</th>
                                            <th>警戒值</th>
                                            <th>更新时间</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {stockAlerts.map((alert) => (
                                            <tr key={alert.productId}>
                                                <td>{alert.productName}</td>
                                                <td>{alert.currentStock}</td>
                                                <td>{alert.threshold}</td>
                                                <td>{new Date(alert.updatedAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Sheet>
                            ) : (
                                <Box sx={{p: 2, textAlign: 'center'}}>
                                    <Typography>没有设置库存警报</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* 最近调整记录 */}
                <TabPanel value={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <InventoryIcon color="success" sx={{mr: 1}}/>
                                <Typography level="h3">最近库存调整记录</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {loading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : recentAdjustments.length > 0 ? (
                                <List>

                                    {recentAdjustments.map((adjustment) => (
                                        <ListItem key={adjustment.id}>
                                            <ListItemContent>
                                                <Typography level="title-md">
                                                    {adjustment.productName}
                                                </Typography>
                                                <Typography level="body-sm">
                                                    调整数量: {adjustment.quantity > 0 ? `+${adjustment.quantity}` : adjustment.quantity} |
                                                    原因: {adjustment.reason} |
                                                    时间: {new Date(adjustment.createdAt).toLocaleString()}
                                                </Typography>
                                            </ListItemContent>
                                        </ListItem>
                                    ))}

                                </List>
                            ) : (
                                <Box sx={{p: 2, textAlign: 'center'}}>
                                    <Typography>没有库存调整记录</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </TabPanel>
            </Tabs>
        </Box>
    )
}
