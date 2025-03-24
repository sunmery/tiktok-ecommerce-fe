import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Table, Sheet, Alert, CircularProgress, Divider, Button, Modal, FormControl, FormLabel, Input, Snackbar } from '@mui/joy'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user'
import { inventoryService, StockAlert, SetStockAlertRequest } from '@/api/inventoryService'
import { productService } from '@/api/productService'
import { Product } from '@/types/products'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'

export const Route = createLazyFileRoute('/merchant/inventory/alerts/')({ 
  component: InventoryAlerts,
})

export default function InventoryAlerts() {
  const { account } = useSnapshot(userStore)
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
      console.error('加载库存警报配置失败:', err)
      setSnackbar({
        open: true,
        message: '加载库存警报配置失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // 加载产品列表
  const loadProducts = async () => {
    try {
      const response = await productService.listRandomProducts({
        page: 1,
        pageSize: 50,
        status: 2
      })
      setProducts(response.items || [])
    } catch (err) {
      console.error('加载产品列表失败:', err)
      setSnackbar({
        open: true,
        message: '加载产品列表失败',
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
        message: '库存警报阈值设置成功',
        severity: 'success'
      })
    } catch (err) {
      console.error('设置库存警报阈值失败:', err)
      setSnackbar({
        open: true,
        message: '设置库存警报阈值失败',
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
  }, [])

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h2">库存警报设置</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => loadStockAlerts()}
          startDecorator={<RefreshIcon />}
          loading={loading}
        >
          刷新数据
        </Button>
      </Box>

      {/* 当前警报配置 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NotificationsActiveIcon color="primary" sx={{ mr: 1 }} />
            <Typography level="h3">当前警报配置</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : stockAlerts.length > 0 ? (
            <Sheet>
              <Table>
                <thead>
                  <tr>
                    <th>产品名称</th>
                    <th>当前库存</th>
                    <th>警戒值</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAlerts.map((alert) => {
                    const product = products.find(p => p.id === alert.productId)
                    const isLowStock = alert.currentStock < alert.threshold
                    return (
                      <tr key={alert.productId}>
                        <td>{alert.productName || product?.name || '未知产品'}</td>
                        <td>{alert.currentStock}</td>
                        <td>{alert.threshold}</td>
                        <td>
                          <Alert 
                            color={isLowStock ? "warning" : "success"}
                            size="sm"
                            variant="soft"
                          >
                            {isLowStock ? "库存不足" : "库存正常"}
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
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>暂无库存警报配置</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 添加新警报 */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AddIcon color="primary" sx={{ mr: 1 }} />
            <Typography level="h3">添加新警报</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : products.length > 0 ? (
            <Sheet>
              <Table>
                <thead>
                  <tr>
                    <th>产品名称</th>
                    <th>当前库存</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(product => !stockAlerts.some(alert => alert.productId === product.id))
                    .map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.stock || 0}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outlined"
                            color="primary"
                            onClick={() => openAlertModal(product)}
                          >
                            设置警戒值
                          </Button>
                        </td>
                      </tr>
                    ))}
                  {products.filter(product => !stockAlerts.some(alert => alert.productId === product.id)).length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center' }}>所有产品已设置警报</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Sheet>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>暂无产品数据</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 设置警戒值弹窗 */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 400, mx: 2 }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 2 }}>设置库存警戒值</Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              产品: {selectedProduct?.name}
            </Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              当前库存: {selectedProduct?.stock || 0}
            </Typography>
            <FormControl>
              <FormLabel>警戒值</FormLabel>
              <Input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
              />
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="neutral" onClick={() => setModalOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSetAlert} loading={loading}>确定</Button>
            </Box>
          </CardContent>
        </Card>
      </Modal>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
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