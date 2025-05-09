import { useSnapshot } from "valtio/react";
import { userStore } from "@/store/user.ts";
import { useEffect, useState } from "react";
import { inventoryService, SetStockAlertRequest, StockAlert } from "@/features/dashboard/merchant/inventory/api.ts";
import { Product } from "@/features/products/types.ts";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider, FormControl, FormLabel, Input,
    Modal,
    Sheet, Snackbar,
    Table,
    Typography
} from "@mui/joy";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AddIcon from "@mui/icons-material/Add";
import { merchantProductService } from "@/features/dashboard/merchant/products/api.ts";

export default function InventoryAlerts() {
    const {account} = useSnapshot(userStore)
    const [loading, setLoading] = useState(true)
    const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [threshold, setThreshold] = useState(10)
    const [modalOpen, setModalOpen] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    })
    const {t} = useTranslation()

    // 加载库存警报配置
    const loadStockAlerts = async () => {
        try {
            setLoading(true)
            const response = await inventoryService.getStockAlerts({
                merchantId: account.id,
                page: 1,
                pageSize: 50
            })
            setStockAlerts(response.alerts || [])
        } catch (err) {
            console.error(t('inventory.alerts.load_failed'), err)
            setSnackbar({
                open: true,
                message: t('inventory.alerts.load_failed'),
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // 加载产品列表
    const loadProducts = async () => {
        try {
            const response = await merchantProductService.getMerchantProducts({
                page: 1,
                pageSize: 50
            })
            setProducts(response.items || [])
        } catch (err) {
            console.error(t('inventory.alerts.product_load_failed'), err)
            setSnackbar({
                open: true,
                message: t('inventory.alerts.product_load_failed'),
                severity: 'error'
            })
        }
    }

    // 设置库存警报阈值
    const handleSetAlert = async () => {
        if (!selectedProduct) return

        try {
            setLoading(true)
            const request: SetStockAlertRequest = {
                productId: selectedProduct.id,
                merchantId: account.id,
                threshold: threshold
            }
            await inventoryService.setStockAlert(request)

            // 刷新警报列表
            await loadStockAlerts()

            setModalOpen(false)
            setSnackbar({
                open: true,
                message: t('inventory.alerts.set_success'),
                severity: 'success'
            })
        } catch (err) {
            console.error(t('inventory.alerts.set_failed'), err)
            setSnackbar({
                open: true,
                message: t('inventory.alerts.set_failed'),
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    // 打开设置警报模态框
    const openAlertModal = (product: Product) => {
        setSelectedProduct(product)
        // 检查是否已有警报设置，如果有则使用现有阈值
        const existingAlert = stockAlerts.find(alert => alert.productId === product.id)
        setThreshold(existingAlert ? existingAlert.threshold : 10)
        setModalOpen(true)
    }

    // 初始加载数据
    useEffect(() => {
        Promise.all([loadStockAlerts(), loadProducts()])
            .then(() => {
                console.log(t('inventory.alerts.load_complete'))
            }).catch(err => {
            console.error('加载数据失败:', err)
        })
    }, [])

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('inventory.alerts.title')}</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => loadStockAlerts()}
                    startDecorator={<RefreshIcon/>}
                    loading={loading}
                >
                    {t('inventory.alerts.refresh')}
                </Button>
            </Box>

            {/* 当前警报配置 */}
            <Card sx={{mb: 3}}>
                <CardContent>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <NotificationsActiveIcon color="primary" sx={{mr: 1}}/>
                        <Typography level="h3">{t('inventory.alerts.current_config')}</Typography>
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
                                    <th>{t('inventory.alerts.product_name')}</th>
                                    <th>{t('inventory.alerts.current_stock')}</th>
                                    <th>{t('inventory.alerts.threshold')}</th>
                                    <th>{t('inventory.alerts.status')}</th>
                                    <th>{t('inventory.alerts.actions')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stockAlerts.map((alert) => {
                                    const product = products.find(p => p.id === alert.productId)
                                    const isLowStock = alert.currentStock < alert.threshold
                                    return (
                                        <tr key={alert.productId}>
                                            <td>{alert.productName || product?.name || t('inventory.alerts.unknown_product')}</td>
                                            <td>{alert.currentStock}</td>
                                            <td>{alert.threshold}</td>
                                            <td>
                                                <Alert
                                                    color={isLowStock ? "warning" : "success"}
                                                    size="sm"
                                                    variant="soft"
                                                >
                                                    {isLowStock ? t('inventory.alerts.low_stock') : t('inventory.alerts.stock_normal')}
                                                </Alert>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    onClick={() => product && openAlertModal(product)}
                                                >
                                                    修改阈值
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </Sheet>
                    ) : (
                        <Box sx={{p: 2, textAlign: 'center'}}>
                            <Typography>暂无库存警报配置</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* 添加新警报 */}
            <Card>
                <CardContent>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <AddIcon color="primary" sx={{mr: 1}}/>
                        <Typography level="h3">{t('inventory.alerts.add_new_title')}</Typography>
                    </Box>
                    <Divider sx={{mb: 2}}/>
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                            <CircularProgress/>
                        </Box>
                    ) : products.length > 0 ? (
                        <Sheet>
                            <Table>
                                <thead>
                                <tr>
                                    <th>{t('inventory.alerts.product_name')}</th>
                                    <th>{t('inventory.alerts.current_stock')}</th>
                                    <th>{t('inventory.alerts.actions')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products
                                    .filter(product => !stockAlerts.some(alert => alert.productId === product.id))
                                    .map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.inventory.stock || 0}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => openAlertModal(product)}
                                                >
                                                    {t('inventory.alerts.set_threshold')}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                {products.filter(product => !stockAlerts.some(alert => alert.productId === product.id)).length === 0 && (
                                    <tr>
                                        <td colSpan={3}
                                            style={{textAlign: 'center'}}>{t('inventory.alerts.all_products_alerted')}</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Sheet>
                    ) : (
                        <Box sx={{p: 2, textAlign: 'center'}}>
                            <Typography>{t('inventory.alerts.no_products')}</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* 设置警戒值弹窗 */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Card sx={{maxWidth: 400, mx: 2}}>
                    <CardContent>
                        <Typography level="h3" sx={{mb: 2}}>{t('inventory.alerts.set_alert_modal_title')}</Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.alerts.product_label')}: {selectedProduct?.name}
                        </Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.alerts.current_stock_label')}: {selectedProduct?.inventory.stock || 0}
                        </Typography>
                        <FormControl>
                            <FormLabel>{t('inventory.alerts.threshold_label')}</FormLabel>
                            <Input
                                type="number"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value))}
                            />
                        </FormControl>
                        <Box sx={{mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                            <Button variant="outlined" color="neutral" onClick={() => setModalOpen(false)}>
                                {t('inventory.alerts.cancel')}
                            </Button>
                            <Button onClick={handleSetAlert} loading={loading}>{t('inventory.alerts.confirm')}</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>

            {/* 提示消息 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
            >
                <Alert
                    color={snackbar.severity === 'error' ? 'danger' : 'success'}
                    variant="soft"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
