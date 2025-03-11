import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography, Table, Sheet, Modal, FormControl, FormLabel, Input, Textarea, Snackbar, Alert, Chip } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadIcon from '@mui/icons-material/Upload'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import { Product, ProductStatus, AuditAction, AttributeValue } from '@/types/product'
import { productService } from '@/api/productService'

export const Route = createLazyFileRoute('/merchant/products/')({ 
  component: Products,
})

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    attributes: {} as Record<string, AttributeValue>,
    categoryId: 1,
    categoryName: '默认分类'
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [loading, setLoading] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  
  // 审核相关状态
  const [auditOpen, setAuditOpen] = useState(false)
  const [auditProduct, setAuditProduct] = useState<Product | null>(null)
  const [auditReason, setAuditReason] = useState('')

  useEffect(() => {
    // 获取商家的产品列表
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getMerchantProducts()
      setProducts(response.items || [])
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

  // 处理属性值变更
  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: { stringValue: value }
      }
    }))
  }

  // 添加新属性
  const [newAttributeKey, setNewAttributeKey] = useState('')
  const [newAttributeValue, setNewAttributeValue] = useState('')

  const handleAddAttribute = () => {
    if (!newAttributeKey.trim()) return
    
    handleAttributeChange(newAttributeKey, newAttributeValue)
    setNewAttributeKey('')
    setNewAttributeValue('')
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (editProduct) {
        // 更新产品
        await productService.updateProduct({
          id: editProduct.id,
          product: {
            ...editProduct,
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.stock,
            images: formData.image ? [{
              url: formData.image,
              isPrimary: true,
              sortOrder: 0
            }] : [],
            attributes: formData.attributes,
            category: {
              categoryId: formData.categoryId,
              categoryName: formData.categoryName
            }
          }
        })
        setSnackbar({
          open: true,
          message: '产品更新成功',
          severity: 'success'
        })
      } else {
        // 创建新产品
        await productService.createProduct({
          product: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.stock,
            merchantId: '', // 后端会自动填充当前商家ID
            status: ProductStatus.DRAFT, // 默认为草稿状态
            images: formData.image ? [{
              url: formData.image,
              isPrimary: true,
              sortOrder: 0
            }] : [],
            attributes: formData.attributes,
            category: {
              categoryId: formData.categoryId,
              categoryName: formData.categoryName
            }
          }
        })
        setSnackbar({
          open: true,
          message: '产品创建成功',
          severity: 'success'
        })
      }
      setOpen(false)
      loadProducts() // 重新加载产品列表
    } catch (error) {
      console.error('保存产品失败:', error)
      setSnackbar({
        open: true,
        message: '保存产品失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await productService.deleteProduct({ id, merchantId: '' }) // merchantId为空，后端会自动获取当前商家ID
      setSnackbar({
        open: true,
        message: '产品删除成功',
        severity: 'success'
      })
      loadProducts() // 重新加载产品列表
    } catch (error) {
      console.error('删除产品失败:', error)
      setSnackbar({
        open: true,
        message: '删除产品失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // 创建预览URL
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !editProduct) return
    
    // 这里应该调用上传图片的API
    // 模拟上传成功
    setTimeout(() => {
      // 假设上传成功后获得URL
      const imageUrl = imagePreview // 实际应该是服务器返回的URL
      
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }))
      
      setSnackbar({
        open: true,
        message: '图片上传成功',
        severity: 'success'
      })
      
      setUploadOpen(false)
    }, 1000)
  }

  // 提交商品审核
  const handleSubmitAudit = async (productId: string) => {
    try {
      setLoading(true)
      await productService.submitForAudit({
        productId,
        merchantId: '' // 后端会自动获取当前商家ID
      })
      setSnackbar({
        open: true,
        message: '提交审核成功',
        severity: 'success'
      })
      loadProducts() // 重新加载产品列表
    } catch (error) {
      console.error('提交审核失败:', error)
      setSnackbar({
        open: true,
        message: '提交审核失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  // 处理商品上架（提交审核）
  const handlePublish = (product: Product) => {
    // 如果商品是草稿状态，需要提交审核
    if (product.status === ProductStatus.DRAFT || product.status === ProductStatus.REJECTED) {
      handleSubmitAudit(product.id)
    }
  }

  // 处理商品下架（直接更新状态为草稿）
  const handleUnpublish = async (product: Product) => {
    try {
      setLoading(true)
      // 将商品状态更新为草稿
      await productService.updateProduct({
        id: product.id,
        product: {
          ...product,
          status: ProductStatus.DRAFT
        }
      })
      setSnackbar({
        open: true,
        message: '商品已下架',
        severity: 'success'
      })
      loadProducts() // 重新加载产品列表
    } catch (error) {
      console.error('下架商品失败:', error)
      setSnackbar({
        open: true,
        message: '下架商品失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* 删除了面包屑导航 */}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography level="h2">产品管理</Typography>
        <Button
          startDecorator={<AddIcon />}
          onClick={() => {
            setEditProduct(null)
            setFormData({
              name: '',
              description: '',
              price: 0,
              stock: 0,
              image: ''
            })
            setOpen(true)
          }}
        >
          添加产品
        </Button>
      </Box>

      <Sheet>
        <Table>
          <thead>
            <tr>
              <th>产品名称</th>
              <th>描述</th>
              <th>价格</th>
              <th>库存</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.status}</td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      startDecorator={<EditIcon />}
                      onClick={() => {
                        setEditProduct(product)
                        setFormData({
                          name: product.name,
                          description: product.description,
                          price: product.price,
                          stock: product.stock || 0,
                          image: product.images?.[0]?.url || ''
                        })
                        setOpen(true)
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="primary"
                      startDecorator={<UploadIcon />}
                      onClick={() => {
                        setEditProduct(product)
                        setImagePreview(product.images?.[0]?.url || '')
                        setUploadOpen(true)
                      }}
                    >
                      上传图片
                    </Button>
                    {/* 上架按钮 - 仅在草稿或驳回状态显示 */}
                    {(product.status === ProductStatus.DRAFT || product.status === ProductStatus.REJECTED) && (
                      <Button
                        size="sm"
                        variant="outlined"
                        color="success"
                        startDecorator={<PublishIcon />}
                        onClick={() => handlePublish(product)}
                      >
                        上架
                      </Button>
                    )}
                    {/* 下架按钮 - 仅在审核通过或待审核状态显示 */}
                    {(product.status === ProductStatus.APPROVED || product.status === ProductStatus.PENDING) && (
                      <Button
                        size="sm"
                        variant="outlined"
                        color="warning"
                        startDecorator={<UnpublishedIcon />}
                        onClick={() => handleUnpublish(product)}
                      >
                        下架
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outlined"
                      color="danger"
                      startDecorator={<DeleteIcon />}
                      onClick={() => handleDelete(product.id)}
                    >
                      删除
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 500, mx: 2 }}>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>产品名称</FormLabel>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>描述</FormLabel>
                    <Textarea
                      required
                      minRows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>价格</FormLabel>
                    <Input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value)
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>库存</FormLabel>
                    <Input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: parseInt(e.target.value)
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>图片URL</FormLabel>
                    <Input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>分类ID</FormLabel>
                    <Input
                      type="number"
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          categoryId: parseInt(e.target.value) 
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>分类名称</FormLabel>
                    <Input
                      value={formData.categoryName}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          categoryName: e.target.value 
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                
                {/* 属性编辑区域 */}
                <Grid xs={12}>
                  <Typography level="title-md" sx={{ mt: 2, mb: 1 }}>商品属性</Typography>
                  <Box sx={{ mb: 2 }}>
                    {Object.entries(formData.attributes).map(([key, attr]) => (
                      <Box key={key} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Input
                          size="sm"
                          disabled
                          value={key}
                          sx={{ width: '40%' }}
                        />
                        <Input
                          size="sm"
                          value={attr.stringValue || ''}
                          onChange={(e) => handleAttributeChange(key, e.target.value)}
                          sx={{ width: '50%' }}
                        />
                        <Button
                          size="sm"
                          variant="outlined"
                          color="danger"
                          onClick={() => {
                            const newAttributes = { ...formData.attributes }
                            delete newAttributes[key]
                            setFormData({ ...formData, attributes: newAttributes })
                          }}
                        >
                          删除
                        </Button>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Input
                      size="sm"
                      placeholder="属性名"
                      value={newAttributeKey}
                      onChange={(e) => setNewAttributeKey(e.target.value)}
                      sx={{ width: '40%' }}
                    />
                    <Input
                      size="sm"
                      placeholder="属性值"
                      value={newAttributeValue}
                      onChange={(e) => setNewAttributeValue(e.target.value)}
                      sx={{ width: '50%' }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddAttribute}
                    >
                      添加
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="neutral" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit" loading={loading}>{editProduct ? '更新' : '创建'}</Button>
              </Box>
            </CardContent>
          </form>
        </Card>
      </Modal>

      {/* 图片上传弹窗 */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 500, mx: 2 }}>
          <CardContent>
            <Typography level="h3" sx={{ mb: 2 }}>上传产品图片</Typography>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="upload-image"
              />
              <label htmlFor="upload-image">
                <Button
                  component="span"
                  startDecorator={<UploadIcon />}
                >
                  选择图片
                </Button>
              </label>
            </Box>
            {imagePreview && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="预览" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }} 
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="neutral" onClick={() => setUploadOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile}
                loading={loading}
              >
                上传
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