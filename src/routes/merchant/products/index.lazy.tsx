import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Table,
    Sheet,
    Modal,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Snackbar,
    Alert
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadIcon from '@mui/icons-material/Upload'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import {Product, ProductStatus} from '@/types/product'
import {productService} from '@/api/productService'

export const Route = createLazyFileRoute('/merchant/products/')({
    component: Products,
})

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<Product>()
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
    // const [auditOpen, setAuditOpen] = useState(false)
    // const [auditProduct, setAuditProduct] = useState<Product | null>(null)
    // const [auditReason, setAuditReason] = useState('')

    useEffect(() => {
        // 获取商家的产品列表
        loadProducts().then(r => r)
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

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            await productService.deleteProduct({id, merchantId: ''}) // merchantId为空，后端会自动获取当前商家ID
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

        fetch(`http://localhost:8000/v1/products/uploadfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                method: "POST",
                contentType: selectedFile.type,
                bucketName: "ecommerce",
                fileName: selectedFile.name
            })
        }).then(res => res.json()).then(data => {
            console.log('上传URL:', data)
            if (data.downloadUrl) {
                fetch(data.downloadUrl, {
                    method: 'PUT',
                    body: selectedFile
                }).then(res => {
                    if (res.status === 200) {
                        console.log('文件上传成功')
                        // 从downloadUrl中提取永久访问URL
                        // 通常downloadUrl格式为：http://domain/bucket/objectName?签名参数
                        // 我们需要提取不带签名参数的部分作为永久URL
                        const permanentUrl = data.downloadUrl.split('?')[0];
                        console.log('永久访问URL:', permanentUrl);

                        // 将永久URL保存到表单数据中
                        setFormData(prev => ({
                            ...prev,
                            image: permanentUrl
                        }))

                        setSnackbar({
                            open: true,
                            message: '图片上传成功',
                            severity: 'success'
                        })

                        setUploadOpen(false)
                    }
                }).catch(err => {
                    console.error('上传文件失败:', err)
                    setSnackbar({
                        open: true,
                        message: '上传文件失败',
                        severity: 'error'
                    })
                })
            }
        }).catch(err => {
            console.error('获取上传URL失败:', err)
            setSnackbar({
                open: true,
                message: '获取上传URL失败',
                severity: 'error'
            })
        })
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
        if (product.status === ProductStatus.draft || product.status === ProductStatus.rejected) {
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
                    status: ProductStatus.DRAFT, // 确保状态为草稿状态
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
        <Box sx={{p: 2}}>
            {/* 删除了面包屑导航 */}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography level="h2">产品管理</Typography>
                <Button
                    startDecorator={<AddIcon/>}
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
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        startDecorator={<EditIcon/>}
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
                                        startDecorator={<UploadIcon/>}
                                        onClick={() => {
                                            setEditProduct(product)
                                            setImagePreview(product.images?.[0]?.url || '')
                                            setUploadOpen(true)
                                        }}
                                    >
                                        上传图片
                                    </Button>
                                    {/* 上架按钮 - 仅在草稿或驳回状态显示 */}
                                    {(product.status === ProductStatus.draft || product.status === ProductStatus.rejected) && (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="soft"
                                            onClick={() => handleSubmitAudit(product.id)}
                                        >
                                            上架
                                        </Button>
                                    )}
                                    {/* 下架按钮 - 仅在审核通过或待审核状态显示 */}
                                    {(product.status === ProductStatus.approved || product.status === ProductStatus.pending) && (
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="warning"
                                            startDecorator={<UnpublishedIcon/>}
                                            onClick={() => handleUnpublish(product)}
                                        >
                                            下架
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="danger"
                                        startDecorator={<DeleteIcon/>}
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

            {/* 图片上传弹窗 */}
            <Modal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Card sx={{maxWidth: 500, mx: 2}}>
                    <CardContent>
                        <Typography level="h3" sx={{mb: 2}}>上传产品图片</Typography>
                        <Box sx={{mb: 2}}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{display: 'none'}}
                                id="upload-image"
                            />
                            <label htmlFor="upload-image">
                                <Button
                                    component="span"
                                    startDecorator={<UploadIcon/>}
                                >
                                    选择图片
                                </Button>
                            </label>
                        </Box>
                        {imagePreview && (
                            <Box sx={{mb: 2, textAlign: 'center'}}>
                                <img
                                    src={imagePreview}
                                    alt="预览"
                                    style={{maxWidth: '100%', maxHeight: '200px'}}
                                />
                            </Box>
                        )}
                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
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
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
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
