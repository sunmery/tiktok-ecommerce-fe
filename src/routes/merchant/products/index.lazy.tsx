import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Alert,
    Box,
    Button,
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
import {CreateProductRequest, Product, ProductStatus} from '@/types/products.ts'
import {productService} from '@/api/productService'
import {ProductAttributes} from '@/components/ui/ProductAttributes'
import {ProductEditForm} from '@/components/ProductEditForm'
import {useTranslation} from 'react-i18next'
import {usePagination} from '@/hooks/usePagination'
import PaginationBar from '@/components/PaginationBar'
import {translateProductStatus} from '@/utils/translateProductStatus'
import {getStatusColor} from "@/utils/status.ts";

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

    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 10,
    });

    useEffect(() => {
        // 获取商家的产品列表
        loadProducts().then(r => r).catch(e => {
            console.error(e)
        })
    }, [pagination.page, pagination.pageSize])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const response = await productService.getMerchantProducts({
                page: pagination.page,
                pageSize: pagination.pageSize,
                // status: 1
            })
            setProducts(response.items || [])

            // 更新总条目数（如果API返回了总数）
            if (response.total !== undefined) {
                pagination.setTotalItems(response.total);
            } else {
                // 没有总数时，用当前页数据估算
                const isLastPage = response.items.length < pagination.pageSize;
                const estimatedTotal = isLastPage
                    ? (pagination.page - 1) * pagination.pageSize + response.items.length
                    : pagination.page * pagination.pageSize + 1;
                pagination.setTotalItems(estimatedTotal);
            }
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
                price: product.price as number,
                stock: product.inventory?.stock || 0,
                url: product.picture as string,
                attributes: product.attributes as Record<string, any>,
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

    const handleFormSubmit = async (productData: Partial<Product>) => {
        try {
            setLoading(true)

            // 如果是新建商品
            if (!editProduct) {
                // 确保按照正确的格式提交数据
                const createProductRequest: CreateProductRequest = {
                    name: productData.name || '',
                    description: productData.description || '',
                    price: productData.price || 0,
                    stock: productData.inventory?.stock || 0,
                    images: productData.images || [],
                    attributes: productData.attributes || {},
                    category: productData.category || {
                        categoryId: 0,
                        categoryName: ''
                    }
                }

                // 创建商品
                await productService.createProduct(createProductRequest)
                setSnackbar({
                    open: true,
                    message: t('products.createSuccess'),
                    severity: 'success'
                })
            } else {
                // 更新商品 - 保持原样
                await productService.updateProduct({
                    id: productData.id || '',
                    merchantId: productData.merchantId || '',
                    name: productData.name || '',
                    description: productData.description || '',
                    price: productData.price || 0,
                    stock: productData.inventory?.stock || 0,
                    url: productData.picture as string || '',
                    attributes: productData.attributes as Record<string, any> || {},
                })
                setSnackbar({
                    open: true,
                    message: t('products.updateSuccess'),
                    severity: 'success'
                })
            }

            setOpen(false)
            await loadProducts() // 重新加载商品列表
        } catch (error) {
            console.error(editProduct ? t('products.updateFailed') : t('products.createFailed'), error)
            setSnackbar({
                open: true,
                message: editProduct ? t('products.updateFailed') : t('products.createFailed'),
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
                            // 根据模板设置默认值
                            setFormData(null)
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
                <>
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
                                            variant={
                                                product.status === ProductStatus.PRODUCT_STATUS_PENDING
                                                    ? 'soft' : 'outlined'
                                            }
                                        >
                                            {translateProductStatus(product.status)}
                                        </Chip>
                                        {product.status === ProductStatus.PRODUCT_STATUS_REJECTED && product.auditInfo && product.auditInfo.reason && (
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
                                            {(
                                                product.status === ProductStatus.PRODUCT_STATUS_DRAFT ||
                                                product.status === ProductStatus.PRODUCT_STATUS_REJECTED
                                            ) && (
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
                                            {product.status === ProductStatus.PRODUCT_STATUS_APPROVED ||
                                                product.status === ProductStatus.PRODUCT_STATUS_PENDING && (
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

                    {/* 分页控制 */}
                    <PaginationBar
                        page={pagination.page}
                        pageSize={pagination.pageSize}
                        totalItems={pagination.totalPages * pagination.pageSize} // 估算总条目数
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.handlePageChange}
                        onPageSizeChange={pagination.handlePageSizeChange}
                    />
                </>
            )}

            {/* 添加商品编辑表单的 Modal */}
            <Modal
                aria-labelledby="product-edit-modal-title"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ProductEditForm
                        product={formData as Product}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setOpen(false)}
                    />
                </Sheet>
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
