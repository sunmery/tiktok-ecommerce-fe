import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormLabel,
    Input,
    Modal,
    Sheet,
    Snackbar,
    Table,
    Typography
} from '@mui/joy'
import {Product} from '@/types/products'
import {productService} from '@/api/productService'
import {inventoryService} from '@/api/inventoryService'

export const Route = createLazyFileRoute('/merchant/inventory/')({
    component: Inventory,
})

interface InventoryAlert {
    productId: string
    threshold: number
    currentStock: number
}

interface StockAdjustment {
    id: string
    productId: string
    quantity: number
    reason: string
    date: string
}

export default function Inventory() {
    const {t} = useTranslation()
    const [products, setProducts] = useState<Product[]>([])
    const [alerts, setAlerts] = useState<InventoryAlert[]>([])
    const [adjustments, setAdjustments] = useState<StockAdjustment[]>([])
    const [alertOpen, setAlertOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [threshold, setThreshold] = useState(0)
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    })
    const [adjustmentOpen, setAdjustmentOpen] = useState(false)
    const [adjustmentData, setAdjustmentData] = useState({
        quantity: 0,
        reason: ''
    })

    useEffect(() => {
        loadProducts().then((r) => {
            console.log('routes/merchant/inventory/index.lazy.tsx触发loadProducts', r)
        }).catch((error) => {
            console.error('loadProducts error:', error)
        })
        loadStockAlerts().then((r) => {
            console.log('routes/merchant/inventory/index.lazy.tsx触发loadStockAlerts', r)
        }).catch((error) => {
            console.error('loadProducts error:', error)
        })
        loadStockAdjustmentHistory().then((r) => {
            console.log('routes/merchant/inventory/index.lazy.tsx触发loadStockAdjustmentHistory', r)
        }).catch((error) => {
            console.error('loadProducts error:', error)
        })
    }, [])

    const loadStockAlerts = async () => {
        try {
            const response = await inventoryService.getStockAlerts({
                merchantId: '',  // 由服务端从上下文获取
                page: 1,
                pageSize: 100
            })

            // 将获取到的警戒值转换为前端格式
            if (response.alerts && response.alerts.length > 0) {
                const newAlerts = response.alerts.map(alert => ({
                    productId: alert.productId,
                    threshold: alert.threshold,
                    currentStock: alert.currentStock
                }))
                setAlerts(newAlerts)
            }
        } catch (error) {
            console.error(t('inventory.alerts.load_error'), error)
        }
    }

    const loadStockAdjustmentHistory = async () => {
        try {
            const response = await inventoryService.getStockAdjustmentHistory({
                merchantId: '',  // 由服务端从上下文获取
                page: 1,
                pageSize: 20
            })

            // 将获取到的调整记录转换为前端格式
            if (response.adjustments && response.adjustments.length > 0) {
                const newAdjustments = response.adjustments.map(adj => ({
                    id: adj.id,
                    productId: adj.productId,
                    quantity: adj.quantity,
                    reason: adj.reason,
                    date: adj.createdAt
                }))
                setAdjustments(newAdjustments)
            }
        } catch (error) {
            console.error(t('inventory.adjustments.load_error'), error)
        }
    }

    const loadProducts = async () => {
        try {
            setLoading(true)
            const response = await productService.listRandomProducts({
                page: 1,
                pageSize: 20,
                status: 1
            })
            setProducts(response.items || [])

            // 检查库存警报
            checkLowStock(response.items || [])
        } catch (error) {
            console.error(t('inventory.products.load_error'), error)
            setSnackbar({
                open: true,
                message: t('inventory.products.load_error'),
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const checkLowStock = (products: Product[]) => {
        // 首先，确保 alerts 是最新的
        const updatedAlerts = [...alerts];

        // 更新所有 alert 的当前库存数据
        products.forEach(product => {
            const index = updatedAlerts.findIndex(a => a.productId === product.id);
            if (index >= 0) {
                // 更新现有警报的当前库存
                updatedAlerts[index] = {
                    ...updatedAlerts[index],
                    currentStock: product.inventory?.stock || 0
                };
            }
        });

        // 更新 alerts 状态
        setAlerts(updatedAlerts);
    }

    const handleSetAlert = async () => {
        if (selectedProduct && threshold > 0) {
            try {
                setLoading(true)
                // 调用后端API设置库存警戒值
                await inventoryService.setStockAlert({
                    productId: selectedProduct.id,
                    merchantId: selectedProduct?.inventory?.merchantId || '',
                    threshold: threshold
                })

                // 设置成功后，重新加载所有警戒值数据
                await loadStockAlerts()

                setAlertOpen(false)
                setSnackbar({
                    open: true,
                    message: t('inventory.alerts.set_success'),
                    severity: 'success'
                })

                // 重新检查库存警报
                checkLowStock(products)
            } catch (error) {
                console.error(t('inventory.alerts.set_error'), error)
                setSnackbar({
                    open: true,
                    message: t('inventory.alerts.set_error'),
                    severity: 'error'
                })
            } finally {
                setLoading(false)
            }
        }
    }

    const handleStockAdjustment = async (productId: string, quantity: number, reason: string) => {
        try {
            setLoading(true)
            // 调用后端API更新库存
            await inventoryService.updateProductStock({
                productId: productId,
                merchantId: selectedProduct?.inventory?.merchantId || '',
                stock: quantity,
                reason: reason
            })

            // 调整成功后重新加载数据
            await loadProducts()
            await loadStockAdjustmentHistory()

            setSnackbar({
                open: true,
                message: t('inventory.adjustments.success'),
                severity: 'success'
            })

            setAdjustmentOpen(false)

            // 使用最新的产品数据重新检查库存警报
            checkLowStock(products)
        } catch (error) {
            console.error(t('inventory.adjustments.error'), error)
            setSnackbar({
                open: true,
                message: t('inventory.adjustments.error'),
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const openAdjustmentModal = (product: Product) => {
        setSelectedProduct(product)
        setAdjustmentData({
            quantity: 0,
            reason: ''
        })
        setAdjustmentOpen(true)
    }

    return (
        <Box sx={{p: 2}}>
            <Typography level="h2" sx={{mb: 3}}>{t('inventory.title')}</Typography>

            {/* 库存警报 */}
            {alerts.length > 0 && (
                <Box sx={{mb: 3}}>
                    <Typography level="h3" sx={{mb: 2}}>{t('inventory.title')}</Typography>
                    {alerts
                        .filter(alert => alert.currentStock < alert.threshold)
                        .map((alert) => {
                            const product = products.find(p => p.id === alert.productId)
                            return (
                                <Alert
                                    key={alert.productId}
                                    color="warning"
                                    sx={{mb: 1}}
                                >
                                    {t('inventory.lowStock', {
                                        product: product?.name,
                                        current: alert.currentStock,
                                        threshold: alert.threshold
                                    })}
                                </Alert>
                            )
                        })}
                </Box>
            )}

            {/* 库存列表 */}
            <Sheet sx={{mb: 3}}>
                <Table>
                    <thead>
                    <tr>
                        <th>{t('inventory.product')}</th>
                        <th>{t('inventory.currentStock')}</th>
                        <th>{t('inventory.threshold')}</th>
                        <th>{t('inventory.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.inventory?.stock || 0}</td>
                            <td>{alerts.find(a => a.productId === product.id)?.threshold || '-'}</td>
                            <td>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedProduct(product)
                                            setThreshold(alerts.find(a => a.productId === product.id)?.threshold || 10)
                                            setAlertOpen(true)
                                        }}
                                    >
                                        {t('inventory.setAlert')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => openAdjustmentModal(product)}
                                    >
                                        {t('inventory.adjustStock')}
                                    </Button>
                                </Box>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Sheet>

            {/* {t('inventory.adjustStock')} */}
            <Box>
                <Typography level="h3" sx={{mb: 2}}>{t('inventory.adjustStock')}</Typography>
                <Sheet>
                    <Table>
                        <thead>
                        <tr>
                            <th>{t('inventory.adjustmentTime')}</th>
                            <th>{t('inventory.product')}</th>
                            <th>{t('inventory.adjustmentQuantity')}</th>
                            <th>{t('inventory.adjustmentReason')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {adjustments.map((adjustment) => {
                            const product = products.find(p => p.id === adjustment.productId)
                            return (
                                <tr key={adjustment.id}>
                                    <td>{new Date(adjustment.date).toLocaleString()}</td>
                                    <td>{product?.name}</td>
                                    <td>{adjustment.quantity > 0 ? `+${adjustment.quantity}` : adjustment.quantity}</td>
                                    <td>{adjustment.reason}</td>
                                </tr>
                            )
                        })}
                        {adjustments.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{textAlign: 'center'}}>{t('inventory.noAdjustments')}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Sheet>
            </Box>

            {/* 设置警戒值弹窗 */}
            <Modal
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Card sx={{maxWidth: 400, mx: 2}}>
                    <CardContent>
                        <Typography level="h3" sx={{mb: 2}}>{t('inventory.setAlertTitle')}</Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.alertProduct')}: {selectedProduct?.name}
                        </Typography>
                        <FormControl>
                            <FormLabel>{t('inventory.alertValue')}</FormLabel>
                            <Input
                                type="number"
                                value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value))}
                            />
                        </FormControl>
                        <Box sx={{mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                            <Button variant="outlined" color="neutral" onClick={() => setAlertOpen(false)}>
                                {t('inventory.cancel')}
                            </Button>
                            <Button onClick={handleSetAlert} loading={loading}>{t('inventory.confirm')}</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>

            {/* 库存调整弹窗 */}
            <Modal
                open={adjustmentOpen}
                onClose={() => setAdjustmentOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Card sx={{maxWidth: 400, mx: 2}}>
                    <CardContent>
                        <Typography level="h3" sx={{mb: 2}}>{t('inventory.adjustTitle')}</Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.alertProduct')}: {selectedProduct?.name}
                        </Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.currentStockValue')}: {selectedProduct?.inventory.stock || 0}
                        </Typography>
                        <FormControl sx={{mb: 2}}>
                            <FormLabel>{t('inventory.adjustQuantityLabel')}</FormLabel>
                            <Input
                                type="number"
                                value={adjustmentData.quantity}
                                onChange={(e) => setAdjustmentData(prev => ({
                                    ...prev,
                                    quantity: parseInt(e.target.value)
                                }))}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t('inventory.adjustReasonLabel')}</FormLabel>
                            <Input
                                value={adjustmentData.reason}
                                onChange={(e) => setAdjustmentData(prev => ({...prev, reason: e.target.value}))}
                            />
                        </FormControl>
                        <Box sx={{mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                            <Button variant="outlined" color="neutral" onClick={() => setAdjustmentOpen(false)}>
                                {t('inventory.cancel')}
                            </Button>
                            <Button
                                onClick={() => selectedProduct && handleStockAdjustment(
                                    selectedProduct.id,
                                    adjustmentData.quantity,
                                    adjustmentData.reason || t('inventory.manualAdjustment')
                                )}
                                loading={loading}
                                disabled={!adjustmentData.quantity || !selectedProduct}
                            >
                                {t('inventory.confirm')}
                            </Button>
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
