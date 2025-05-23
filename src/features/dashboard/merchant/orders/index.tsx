import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination } from "./hooks.ts";
import { PaymentStatus, ShippingStatus } from "@/types/status.ts";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    Modal,
    Sheet,
    Snackbar,
    Table,
    Typography
} from "@mui/joy";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import RefreshIcon from "@mui/icons-material/Refresh";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { getStatusText, shippingStatus } from "@/utils/status.ts";
import PaginationBar from "@/shared/components/PaginationBar.tsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AddressSelector } from "./components/AddressSelector.tsx";
import { MerchantOrder, MerchantOrderItem } from "./types";
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";
import { merchantOrderService } from "@/features/dashboard/merchant/orders/api.ts";
import { MerchantAddress } from "../addresses/types.ts";

export default function MerchantOrders() {
    const [orders, setOrders] = useState<MerchantOrder[]>([])
    const [detailOpen, setDetailOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [addressSelectorOpen, setAddressSelectorOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<MerchantOrderItem | null>(null)
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


    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 50,
    });

    useEffect(() => {
        loadOrders().then((data) => {
            console.log('获取订单列表成功:', data)
        }).catch((e) => {
            console.error('获取订单列表失败:', e)
        })
    }, [pagination.page, pagination.pageSize])

    const loadOrders = async () => {
        try {
            setLoading(true)

            // 调用API获取订单列表
            const response = await merchantOrderService.getMerchantOrders({
                page: pagination.page,
                pageSize: pagination.pageSize
            })
            console.log("response, ", response)
            if (response && response.orders) {
                setOrders(response.orders)

                // 更新总条目数
                const formattedOrders = response.orders.flatMap(order =>
                    order.items.map(item => ({
                        ...item,
                        orderId: order.orderId,
                        orderCreatedAt: order.createdAt
                    }))
                );

                if (formattedOrders.length > 0) {
                    pagination.setTotalItems(formattedOrders.length);
                } else {
                    // 没有总数时，用当前页数据估算
                    const isLastPage = formattedOrders.length < pagination.pageSize;
                    const estimatedTotal = isLastPage
                        ? (pagination.page - 1) * pagination.pageSize + formattedOrders.length
                        : pagination.page * pagination.pageSize + 1;
                    pagination.setTotalItems(estimatedTotal);
                }

                console.log("formatted orders", formattedOrders)
                return formattedOrders
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

    const handleOrderClick = (order: MerchantOrderItem) => {
        setSelectedOrder(order)
        setDetailOpen(true)
    }

    const handleDetailClose = () => {
        setDetailOpen(false)
        setSelectedOrder(null)
    }

    // TODO 待发货和不发货的订单
    const handleStatusChange = async (subOrderId: number, shippingStatus: ShippingStatus) => {
        try {
            await orderService.updateOrderShippingStatus({
                shippingStatus: shippingStatus,
                subOrderId: subOrderId,
            })
            setOrders(prevOrders => {
                // 创建一个新的数组而不是对象
                return prevOrders.map(order => {
                    const updatedItems = order.items.map(item => {
                        if (item.subOrderId === subOrderId) {
                            return {...item, shippingStatus};
                        }
                        return item;
                    });
                    return {...order, items: updatedItems};
                });
            });
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
    const handleShipOrder = async (order: MerchantOrderItem) => {
        setSelectedOrder(order);
        setAddressSelectorOpen(true);
    };

    const handleAddressSelect = async (address: MerchantAddress, shipInfo: {
        trackingNumber: string;
        carrier: string;
        delivery: string; // 接收 delivery
        shippingFee: number;
    }) => {
        if (!selectedOrder) return;

        try {
            await orderService.updateOrderShippingStatus({
                subOrderId: selectedOrder.subOrderId,
                trackingNumber: shipInfo.trackingNumber,
                carrier: shipInfo.carrier,
                shippingFee: shipInfo.shippingFee,
                // delivery: shipInfo.delivery, // 传递 delivery
                shippingStatus: ShippingStatus.ShippingShipped, // 设置状态为已发货
                shippingAddress: { // 确保传递地址信息
                    addressType: address.addressType,
                    contactPerson: address.contactPerson,
                    contactPhone: address.contactPhone,
                    streetAddress: address.streetAddress,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    zipCode: address.zipCode,
                }
            });
            setSnackbar({
                open: true,
                message: t('merchant.orders.shipSuccess'),
                severity: 'success'
            });
            // 刷新订单列表
            await loadOrders();
        } catch (error) {
            console.error('发货失败:', error);
            setSnackbar({
                open: true,
                message: t('merchant.orders.shipFailed'),
                severity: 'danger'
            });
        } finally {
            setAddressSelectorOpen(false);
            setSelectedOrder(null);
        }
    };


    const handleRefresh = async () => {
        try {
            setLoading(true)
            await loadOrders()
            setSnackbar({
                open: true,
                message: t('merchant.orders.refreshSuccess'),
                severity: 'success'
            })
        } catch (error) {
            console.error('刷新订单列表失败:', error)
            setSnackbar({
                open: true,
                message: t('merchant.orders.refreshFailed'),
                severity: 'danger'
            })
        } finally {
            setLoading(false)
        }
    }

    const [filterShippingStatus, setFilterShippingStatus] = useState<string>(t('common.all'));
    const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>(t('common.all'));

    const filteredOrders = orders.filter(order => {
        // MerchantOrder 本身没有 shippingStatus 和 paymentStatus 属性
        // 我们需要检查订单中的每个项目是否匹配过滤条件
        // 如果任何一个项目匹配，则保留该订单
        return order.items.some(item => {
            const matchShipping = filterShippingStatus === t('common.all') || item.shippingStatus === filterShippingStatus;
            const matchPayment = filterPaymentStatus === t('common.all') || item.paymentStatus === filterPaymentStatus;
            return matchShipping && matchPayment;
        });
    });

    // 格式化日期
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Box sx={{p: 2}}>
            <Breadcrumbs pathMap={{
                'merchant': `${t('profile.merchantCenter')}`,
                'orders': `${t('merchant.orders.title')}`,
            }}/>

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('merchant.orders.title')}</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    startDecorator={<RefreshIcon/>}
                    onClick={handleRefresh}
                    loading={loading}
                >
                    {t('common.refresh')}
                </Button>
            </Box>

            <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <FormControl sx={{minWidth: 200}}>
                    <InputLabel>{t('merchant.orders.filterShippingStatus')}</InputLabel>
                    <Select
                        value={filterShippingStatus}
                        label={t('merchant.orders.filterShippingStatus')}
                        onChange={(e) => setFilterShippingStatus(e.target.value)}
                    >
                        <MenuItem value={t('common.all')}>{t('common.all')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingWaitCommand}>{t('merchant.orders.status.waitCommand')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingPending}>{t('merchant.orders.status.pendingShipment')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingShipped}>{t('merchant.orders.status.shipped')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingInTransit}>{t('merchant.orders.status.inTransit')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingDelivered}>{t('merchant.orders.status.delivered')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingConfirmed}>{t('merchant.orders.status.confirmed')}</MenuItem>
                        <MenuItem
                            value={ShippingStatus.ShippingCancelled}>{t('merchant.orders.status.cancelled')}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{minWidth: 200}}>
                    <InputLabel>{t('merchant.orders.filterPaymentStatus')}</InputLabel>
                    <Select
                        value={filterPaymentStatus}
                        label={t('merchant.orders.filterPaymentStatus')}
                        onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    >
                        <MenuItem value={t('common.all')}>{t('common.all')}</MenuItem>
                        <MenuItem value="NOT_PAID">{t('merchant.orders.status.notPaid')}</MenuItem>
                        <MenuItem value="PROCESSING">{t('merchant.orders.status.processing')}</MenuItem>
                        <MenuItem value="PAID">{t('merchant.orders.status.paid')}</MenuItem>
                        <MenuItem value="FAILED">{t('merchant.orders.status.failed')}</MenuItem>
                        <MenuItem value="CANCELLED">{t('merchant.orders.status.cancelled')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Card variant="outlined" sx={{mb: 3, overflowX: 'auto', minWidth: 900}}>
                <CardContent>
                    <Typography level="title-lg" sx={{mb: 2}}>{t('merchant.orders.listTitle')}</Typography>

                    {loading ? (
                        <Typography>{t('merchant.orders.loading')}</Typography>
                    ) : filteredOrders.length === 0 ? (
                        <Typography>{t('merchant.orders.noData')}</Typography>
                    ) : (
                        <Table sx={{
                            minWidth: 900,
                            width: '100vw'
                        }}>
                            <thead>
                            <tr>
                                <th style={{width: '15%'}}>{t('merchant.orders.orderId')}</th>
                                <th style={{width: '10%'}}>{t('merchant.orders.createdTime')}</th>
                                <th style={{width: '10%'}}>{t('merchant.orders.amount')}</th>
                                <th style={{width: '5%'}}>{t('merchant.orders.paymentStatus')}</th>
                                <th style={{width: '5%'}}>{t('merchant.orders.shippingStatus')}</th>
                                <th style={{width: '15%'}}>{t('merchant.orders.userId')}</th>
                                <th style={{width: '10%'}}>{t('merchant.orders.viewDetails')}</th>
                                <th style={{width: '25%'}}>{t('merchant.orders.actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOrders.map((item) => {
                                // 计算订单总金额
                                const total = item.items.reduce((sum, item) => sum + item.cost, 0)

                                return (
                                    <>
                                        {
                                            item.items.map((order) => (
                                                <tr key={order.subOrderId}>
                                                    <td>{order.subOrderId}</td>
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
                                                    <td>{shippingStatus(order.shippingStatus)}</td>
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

                                                            {order.shippingStatus === ShippingStatus.ShippingWaitCommand &&
                                                                ![PaymentStatus.NotPaid, PaymentStatus.Failed, PaymentStatus.Cancelled].includes(order.paymentStatus) && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outlined"
                                                                        color="success"
                                                                        onClick={() => handleShipOrder(order)}
                                                                    >
                                                                        {t('merchant.orders.ship')}
                                                                    </Button>
                                                                )}
                                                        </Box>
                                                    </td>
                                                    <td>
                                                        <Box sx={{display: 'flex', gap: 1}}>
                                                            {order.shippingStatus === ShippingStatus.ShippingWaitCommand &&
                                                                ![PaymentStatus.NotPaid, PaymentStatus.Failed, PaymentStatus.Cancelled].includes(order.paymentStatus) && (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outlined"
                                                                            color="danger"
                                                                            onClick={() => handleStatusChange(order.subOrderId, ShippingStatus.ShippingCancelled)}
                                                                        >
                                                                            {t('merchant.orders.shipFailed')}
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outlined"
                                                                            color="warning"
                                                                            onClick={() => handleStatusChange(order.subOrderId, ShippingStatus.ShippingPending)}
                                                                        >
                                                                            {t('merchant.orders.markToBeShipped')}
                                                                        </Button>
                                                                    </>
                                                                )}
                                                        </Box>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </>
                                )
                            })}
                            </tbody>
                        </Table>
                    )}

                    {/* 分页控制 */}
                    <Box sx={{mt: 2}}>
                        <PaginationBar
                            page={pagination.page}
                            pageSize={pagination.pageSize}
                            totalItems={orders.length}
                            totalPages={pagination.totalPages}
                            onPageChange={pagination.handlePageChange}
                            onPageSizeChange={pagination.handlePageSizeChange}
                            showPageSizeSelector
                            showTotalItems
                        />
                    </Box>
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
                                    <Typography>{selectedOrder.subOrderId}</Typography>
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

                                <tr>
                                    <td>{selectedOrder.item.name || `${t('orders.product')}${selectedOrder.item.productId.substring(0, 8)}`}</td>
                                    <td>{selectedOrder.currency} {(selectedOrder.cost / selectedOrder.item.quantity).toFixed(2)}</td>
                                    <td>{selectedOrder.item.quantity}</td>
                                    <td>{selectedOrder.currency} {selectedOrder.cost.toFixed(2)}</td>
                                </tr>

                                <tr>
                                    <td colSpan={3}
                                        style={{textAlign: 'right', fontWeight: 'bold'}}>{t('orders.total')}</td>
                                    <td style={{fontWeight: 'bold'}}>
                                        {selectedOrder.currency} {(selectedOrder.cost * selectedOrder.item.quantity).toFixed(2)}
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

            {/* 地址选择模态框 */}
            <AddressSelector
                open={addressSelectorOpen}
                onClose={() => {
                    setAddressSelectorOpen(false);
                    setSelectedOrder(null);
                }}
                onSelect={handleAddressSelect}
            />
        </Box>
    )
}
