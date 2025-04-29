import {createLazyFileRoute} from '@tanstack/react-router'
import { useState} from 'react'
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
    Radio, // 新增导入
    RadioGroup, // 新增导入
    Sheet,
    Snackbar,
    Table,
    Typography
} from '@mui/joy'
import {GetMerchantProductsReq, Product, Products} from '@/types/products'
import {productService} from '@/api/productService'
import {inventoryService} from '@/api/inventoryService'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import RefreshIcon from '@mui/icons-material/Refresh'

export const Route = createLazyFileRoute('/merchant/inventory/')({
    component: Inventory,
})

export default function Inventory() {
    const {t} = useTranslation()
    const queryClient = useQueryClient()
    const [alertOpen, setAlertOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [threshold, setThreshold] = useState(0)
    const [adjustmentOpen, setAdjustmentOpen] = useState(false)
    const [adjustmentData, setAdjustmentData] = useState({
        quantity: 0,
        reason: ''
    })
    const [adjustmentMode, setAdjustmentMode] = useState('relative'); // Add this line
    const [adjustmentValue, setAdjustmentValue] = useState(''); // Add this line for the input value
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    })

    // 获取商家商品列表
    const {data: products = [], isLoading: productsLoading, refetch: refetchProducts} = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await productService.getMerchantProducts({
                page: 1,
                pageSize: 20,
                status: 1
            })
            return response.items || []
        }
    })

    // 获取库存警报
    const {data: alerts = [], isLoading: alertsLoading, refetch: refetchAlerts} = useQuery({
        queryKey: ['stockAlerts'],
        queryFn: async () => {
            const response = await inventoryService.getStockAlerts({
                page: 1,
                pageSize: 100
            })
            return response.alerts || []
        }
    })

    // 获取库存调整历史
    const {data: adjustments = [], isLoading: adjustmentsLoading, refetch: refetchAdjustments} = useQuery({
        queryKey: ['stockAdjustments'],
        queryFn: async () => {
            const response = await inventoryService.getStockAdjustmentHistory({
                page: 1,
                pageSize: 20
            })
            return response.adjustments || []
        }
    })

    // 刷新所有数据
    const handleRefreshAll = async () => {
        await Promise.all([
            refetchProducts(),
            refetchAlerts(),
            refetchAdjustments()
        ])
        setSnackbar({
            open: true,
            message: t('inventory.refreshSuccess'),
            severity: 'success'
        })
    }

    const handleSetAlert = async () => {
        if (selectedProduct && threshold > 0) {
            try {
                await inventoryService.setStockAlert({
                    productId: selectedProduct.id,
                    merchantId: selectedProduct?.inventory?.merchantId || '',
                    threshold: threshold
                })

                // 刷新警报数据
                await refetchAlerts()
                setAlertOpen(false)
                setSnackbar({
                    open: true,
                    message: t('inventory.alerts.set_success'),
                    severity: 'success'
                })
            } catch (error) {
                console.error(t('inventory.alerts.set_error'), error)
                setSnackbar({
                    open: true,
                    message: t('inventory.alerts.set_error'),
                    severity: 'error'
                })
            }
        }
    }

    const handleStockAdjustment = async () => {
        if (!selectedProduct) return

        const currentStock = selectedProduct.inventory?.stock || 0
        const reason = adjustmentData.reason || t('inventory.manualAdjustment')
        const value = parseInt(adjustmentValue) // Use adjustmentValue state

        if (isNaN(value)) {
            setSnackbar({ open: true, message: t('inventory.invalidQuantity'), severity: 'error' })
            return
        }

        let quantityChange: number

        if (adjustmentMode === 'set') {
            const targetQuantity = value
            if (targetQuantity < 0) {
                setSnackbar({ open: true, message: t('inventory.negativeStockError'), severity: 'error' })
                return
            }
            quantityChange = targetQuantity - currentStock
        } else { // relative mode
            quantityChange = value
            const finalQuantity = currentStock + quantityChange
            if (finalQuantity < 0) {
                setSnackbar({ open: true, message: t('inventory.negativeResultError'), severity: 'error' })
                return
            }
        }

        try {
            await inventoryService.updateProductStock({
                productId: selectedProduct.id,
                merchantId: selectedProduct?.inventory?.merchantId || '',
                stock: quantityChange, // API 接收的是变化量
                reason: reason
            })

            // 刷新所有相关数据
            await Promise.all([
                refetchProducts(),
                refetchAdjustments()
            ])

            setSnackbar({
                open: true,
                message: t('inventory.adjustments.success'),
                severity: 'success'
            })
            setAdjustmentOpen(false)
            setAdjustmentValue('') // 重置输入值
            setAdjustmentData(prev => ({ ...prev, reason: '' })) // 重置原因
        } catch (error) {
            console.error(t('inventory.adjustments.error'), error)
            setSnackbar({
                open: true,
                message: t('inventory.adjustments.error'),
                severity: 'error'
            })
        }
    }

    const openAdjustmentModal = (product: Product) => {
        setSelectedProduct(product)
        setAdjustmentMode('relative') // Default to relative adjustment
        setAdjustmentValue('') // Reset input value
        setAdjustmentData({ quantity: 0, reason: '' }) // Reset old state
        setAdjustmentOpen(true)
    }

    return (
        <Box sx={{p: 2}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography level="h2">{t('inventory.title')}</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    startDecorator={<RefreshIcon />}
                    onClick={handleRefreshAll}
                    loading={productsLoading || alertsLoading || adjustmentsLoading}
                >
                    {t('common.refresh')}
                </Button>
            </Box>

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
                                    <td>{new Date().toLocaleString()}</td>
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
                            <Button onClick={handleSetAlert} loading={productsLoading}>{t('inventory.confirm')}</Button>
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
                <Card sx={{maxWidth: 400, width: '90%', mx: 2}}>
                    <CardContent>
                        <Typography level="h3" sx={{mb: 2}}>{t('inventory.adjustTitle')}</Typography>
                        <Typography level="body-md" sx={{mb: 1}}>
                            {t('inventory.alertProduct')}: {selectedProduct?.name}
                        </Typography>
                        <Typography level="body-md" sx={{mb: 2}}>
                            {t('inventory.currentStockValue')}: {selectedProduct?.inventory?.stock || 0}
                        </Typography>

                        {/* 新增调整模式选择 */}
                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel>{t('inventory.adjustmentMode')}</FormLabel>
                            <RadioGroup
                                orientation="horizontal"
                                value={adjustmentMode}
                                onChange={(e) => setAdjustmentMode(e.target.value as 'relative' | 'set')}
                            >
                                <Radio value="relative" label={t('inventory.modeRelative')} />
                                <Radio value="set" label={t('inventory.modeSet')} />
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{mb: 2}}>
                            <FormLabel>
                                {adjustmentMode === 'relative' ? t('inventory.adjustQuantityLabel') : t('inventory.setQuantityLabel')}
                            </FormLabel>
                            <Input
                                type="text" // 改为 text 以便处理负号和空输入
                                value={adjustmentValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // 根据模式验证输入
                                    if (adjustmentMode === 'relative') {
                                        if (/^-?\d*$/.test(val)) { // 允许负号和数字
                                            setAdjustmentValue(val);
                                        }
                                    } else { // set mode
                                        if (/^\d*$/.test(val)) { // 只允许数字
                                            setAdjustmentValue(val);
                                        }
                                    }
                                }}
                                placeholder={adjustmentMode === 'relative' ? t('inventory.relativePlaceholder') : t('inventory.setPlaceholder')}
                                slotProps={{
                                    input: {
                                        // 移除 inputMode 和 pattern，因为 type="text" 更灵活
                                    }
                                }}
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
                                onClick={handleStockAdjustment} // 调用修改后的处理函数
                                loading={productsLoading || adjustmentsLoading} // 可以合并加载状态
                                disabled={!adjustmentValue || !selectedProduct} // 检查新输入值
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
