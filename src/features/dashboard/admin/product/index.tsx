import {useTranslation} from "react-i18next";
import {useSnapshot} from "valtio/react";
import {userStore} from "@/store/user.ts";
import {useNavigate} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {AuditAction, Product} from "@/features/products/types.ts";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog,
    Sheet,
    Snackbar,
    Stack,
    Table,
    Textarea,
    Typography
} from "@mui/joy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getStatusColor, translateProductStatus } from "@/utils/status.ts";
import {auditProduct, getProductStatusPending} from "./api";
import { usePagination } from "../../merchant/orders/hooks";
import PaginationBar from "@/shared/components/PaginationBar";

export default function ProductManagement() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [openAuditModal, setOpenAuditModal] = useState(false)
    const [openViewModal, setOpenViewModal] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    const [auditAction, setAuditAction] = useState<AuditAction>(AuditAction.AUDIT_ACTION_APPROVED)
    const [auditReason, setAuditReason] = useState('')
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'danger'
    })

    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 10,
    });

    // 检查用户是否为管理员，如果不是则重定向到首页
    useEffect(() => {
        if (account.role !== 'admin') {
            navigate({to: '/'}).then(() => {
                console.log('非管理员用户，重定向到首页')
            }).catch(err => {
                console.error('重定向失败:', err)
            })
            return
        }

        loadPendingProducts().then(r => {
            console.log('加载待审核商品成功', r)
        }).catch(err => {
            console.error('加载待审核商品失败:', err)
        })
    }, [account.role, navigate, pagination.page, pagination.pageSize])

    // 加载待审核商品
    const loadPendingProducts = async () => {
        try {
            setLoading(true)
            // 调用API获取待审核商品，状态为PENDING(1)
            const response = await getProductStatusPending({
                page: pagination.page,
                pageSize: pagination.pageSize,
                status: 1
            })

            setProducts(response.items || [])
            // 更新总条目数
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
            console.error('加载待审核商品失败:', error)
            setSnackbar({
                open: true,
                message: t('common.error'),
                severity: 'danger'
            })
        } finally {
            setLoading(false)
        }
    }

    // 处理商品选择
    const handleProductSelect = (productId: string) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId)
            } else {
                return [...prev, productId]
            }
        })
    }

    // 全选/取消全选
    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([])
        } else {
            setSelectedProducts(products.map(product => product.id))
        }
    }

    // 打开审核模态框
    const handleOpenAuditModal = (action: AuditAction) => {
        if (selectedProducts.length === 0) {
            setSnackbar({
                open: true,
                message: t('common.error'),
                severity: 'danger'
            })
            return
        }

        setAuditAction(action)
        setAuditReason('')
        setOpenAuditModal(true)
    }

    // 查看商品详情
    const handleViewProduct = (product: Product) => {
        setCurrentProduct(product)
        setOpenViewModal(true)
    }

    // 提交商品审核
    const handleSubmitAudit = async () => {
        try {
            setLoading(true)

            // 批量处理审核
            for (const productId of selectedProducts) {
                const product = products.find(p => p.id === productId)
                if (!product) continue

                await auditProduct({
                    productId,
                    merchantId: product.merchantId,
                    action: auditAction,
                    reason: auditReason,
                    operatorId: account.id
                })
            }

            setSnackbar({
                open: true,
                message: t('common.success'),
                severity: 'success'
            })

            setOpenAuditModal(false)
            setSelectedProducts([])
            await loadPendingProducts() // 重新加载数据
        } catch (error) {
            console.error('审核操作失败:', error)
            setSnackbar({
                open: true,
                message: t('common.error'),
                severity: 'danger'
            })
        } finally {
            setLoading(false)
        }
    }

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('zh-CN')
    }

    return (
        <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('products.title')}</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button
                        color="success"
                        startDecorator={<CheckCircleIcon/>}
                        onClick={() => handleOpenAuditModal(AuditAction.AUDIT_ACTION_APPROVED)}
                        disabled={selectedProducts.length === 0}
                    >
                        {t('products.actions.batchApprove')}
                    </Button>
                    <Button
                        color="danger"
                        startDecorator={<CancelIcon/>}
                        onClick={() => handleOpenAuditModal(AuditAction.AUDIT_ACTION_REJECT)}
                        disabled={selectedProducts.length === 0}
                    >
                        {t('products.actions.batchReject')}
                    </Button>
                    <Button
                        color="primary"
                        onClick={loadPendingProducts}
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
                <Alert sx={{my: 2}}>{t('products.noProductsForAudit')}</Alert>
            ) : (
                <>
                    <Sheet variant="outlined" sx={{borderRadius: 'md', overflow: 'auto'}}>
                        <Table stickyHeader>
                            <thead>
                            <tr>
                                <th style={{width: '5%'}}>
                                    <Checkbox
                                        checked={selectedProducts.length === products.length && products.length > 0}
                                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th style={{width: '10%'}}>{t('products.table.id')}</th>
                                <th style={{width: '15%'}}>{t('products.table.name')}</th>
                                <th style={{width: '10%'}}>{t('products.table.price')}</th>
                                <th style={{width: '10%'}}>{t('products.table.merchant')}</th>
                                <th style={{width: '10%'}}>{t('products.table.stock')}</th>
                                <th style={{width: '10%'}}>{t('products.table.status')}</th>
                                <th style={{width: '15%'}}>{t('products.table.createdTime')}</th>
                                <th style={{width: '15%'}}>{t('products.table.actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <Checkbox
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleProductSelect(product.id)}
                                        />
                                    </td>
                                    <td>{product.id.substring(0, 8)}...</td>
                                    <td>{product.name}</td>
                                    <td>¥{product.price.toFixed(2)}</td>
                                    <td>{product.merchantId.substring(0, 8)}...</td>
                                    <td>{product.inventory?.stock || 0}</td>
                                    <td>
                                        <Chip
                                            color={getStatusColor(product.status)}
                                        >
                                            {translateProductStatus(product.status)}
                                        </Chip>
                                    </td>
                                    <td>{formatDate(product.createdAt)}</td>
                                    <td>
                                        <Box sx={{display: 'flex', gap: 1}}>
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                onClick={() => handleViewProduct(product)}
                                            >
                                                {t('products.actions.viewDetails')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                color="success"
                                                onClick={() => {
                                                    setCurrentProduct(product)
                                                    setAuditAction(AuditAction.AUDIT_ACTION_APPROVED)
                                                    setSelectedProducts([product.id])
                                                    setOpenAuditModal(true)
                                                }}
                                            >
                                                {t('products.actions.approve')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                color="danger"
                                                onClick={() => {
                                                    setCurrentProduct(product)
                                                    setAuditAction(AuditAction.AUDIT_ACTION_REJECT)
                                                    setSelectedProducts([product.id])
                                                    setOpenAuditModal(true)
                                                }}
                                            >
                                                {t('products.actions.reject')}
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
                        totalItems={pagination.totalPages * pagination.pageSize}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.handlePageChange}
                        onPageSizeChange={pagination.handlePageSizeChange}
                    />
                </>
            )}

            {/* 审核模态框 */}
            <Modal open={openAuditModal} onClose={() => setOpenAuditModal(false)}>
                <ModalDialog>
                    <ModalClose/>
                    <Typography level="h4">
                        {auditAction === AuditAction.AUDIT_ACTION_APPROVED ? t('products.modal.approve') : t('products.modal.reject')}
                    </Typography>
                    <Divider sx={{my: 2}}/>
                    <Typography>
                        {t('products.modal.selected', {count: selectedProducts.length})}
                    </Typography>

                    <FormControl sx={{mt: 2}}>
                        <FormLabel>{t('products.modal.reason')}</FormLabel>
                        <Textarea
                            minRows={3}
                            value={auditReason}
                            onChange={(e) => setAuditReason(e.target.value)}
                            placeholder={auditAction === AuditAction.AUDIT_ACTION_APPROVED ? t('products.modal.approveReason') : t('products.modal.rejectReason')}
                            required={auditAction === AuditAction.AUDIT_ACTION_REJECT}
                        />
                    </FormControl>

                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3}}>
                        <Button variant="plain" color="neutral" onClick={() => setOpenAuditModal(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            color={auditAction === AuditAction.AUDIT_ACTION_APPROVED ? 'success' : 'danger'}
                            onClick={handleSubmitAudit}
                            loading={loading}
                            disabled={auditAction === AuditAction.AUDIT_ACTION_REJECT && !auditReason.trim()}
                        >
                            {auditAction === AuditAction.AUDIT_ACTION_APPROVED ? t('products.modal.confirmApprove') : t('products.modal.confirmReject')}
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {/* 查看商品详情模态框 */}
            <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
                <ModalDialog
                    size="lg"
                    sx={{
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}
                >
                    <ModalClose/>
                    <Typography level="h4">{t('products.modal.details')}</Typography>
                    <Divider sx={{my: 2}}/>

                    {currentProduct && (
                        <Stack spacing={2}>
                            <Box>
                                <Typography level="body-sm">{t('products.details.id')}</Typography>
                                <Typography level="body-lg">{currentProduct.id}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.name')}</Typography>
                                <Typography level="body-lg">{currentProduct.name}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.description')}</Typography>
                                <Typography level="body-lg">{currentProduct.description}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.price')}</Typography>
                                <Typography level="body-lg">¥{currentProduct.price.toFixed(2)}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.merchantId')}</Typography>
                                <Typography level="body-lg">{currentProduct.merchantId}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.status')}</Typography>
                                <Typography level="body-lg">{translateProductStatus(currentProduct.status)}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.stock')}</Typography>
                                <Typography level="body-lg">{currentProduct.inventory?.stock || 0}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.createdTime')}</Typography>
                                <Typography level="body-lg">{formatDate(currentProduct.createdAt)}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.updatedTime')}</Typography>
                                <Typography level="body-lg">{formatDate(currentProduct.updatedAt)}</Typography>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.images')}</Typography>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1}}>
                                    {currentProduct.images && currentProduct.images.length > 0 ? (
                                        currentProduct.images.map((image, index) => (
                                            <Box
                                                key={index}
                                                component="img"
                                                src={image.url}
                                                alt={`${currentProduct.name}-${index}`}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 'md',
                                                    border: '1px solid',
                                                    borderColor: 'divider'
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography level="body-sm">{t('products.details.noImages')}</Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box>
                                <Typography level="body-sm">{t('products.details.attributes')}</Typography>
                                {currentProduct.attributes && Object.keys(currentProduct.attributes).length > 0 ? (
                                    <Sheet variant="outlined" sx={{p: 1, borderRadius: 'md', mt: 1}}>
                    <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>
                      {JSON.stringify(currentProduct.attributes, null, 2)}
                    </pre>
                                    </Sheet>
                                ) : (
                                    <Typography level="body-sm">{t('products.details.noAttributes')}</Typography>
                                )}
                            </Box>
                        </Stack>
                    )}

                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3}}>
                        <Button variant="plain" color="neutral" onClick={() => setOpenViewModal(false)}>
                            {t('common.close')}
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>

            {/* 提示消息 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                color={snackbar.severity}
            >
                {snackbar.message}
            </Snackbar>
        </Box>
    )
}
