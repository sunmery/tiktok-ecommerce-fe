import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography, Table, Sheet, Modal, FormControl, FormLabel, Input, Alert, Snackbar, Divider } from '@mui/joy'
import { Product } from '@/types/product'
import { productService } from '@/api/productService'
import { useNavigate } from '@tanstack/react-router'
import InventoryIcon from '@mui/icons-material/Inventory'
import TimelineIcon from '@mui/icons-material/Timeline'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

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
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.listRandomProducts({
        page: 1,
        pageSize: 20
      })
      setProducts(response.items || [])
      // 检查库存警报
      checkLowStock(response.items || [])
    } catch (error) {
      console.error('加载产品失败:', error)
      setSnackbar({
        open: true,
        message: '加载产品失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const checkLowStock = (products: Product[]) => {
    const newAlerts = products
      .filter(product => (product.stock || 0) < (alerts.find(a => a.productId === product.productId || product.id)?.threshold || 10))
      .map(product => ({
        productId: product.productId || product.id,
        threshold: alerts.find(a => a.productId === (product.productId || product.id))?.threshold || 10,
        currentStock: product.stock || 0
      }))
    setAlerts(newAlerts)
  }

  const handleSetAlert = async () => {
    if (selectedProduct && threshold > 0) {
      const newAlert: InventoryAlert = {
        productId: selectedProduct.productId || selectedProduct.id,
        threshold: threshold,
        currentStock: selectedProduct.stock || 0
      }
      setAlerts(prev => [...prev.filter(a => a.productId !== (selectedProduct.productId || selectedProduct.id)), newAlert])
      setAlertOpen(false)
      setSnackbar({
        open: true,
        message: '库存警戒值设置成功',
        severity: 'success'
      })
      checkLowStock(products)
    }
  }

  const handleStockAdjustment = async (productId: string, quantity: number, reason: string) => {
    try {
      setLoading(true)
      // 这里应该调用后端API更新库存
      // 模拟API调用
      setTimeout(() => {
        const adjustment: StockAdjustment = {
          id: Date.now().toString(),
          productId,
          quantity,
          reason,
          date: new Date().toISOString()
        }
        setAdjustments(prev => [adjustment, ...prev])
        
        // 更新本地产品库存数据
        setProducts(prev => prev.map(p => {
          if (p.id === productId) {
            return {
              ...p,
              stock: (p.stock || 0) + quantity
            }
          }
          return p
        }))
        
        setSnackbar({
          open: true,
          message: '库存调整成功',
          severity: 'success'
        })
        
        setLoading(false)
        setAdjustmentOpen(false)
        checkLowStock(products) // 重新检查库存警报
      }, 500)
    } catch (error) {
      console.error('调整库存失败:', error)
      setSnackbar({
        open: true,
        message: '调整库存失败',
        severity: 'error'
      })
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
    <Box sx={{ p: 2 }}>
      <Typography level="h2" sx={{ mb: 3 }}>库存管理</Typography>

      {/* 库存警报 */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography level="h3" sx={{ mb: 2 }}>库存警报</Typography>
          {alerts.map((alert) => {
            const product = products.find(p => p.id === alert.productId)
            return (
              <Alert
                key={alert.productId}
                color="warning"
                sx={{ mb: 1 }}
              >
                {product?.name} 当前库存 ({alert.currentStock}) 低于警戒值 ({alert.threshold})
              </Alert>
            )
          })}
        </Box>
      )}

      {/* 库存列表 */}
      <Sheet sx={{ mb: 3 }}>
        <Table>
          <thead>
            <tr>
              <th>产品名称</th>
              <th>当前库存</th>
              <th>警戒值</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock || 0}</td>
                <td>{alerts.find(a => a.productId === product.id)?.threshold || '-'}</td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={() => {
                        setSelectedProduct(product)
                        setThreshold(alerts.find(a => a.productId === product.id)?.threshold || 10)
                        setAlertOpen(true)
                      }}
                    >
                      设置警戒值
                    </Button>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="primary"
                      onClick={() => openAdjustmentModal(product)}
                    >
                      调整库存
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {/* 库存调整记录 */}
      <Box>
        <Typography level="h3" sx={{ mb: 2 }}>库存调整记录</Typography>
        <Sheet>
          <Table>
            <thead>
              <tr>
                <th>时间</th>
                <th>产品</th>
                <th>调整数量</th>
                <th>原因</th>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>暂无调整记录</td>
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
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 400, mx: 2 }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 2 }}>设置库存警戒值</Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              产品: {selectedProduct?.name}
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
              <Button variant="outlined" color="neutral" onClick={() => setAlertOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSetAlert} loading={loading}>确定</Button>
            </Box>
          </CardContent>
        </Card>
      </Modal>

      {/* 库存调整弹窗 */}
      <Modal
        open={adjustmentOpen}
        onClose={() => setAdjustmentOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 400, mx: 2 }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 2 }}>调整库存</Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              产品: {selectedProduct?.name}
            </Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              当前库存: {selectedProduct?.stock || 0}
            </Typography>
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>调整数量 (正数增加，负数减少)</FormLabel>
              <Input
                type="number"
                value={adjustmentData.quantity}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>调整原因</FormLabel>
              <Input
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
              />
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="neutral" onClick={() => setAdjustmentOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={() => selectedProduct && handleStockAdjustment(
                  selectedProduct.id, 
                  adjustmentData.quantity, 
                  adjustmentData.reason || '手动调整'
                )}
                loading={loading}
                disabled={!adjustmentData.quantity || !selectedProduct}
              >
                确定
              </Button>
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
          color={snackbar.severity}
          variant="soft"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}