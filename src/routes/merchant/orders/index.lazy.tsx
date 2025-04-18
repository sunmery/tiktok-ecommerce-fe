import {createLazyFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Modal,
    Sheet,
    Snackbar,
    Table,
    Typography
} from '@mui/joy'
import {Order, PaymentStatus} from '@/types/orders'
import {orderService} from '@/api/orderService'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {useTranslation} from "react-i18next";
import {getStatusText} from "@/utils/status.ts";

export const Route = createLazyFileRoute('/merchant/orders/')({
    component: Orders,
})

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'danger';
    }>({
        open: false,
        message: '',
        severity: 'success'
    })
    const {t} = useTranslation()

    useEffect(() => {
        loadOrders().then((data) => {
            console.log('获取订单列表成功:', data)
        }).catch((e) => {
            console.error('获取订单列表失败:', e)
        })
    }, [])

    const loadOrders = async () => {
        try {
            setLoading(true)

            // 调用API获取订单列表
            const response = await orderService.getOrder({
                userId: '', // 留空，API会使用当前登录用户的ID
                page: 1,
                pageSize: 50
            })

            if (response && response.orders) {
                setOrders(response.orders)
                return response.orders
            }

            return []
        } catch (error) {
            console.error('获取订单列表失败:', error)
            setSnackbar({
                open: true,
                message: t('merchant.orders.fetchFailed'),
                severity: 'danger'
            })
            return []
        } finally {
            setLoading(false)
        }
    }

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order)
        setDetailOpen(true)
    }

    const handleDetailClose = () => {
        setDetailOpen(false)
        setSelectedOrder(null)
    }

    const handleStatusChange = async (orderId: string, status: PaymentStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, status)
            setOrders(prevOrders => {
                return prevOrders.map(order => {
                    if (order.orderId === orderId) {
                        return {...order, paymentStatus: status}
                    }
                    return order
                })
            })
            setSnackbar({
                open: true,
                message: t('merchant.orders.updateSuccess'),
                severity: 'success'
            })
        } catch (error) {
            console.error('更新订单状态失败:', error)
            setSnackbar({
                open: true,
                message: t('merchant.orders.updateFailed'),
                severity: 'danger'
            })
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <Box sx={{p: 2}}>
            <Breadcrumbs pathMap={{
                'merchant': `${t('profile.merchantCenter')}`,
                'orders': `${t('merchant.orders.title')}`,
            }}/>

            <Typography level="h2" sx={{mb: 3}}>{t('merchant.orders.title')}</Typography>

            <Card variant="outlined" sx={{mb: 3, overflowX: 'auto', minWidth: 900}}>
                <CardContent>
                    <Typography level="title-lg" sx={{mb: 2}}>{t('merchant.orders.listTitle')}</Typography>

                    {loading ? (
                        <Typography>{t('merchant.orders.loading')}</Typography>
                    ) : orders.length === 0 ? (
                        <Typography>{t('merchant.orders.noData')}</Typography>
                    ) : (
                        <Table sx={{minWidth: 900}}>
                            <thead>
                            <tr>
                                <th style={{width: '25%'}}>{t('merchant.orders.orderId')}</th>
                                <th style={{width: '15%'}}>{t('merchant.orders.createdTime')}</th>
                                <th style={{width: '15%'}}>{t('merchant.orders.amount')}</th>
                                <th style={{width: '5%'}}>{t('merchant.orders.paymentStatus')}</th>
                                <th style={{width: '15%'}}>{t('merchant.orders.userId')}</th>
                                <th style={{width: '10%'}}>{t('merchant.orders.viewDetails')}</th>
                                <th style={{width: '35%'}}>{t('merchant.orders.actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => {
                                // 计算订单总金额
                                const total = order.items.reduce((sum, item) => sum + item.cost, 0)

                                return (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.currency} {total.toFixed(2)}</td>
                                        <td>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <Typography
                                                    level="body-sm"
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {getStatusText(order.paymentStatus)}
                                                </Typography>
                                            </Box>
                                        </td>
                                        <td>{order.userId}</td>
                                        <td>
                                            <Box sx={{display: 'flex', gap: 1}}>
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    color="primary"
                                                    onClick={() => handleOrderClick(order)}
                                                >
                                                    {t('merchant.orders.viewDetails')}
                                                </Button>

                                                {order.paymentStatus === PaymentStatus.Paid && (
                                                    <Button
                                                        size="sm"
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={() => handleStatusChange(order.orderId, PaymentStatus.Shipped)}
                                                    >
                                                        {t('merchant.orders.ship')}
                                                    </Button>
                                                )}
                                            </Box>
                                        </td>
                                        <td>
                                            <Box sx={{display: 'flex', gap: 1}}>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    color="danger"
                                                    onClick={() => handleStatusChange(order.orderId, PaymentStatus.Failed)}
                                                >
                                                    {t('merchant.orders.shipFailed')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={() => handleStatusChange(order.orderId, PaymentStatus.Processing)}
                                                >
                                                    {t('merchant.orders.markToBeShipped')}
                                                </Button>
                                            </Box>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* 订单详情模态框 */}
            <Modal
                aria-labelledby="订单详情"
                open={detailOpen}
                onClose={handleDetailClose}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: '800px',
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                        <Typography id="order-detail-modal-title" level="title-lg">
                            {t('orders.details')}
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={handleDetailClose}
                        >
                            <CloseRoundedIcon/>
                        </IconButton>
                    </Box>

                    {selectedOrder && (
                        <Box>
                            <Grid container spacing={2} sx={{mb: 2}}>
                                <Grid xs={12} sm={6}>
                                    <Typography level="title-sm">{t('orders.orderId')}</Typography>
                                    <Typography>{selectedOrder.orderId}</Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <Typography level="title-sm">{t('merchant.orders.createdTime')}</Typography>
                                    <Typography>{formatDate(selectedOrder.createdAt)}</Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <Typography level="title-sm">{t('merchant.orders.userId')}</Typography>
                                    <Typography>{selectedOrder.userId}</Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <Typography level="title-sm">{t('orders.customerInfo')}</Typography>
                                    <Typography>{selectedOrder.email}</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{mb: 2}}>
                                <Typography level="title-sm">{t('orders.shippingAddress')}</Typography>
                                <Typography>
                                    {selectedOrder.address.streetAddress}, {selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.country}, {selectedOrder.address.zipCode}
                                </Typography>
                            </Box>

                            <Typography level="title-sm" sx={{mb: 1}}>{t('orders.products')}</Typography>
                            <Table sx={{mb: 2}}>
                                <thead>
                                <tr>
                                    <th>{t('orders.product')}</th>
                                    <th>{t('orders.unitPrice')}</th>
                                    <th>{t('orders.quantity')}</th>
                                    <th>{t('orders.subtotal')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.item.name || `${t('orders.product')}${item.item.productId.substring(0, 8)}`}</td>
                                        <td>{selectedOrder.currency} {(item.cost / item.item.quantity).toFixed(2)}</td>
                                        <td>{item.item.quantity}</td>
                                        <td>{selectedOrder.currency} {item.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={3}
                                        style={{textAlign: 'right', fontWeight: 'bold'}}>{t('orders.total')}</td>
                                    <td style={{fontWeight: 'bold'}}>
                                        {selectedOrder.currency} {selectedOrder.items.reduce((total, item) => total + item.cost, 0).toFixed(2)}
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Box>
                    )}
                </Sheet>
            </Modal>

            {/* 提示消息 */}
            <Snackbar
                variant="solid"
                color={snackbar.severity}
                open={snackbar.open}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                autoHideDuration={3000}
            >
                {snackbar.message}
            </Snackbar>
        </Box>
    )
}
