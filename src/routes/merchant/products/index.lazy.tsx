import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    Modal,
    Sheet,
    Snackbar,
    Table,
    Typography
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UnpublishedIcon from '@mui/icons-material/Unpublished'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PublishIcon from '@mui/icons-material/Publish'
import {Product, ProductStatus} from '@/types/products.ts'
import {productService} from '@/api/productService'
import {ProductAttributes} from '@/components/ui/ProductAttributes'
import {ProductEditForm} from '@/components/ProductEditForm'
import {useTranslation} from 'react-i18next'

export const Route = createLazyFileRoute('/merchant/products/')({
    component: Products,
})

export default function Products() {
    const {t} = useTranslation()
    const [products, setProducts] = useState<Product[]>([])
    const [open, setOpen] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<Product | null>(null)
    const [loading, setLoading] = useState(false)
    const [submittingId, setSubmittingId] = useState<string | null>(null)
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'danger';
    }>({
        open: false,
        message: '',
        severity: 'success'
    })

    // 翻译商品状态
    const translateProductStatus = (status: any): string => {
        if (typeof status === 'string') {
            switch (status) {
                case 'PRODUCT_STATUS_DRAFT':
                    return t('products.status.draft');
                case 'PRODUCT_STATUS_PENDING':
                    return t('products.status.pending');
                case 'PRODUCT_STATUS_APPROVED':
                    return t('products.status.approved');
                case 'PRODUCT_STATUS_REJECTED':
                    return t('products.status.rejected');
                case 'PRODUCT_STATUS_SOLDOUT':
                    return t('products.status.soldout');
                default:
                    return t('products.status.unknown', {status}); // 若无法匹配则返回原状态
            }
        } else if (typeof status === 'number') {
            // 兼容数字状态码
            switch (status) {
                case ProductStatus.PRODUCT_STATUS_DRAFT:
                    return t('products.status.draft');
                case ProductStatus.PRODUCT_STATUS_PENDING:
                    return t('products.status.pending');
                case ProductStatus.PRODUCT_STATUS_APPROVED:
                    return t('products.status.approved');
                case ProductStatus.PRODUCT_STATUS_REJECTED:
                    return t('products.status.rejected');
                case ProductStatus.PRODUCT_STATUS_SOLDOUT:
                    return t('products.status.soldout');
                default:
                    return t('products.status.unknown', {status});
            }
        }
        return String(status); // 其他类型转为字符串
    }

    // 获取状态对应的颜色
    const getStatusColor = (status: any) => {
        if (typeof status === 'string') {
            switch (status) {
                case 'PRODUCT_STATUS_DRAFT':
                    return 'neutral';
                case 'PRODUCT_STATUS_PENDING':
                    return 'warning';
                case 'PRODUCT_STATUS_APPROVED':
                    return 'success';
                case 'PRODUCT_STATUS_REJECTED':
                    return 'danger';
                case 'PRODUCT_STATUS_SOLDOUT':
                    return 'neutral';
                default:
                    return 'neutral';
            }
        } else if (typeof status === 'number') {
            switch (status) {
                case ProductStatus.PRODUCT_STATUS_DRAFT:
                    return 'neutral';
                case ProductStatus.PRODUCT_STATUS_PENDING:
                    return 'warning';
                case ProductStatus.PRODUCT_STATUS_APPROVED:
                    return 'success';
                case ProductStatus.PRODUCT_STATUS_REJECTED:
                    return 'danger';
                case ProductStatus.PRODUCT_STATUS_SOLDOUT:
                    return 'neutral';
                default:
                    return 'neutral';
            }
        }
        return 'neutral';
    }

    useEffect(() => {
        // 获取商家的产品列表
        loadProducts().then(r => r).catch(e => {
            console.error(e)
        })
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
            await loadProducts() // 重新加载产品列表
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

    // 提交商品审核
    const handleSubmitAudit = async (productId: string) => {
        try {
            setSubmittingId(productId)
            await productService.submitForAudit({
                productId,
                merchantId: '' // 后端会自动获取当前商家ID
            })
            setSnackbar({
                open: true,
                message: t('products.publishSuccess'),
                severity: 'success'
            })
            await loadProducts() // 重新加载产品列表
        } catch (error) {
            console.error(t('products.publishFailed'), error)
            let errorMsg = error instanceof Error ? error.message : String(error);
            setSnackbar({
                open: true,
                message: t('products.publishFailed') + ': ' + errorMsg,
                severity: 'danger'
            })
        } finally {
            setSubmittingId(null)
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
            await loadProducts() // 重新加载产品列表
        } catch (error) {
            console.error(t('products.unpublishFailed'), error)
            let errorMsg = error instanceof Error ? error.message : String(error);
            setSnackbar({
                open: true,
                message: t('products.unpublishFailed') + ': ' + errorMsg,
                severity: 'danger'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography level="h2">{t('products.title')}</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        startDecorator={<AddIcon/>}
                        onClick={() => {
                            setEditProduct(null)
                            setFormData({
                                id: '',
                                name: '',
                                description: '',
                                price: 0,
                                status: ProductStatus.PRODUCT_STATUS_DRAFT,
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
                    <Button
                        color="primary"
                        onClick={loadProducts}
                        startDecorator={loading ? <CircularProgress size="sm"/> : undefined}
                        disabled={loading}
                    >
                        {t('common.refresh')}
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                    <CircularProgress/>
                </Box>
            ) : products.length === 0 ? (
                <Alert sx={{my: 2}}>{t('products.noProducts')}</Alert>
            ) : (
                <Sheet variant="outlined" sx={{borderRadius: 'md', overflow: 'auto'}}>
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
                        {products.map((product: Product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>
                                    <Typography level="body-sm" sx={{
                                        maxWidth: '200px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.description}
                                    </Typography>
                                </td>
                                <td>{product.price}</td>
                                <td>{product.inventory?.stock || 0}</td>
                                <td>
                                    <Chip
                                        color={getStatusColor(product.status)}
                                        variant={(product.status === ProductStatus.PRODUCT_STATUS_PENDING || false)
                                            ? 'soft' : 'outlined'}
                                    >
                                        {translateProductStatus(product.status)}
                                    </Chip>
                                    {((typeof product.status === 'number' && product.status === ProductStatus.PRODUCT_STATUS_REJECTED) || false) && product.auditInfo && product.auditInfo.reason && (
                                        <Typography level="body-xs" color="danger" sx={{mt: 1}}>
                                            {t('products.rejectReason')}: {product.auditInfo.reason}
                                        </Typography>
                                    )}
                                </td>
                                <td>
                                    <ProductAttributes attributes={product.attributes || {}}/>
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
                                            disabled={submittingId === product.id}
                                        >
                                            {t('products.edit')}
                                        </Button>

                                        {/* 上架按钮 - 仅在草稿或驳回状态显示 */}
                                        {(((product.status === ProductStatus.PRODUCT_STATUS_DRAFT || product.status === ProductStatus.PRODUCT_STATUS_REJECTED))) && (
                                            <Button
                                                size="sm"
                                                color="primary"
                                                variant="soft"
                                                startDecorator={submittingId === product.id ?
                                                    <CircularProgress size="sm"/> : <PublishIcon/>}
                                                onClick={() => handleSubmitAudit(product.id)}
                                                disabled={submittingId === product.id}
                                            >
                                                {t('products.publish')}
                                            </Button>
                                        )}

                                        {/* 下架按钮 - 仅在审核通过或待审核状态显示 */}
                                        {((typeof product.status === 'number' && (product.status === ProductStatus.PRODUCT_STATUS_APPROVED || product.status === ProductStatus.PRODUCT_STATUS_PENDING)) || false) && (
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                color="warning"
                                                startDecorator={<UnpublishedIcon/>}
                                                onClick={() => handleUnpublish(product)}
                                                disabled={submittingId === product.id}
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
                                            disabled={submittingId === product.id}
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
            )}

            {/* 添加商品编辑表单的 Modal */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Card
                    variant="outlined"
                    sx={{
                        width: '90%',
                        maxWidth: 800,
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}
                >
                    <CardContent>
                        <ProductEditForm
                            product={formData || undefined}
                            onSubmit={async (product) => {
                                try {
                                    setLoading(true)
                                    if (editProduct) {
                                        await productService.updateProduct({
                                            id: editProduct.id,
                                            merchantId: editProduct.merchantId as string,
                                            name: product.name as string,
                                            description: product.description as string,
                                            price: product.price as number
                                        })
                                        setSnackbar({
                                            open: true,
                                            message: t('products.updateSuccess'),
                                            severity: 'success',
                                        })
                                    } else {
                                        await productService.createProduct({
                                            product: product as Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'auditInfo'>,
                                        })
                                        setSnackbar({
                                            open: true,
                                            message: t('products.saveSuccess'),
                                            severity: 'success',
                                        })
                                    }
                                    setOpen(false)
                                    await loadProducts()
                                } catch (error) {
                                    console.error(t('products.saveFailed'), error)
                                    setSnackbar({
                                        open: true,
                                        message: t('products.saveFailed'),
                                        severity: 'danger',
                                    })
                                } finally {
                                    setLoading(false)
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
                        <IconButton variant="soft" size="sm"
                                    onClick={() => setSnackbar(prev => ({...prev, open: false}))}>
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
