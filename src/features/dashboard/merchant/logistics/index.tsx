import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { showMessage } from "@/utils/showMessage.ts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog,
    Stack,
    Typography
} from "@mui/joy";
import { getStatusColor, getStatusText } from "@/utils/status.ts";
import { MenuItem, Select, TextField } from "@mui/material";
import { MerchantAddress } from "@/features/dashboard/merchant/addresses/types.ts";
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";
import { merchantAddressService } from "../addresses/api";
import { Order } from "@/features/dashboard/consumer/orders/type.ts";

export default function MerchantLogistics() {
    const {t} = useTranslation()
    const [orders, setOrders] = useState<Order[]>([])
    const [addresses, setAddresses] = useState<MerchantAddress[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false)
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [trackingNumber, setTrackingNumber] = useState('')
    const [carrier, setCarrier] = useState('')
    const [selectedAddress, setSelectedAddress] = useState<MerchantAddress | null>(null)

    // 获取商家地址列表和订单列表
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // 获取地址列表
                const addressResponse = await merchantAddressService.listAddresses({
                    page: 1,
                    pageSize: 100
                })
                setAddresses(addressResponse.addresses)

                // 获取订单列表
                await fetchOrders()
            } catch (error) {
                console.error('获取数据失败:', error)
                showMessage('获取数据失败', 'error')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // 获取订单列表
    const fetchOrders = async () => {
        try {
            const response = await orderService.getOrder({
                page: 1,
                pageSize: 50
            })

            if (response && response.orders) {
                setOrders(response.orders)
            }
        } catch (error) {
            console.error('获取订单列表失败:', error)
            showMessage('获取订单列表失败', 'error')
        }
    }

    // 表格列定义
    const columns: GridColDef[] = [
        {field: 'orderId', headerName: t('merchant.orders.orderId'), width: 150},
        {field: 'userId', headerName: t('merchant.orders.userId'), width: 150},
        {
            field: 'paymentStatus',
            headerName: t('merchant.orders.paymentStatus'),
            width: 120,
            renderCell: (params) => (
                <Chip
                    variant="soft"
                    size="sm"
                    color={getStatusColor(params.value)}
                >
                    {getStatusText(params.value)}
                </Chip>
            ),
        },
        {
            field: 'shippingStatus',
            headerName: '物流状态',
            width: 120,
            renderCell: (params) => (
                <Chip
                    variant="soft"
                    size="sm"
                    color={getStatusColor(params.value)}
                >
                    {getStatusText(params.value)}
                </Chip>
            ),
        },
        {
            field: 'createdAt',
            headerName: '创建时间',
            width: 180,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString()
            }
        },
        {
            field: 'address',
            headerName: '收货地址',
            width: 250,
            valueGetter: (params) => {
                const address = params.row.address
                return address ? `${address.streetAddress}, ${address.city}, ${address.state}, ${address.country}` : ''
            }
        },
        {
            field: 'actions',
            headerName: '操作',
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleShip(params.row)}
                    disabled={params.row.shippingStatus !== 'PENDING_SHIPMENT'}
                >
                    发货
                </Button>
            ),
        },
    ]

    // 处理发货操作
    const handleShip = (order: Order) => {
        setSelectedOrder(order)
        setTrackingNumber('')
        setCarrier('')
        setIsAddressDialogOpen(true)
    }

    // 处理地址选择
    const handleAddressSelect = (address: MerchantAddress) => {
        setSelectedAddress(address)
        setIsAddressDialogOpen(false)
        setIsShippingDialogOpen(true)
    }

    // 确认发货
    const confirmShipment = async () => {
        if (!selectedOrder || !selectedAddress || !trackingNumber || !carrier) {
            showMessage('请填写完整的发货信息', 'warning')
            return
        }

        try {
            // TODO 调用发货API
            await orderService.shipOrder({
                orderId: selectedOrder.orderId,
                trackingNumber: trackingNumber,
                carrier: carrier,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 预计7天后送达
                shippingAddress: {
                    contactPerson: selectedAddress.contactPerson,
                    contactPhone: selectedAddress.contactPhone,
                    streetAddress: selectedAddress.streetAddress,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    country: selectedAddress.country,
                    zipCode: selectedAddress.zipCode
                }
            })

            showMessage('发货成功', 'success')
            setIsShippingDialogOpen(false)
            // 刷新订单列表
            await fetchOrders()
        } catch (error) {
            console.error('发货失败:', error)
            showMessage('发货失败', 'error')
        }
    }

    // 过滤订单列表
    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true
        return order.shippingStatus === statusFilter
    })

    return (
        <Box sx={{p: 3}}>
            <Typography level="h4" sx={{mb: 2}}>
                物流管理
            </Typography>

            <Card sx={{mb: 3}}>
                <CardContent>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <FormLabel sx={{mr: 2}}>物流状态筛选:</FormLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as string)}
                            sx={{minWidth: 200}}
                        >
                            <MenuItem value="all">全部订单</MenuItem>
                            <MenuItem value="PENDING_SHIPMENT">待发货</MenuItem>
                            <MenuItem value="PROCESSING">处理中</MenuItem>
                            <MenuItem value="SHIPPED">已发货</MenuItem>
                            <MenuItem value="DELIVERED">已送达</MenuItem>
                            <MenuItem value="CONFIRMED">已确认收货</MenuItem>
                        </Select>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <DataGrid
                        rows={filteredOrders}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 10},
                            },
                        }}
                        pageSizeOptions={[10, 20, 50]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        loading={loading}
                    />
                </CardContent>
            </Card>

            {/* 地址选择对话框 */}
            <Modal
                open={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
            >
                <ModalDialog>
                    <ModalClose/>
                    <Typography level="h5" sx={{mb: 2}}>
                        选择发货地址
                    </Typography>
                    <Stack spacing={2}>
                        {addresses.map((address) => (
                            <Card
                                key={address.id}
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {bgcolor: 'action.hover'},
                                    border: address.isDefault ? '2px solid primary.main' : '1px solid divider'
                                }}
                                onClick={() => handleAddressSelect(address)}
                            >
                                <CardContent>
                                    <Typography level="body-md" fontWeight="bold">
                                        {address.contactPerson} - {address.contactPhone}
                                    </Typography>
                                    <Typography level="body-sm">
                                        {address.streetAddress}, {address.city}, {address.state}, {address.country} {address.zipCode}
                                    </Typography>
                                    {address.isDefault && (
                                        <Chip
                                            size="sm"
                                            color="primary"
                                            sx={{mt: 1}}
                                        >
                                            默认地址
                                        </Chip>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </ModalDialog>
            </Modal>

            {/* 发货对话框 */}
            <Modal
                open={isShippingDialogOpen}
                onClose={() => setIsShippingDialogOpen(false)}
            >
                <ModalDialog>
                    <ModalClose/>
                    <Typography level="h5" sx={{mb: 2}}>
                        确认发货
                    </Typography>

                    {selectedAddress && (
                        <Card variant="outlined" sx={{mb: 3}}>
                            <CardContent>
                                <Typography level="body-md" fontWeight="bold">
                                    发货地址
                                </Typography>
                                <Typography level="body-sm">
                                    {selectedAddress.contactPerson} - {selectedAddress.contactPhone}
                                </Typography>
                                <Typography level="body-sm">
                                    {selectedAddress.streetAddress}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country} {selectedAddress.zipCode}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <TextField
                        label="物流单号"
                        fullWidth
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        sx={{mb: 3}}
                        required
                    />

                    <TextField
                        label="承运商"
                        fullWidth
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        sx={{mb: 3}}
                        required
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setIsShippingDialogOpen(false)}
                        >
                            取消
                        </Button>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={confirmShipment}
                            disabled={!selectedAddress || !trackingNumber || !carrier}
                        >
                            确认发货
                        </Button>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>
    )
}
