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
    Alert,
    IconButton
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadIcon from '@mui/icons-material/Upload'
import PublishIcon from '@mui/icons-material/Publish'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {Product, ProductStatus, AuditProductRequest, AuditRecordResponse, CreateProductResponse, ProductResponse} from '@/types/products.ts'
import {productService} from '@/api/productService'
import {ProductAttributes} from '@/components/ui/ProductAttributes'
import { ProductEditForm } from '@/components/ProductEditForm'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/merchant/products/')({
    component: Products,
})

export default function Products() {
    const { t } = useTranslation()
    const [products, setProducts] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<Product>()
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'danger';
    }>({
        open: false,
        message: '',
        severity: 'success'
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
            console.error(t('products.loadFailed'), error)
            setSnackbar({
                open: true,
                message: t('products.loadFailed'),
                severity: 'danger'
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
                message: t('products.deleteSuccess'),
                severity: 'success'
            })
            loadProducts() // 重新加载产品列表
        } catch (error) {
            console.error(t('products.deleteFailed'), error)
            setSnackbar({
                open: true,
                message: t('products.deleteFailed'),
                severity: 'danger'
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
            console.log(t('log.uploadUrl'), data)
            if (data.downloadUrl) {
                fetch(data.downloadUrl, {
                    method: 'PUT',
                    body: selectedFile
                }).then(res => {
                    if (res.status === 200) {
                        console.log(t('log.fileUploadSuccess'))
                        // 从downloadUrl中提取永久访问URL
                        // 通常downloadUrl格式为：http://domain/bucket/objectName?签名参数
                        // 我们需要提取不带签名参数的部分作为永久URL
                        const permanentUrl = data.downloadUrl.split('?')[0];
                        console.log(t('log.permanentUrl'), permanentUrl);

                        // 将永久URL保存到表单数据中
                        setFormData(prev => {
                            if (!prev) return {
                                id: '',
                                name: '',
                                description: '',
                                price: 0,
                                status: ProductStatus.DRAFT,
                                merchantId: '',
                                picture: permanentUrl,
                                images: [{url: permanentUrl, isPrimary: true, sortOrder: 0}],
                                quantity: 0,
                                attributes: {},
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                inventory: {productId: '', merchantId: '', stock: 0}
                            };
                            return {
                                ...prev,
                                picture: permanentUrl,
                                images: [{url: permanentUrl, isPrimary: true, sortOrder: 0}]
                            };
                        })

                        setSnackbar({
                            open: true,
                            message: t('products.uploadSuccess'),
                            severity: 'success'
                        })

                        setUploadOpen(false)
                    }
                }).catch(err => {
                    console.error(t('products.uploadFailed'), err)
                    setSnackbar({
                        open: true,
                        message: t('products.uploadFailed'),
                        severity: 'danger'
                    })
                })
            }
        }).catch(err => {
            console.error(t('products.getUploadUrlFailed'), err)
            setSnackbar({
                open: true,
                message: t('products.getUploadUrlFailed'),
                severity: 'danger'
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
                message: t('products.publishSuccess'),
                severity: 'success'
            })
            loadProducts() // 重新加载产品列表
        } catch (error) {
            console.error(t('products.publishFailed'), error)
            try {
                // 处理错误类型
                const errorMsg = error instanceof Error ? error.message : String(error);
                setSnackbar({
                    open: true,
                    message: t('products.publishFailed') + ': ' + errorMsg,
                    severity: 'danger'
                })
            } catch (error) {
                console.error(t('products.publishFailed'), error)
                setSnackbar({
                    open: true,
                    message: t('products.publishFailed'),
                    severity: 'danger'
                })
            }
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
                merchantId: product.merchantId as string,
                name: product.name as string,
                description: product.description as string,
                price: product.price as number
            })
            setSnackbar({
                open: true,
                message: t('products.unpublishSuccess'),
                severity: 'success'
            })
            loadProducts() // 重新加载产品列表
        } catch (error) {
            console.error(t('products.unpublishFailed'), error)
            try {
                // 处理错误类型
                const errorMsg = error instanceof Error ? error.message : String(error);
                setSnackbar({
                    open: true,
                    message: t('products.unpublishFailed') + ': ' + errorMsg,
                    severity: 'danger'
                })
            } catch (error) {
                console.error(t('products.unpublishFailed'), error)
                setSnackbar({
                    open: true,
                    message: t('products.unpublishFailed'),
                    severity: 'danger'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{p: 2}}>
            {/* 删除了面包屑导航 */}

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography level="h2">{t('products.title')}</Typography>
                <Button
                    startDecorator={<AddIcon/>}
                    onClick={() => {
                        setEditProduct(null)
                        setFormData({
                            id: '',
                            name: '',
                            description: '',
                            price: 0,
                            status: ProductStatus.DRAFT,
                            merchantId: '',
                            picture: '',
                            images: [],
                            quantity: 0,
                            attributes: {},
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            inventory: {productId: '', merchantId: '', stock: 0}
                        })
                        setOpen(true)
                    }}
                >
                    {t('products.addProduct')}
                </Button>
            </Box>

            <Sheet>
                <Table>
                    <thead>
                    <tr>
                        <th>{t('products.name')}</th>
                        <th>{t('products.description')}</th>
                        <th>{t('products.price')}</th>
                        <th>{t('products.stock')}</th>
                        <th>{t('products.status')}</th>
                        <th>{t('products.attributes')}</th>
                        <th>{t('products.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.inventory?.stock || 0}</td>
                            <td>{product.status}</td>
                            <td>
                                {product.attributes && Object.keys(product.attributes).length > 0 && (
                                    <ProductAttributes attributes={product.attributes} />
                                )}
                            </td>
                            <td>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="neutral"
                                        startDecorator={<EditIcon/>}
                                        onClick={() => {
                                            setEditProduct(product)
                                            setFormData(product)
                                            setOpen(true)
                                        }}
                                    >
                                        {t('products.edit')}
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
                                        {t('products.uploadImage')}
                                    </Button>
                                    {/* 上架按钮 - 仅在草稿或驳回状态显示 */}
                                    {(product.status === ProductStatus.DRAFT || product.status === ProductStatus.REJECTED) && (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="soft"
                                            onClick={() => handleSubmitAudit(product.id)}
                                        >
                                            {t('products.publish')}
                                        </Button>
                                    )}
                                    {/* 下架按钮 - 仅在审核通过或待审核状态显示 */}
                                    {(product.status === ProductStatus.APPROVED || product.status === ProductStatus.PENDING) && (
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="warning"
                                            startDecorator={<UnpublishedIcon/>}
                                            onClick={() => handleUnpublish(product)}
                                        >
                                            {t('products.unpublish')}
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        color="danger"
                                        startDecorator={<DeleteIcon/>}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        {t('products.delete')}
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
                        <Typography level="h3" sx={{mb: 2}}>{t('products.uploadTitle')}</Typography>
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
                                    {t('products.selectImage')}
                                </Button>
                            </label>
                        </Box>
                        {imagePreview && (
                            <Box sx={{mb: 2, textAlign: 'center'}}>
                                <img
                                    src={imagePreview}
                                    alt={t('products.preview')}
                                    style={{maxWidth: '100%', maxHeight: '200px'}}
                                />
                            </Box>
                        )}
                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                            <Button variant="outlined" color="neutral" onClick={() => setUploadOpen(false)}>
                                {t('products.cancel')}
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile}
                                loading={loading}
                            >
                                {t('products.upload')}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Modal>

            {/* 添加商品编辑表单的 Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Card sx={{ maxWidth: 800, mx: 2, maxHeight: '90vh', overflow: 'auto' }}>
                    <CardContent>
                        <Typography level="h3" sx={{ mb: 2 }}>
                            {editProduct ? t('products.editProduct') : t('products.addProduct')}
                        </Typography>
                        <ProductEditForm
                            product={editProduct || undefined}
                            onSubmit={async (product) => {
                                try {
                                    setLoading(true);
                                    if (editProduct) {
                                        await productService.updateProduct({
                                            id: editProduct.id,
                                            merchantId: product.merchantId as string,
                                            name: product.name as string,
                                            description: product.description as string,
                                            price: product.price as number
                                        });
                                        setSnackbar({
                                            open: true,
                                            message: t('products.saveSuccess'),
                                            severity: 'success',
                                        });
                                    } else {
                                        await productService.createProduct({
                                            product: product as Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'auditInfo'>,
                                        });
                                        setSnackbar({
                                            open: true,
                                            message: t('products.saveSuccess'),
                                            severity: 'success',
                                        });
                                    }
                                    setOpen(false);
                                    loadProducts();
                                } catch (error) {
                                    console.error(t('products.saveFailed'), error);
                                    setSnackbar({
                                        open: true,
                                        message: t('products.saveFailed'),
                                        severity: 'danger',
                                    });
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            onCancel={() => setOpen(false)}
                        />
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
                    variant="soft"
                    color={snackbar.severity}
                    endDecorator={
                        <IconButton variant="soft" size="sm" onClick={() => setSnackbar(prev => ({...prev, open: false}))}>
                            <CloseRoundedIcon/>
                        </IconButton>
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
