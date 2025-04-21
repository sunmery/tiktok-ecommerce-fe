import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Chip, FormLabel, Stack, Typography } from '@mui/joy'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { addressService, Address, AddressType } from '@/api/merchant/addressService'
import { showMessage } from '@/utils/showMessage'
import { InputLabel, Select, FormControl, MenuItem, TextField } from "@mui/material"
import { orderService } from '@/api/orderService'
import { Order } from '@/types/orders'
import { getStatusColor, getStatusText } from '@/utils/status'

export const Route = createLazyFileRoute('/merchant/logistics/')({ component: LogisticsManagement })

function LogisticsManagement() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<number | ''>('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')

  // 获取商家地址列表和订单列表
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 获取地址列表
        const addressResponse = await addressService.listAddresses({
          addressType: AddressType.WAREHOUSE,
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
    { field: 'orderId', headerName: t('merchant.orders.orderId'), width: 150 },
    { field: 'userId', headerName: t('merchant.orders.userId'), width: 150 },
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
    setIsShippingDialogOpen(true)
  }

  // 确认发货
  const confirmShipment = async () => {
    if (!selectedOrder || !selectedAddress || !trackingNumber || !carrier) {
      showMessage('请填写完整的发货信息', 'warning')
      return
    }

    try {
      // 获取选中的地址信息
      const selectedAddressInfo = addresses.find(addr => addr.id === selectedAddress)
      if (!selectedAddressInfo) {
        showMessage('请选择有效的发货地址', 'warning')
        return
      }

      // 调用发货API
      await orderService.shipOrder({
        orderId: selectedOrder.orderId,
        trackingNumber: trackingNumber,
        carrier: carrier,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 预计7天后送达
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
    <Box sx={{ p: 3 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        物流管理
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormLabel sx={{ mr: 2 }}>物流状态筛选:</FormLabel>
            <Select
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as string)}
              sx={{ minWidth: 200 }}
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
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* 发货对话框 */}
      {isShippingDialogOpen && (
        <Card variant="outlined" sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, p: 3, zIndex: 1000 }}>
          <Typography level="title-lg" sx={{ mb: 2 }}>
            确认发货
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>选择发货地址</InputLabel>
            <Select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value as number)}
            >
              {addresses.map((address) => (
                <MenuItem key={address.id} value={address.id}>
                  {address.streetAddress} - {address.contactPerson}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="物流单号"
            fullWidth
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          
          <TextField
            label="承运商"
            fullWidth
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            sx={{ mb: 3 }}
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
        </Card>
      )}
    </Box>
  )
}
