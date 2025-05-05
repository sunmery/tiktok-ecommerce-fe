import {Box, Card, CardContent, Chip, Divider, Grid, Typography, Avatar, Modal, ModalDialog, ModalClose, Sheet, Stack, Accordion, AccordionDetails, AccordionSummary} from '@mui/joy'
import { ConsumerOrderItem, MergedOrder} from '@/types/orders.ts'
import {formatCurrency} from '@/utils/format.ts'
import {useState} from 'react'
import {orderService} from '@/api/orderService'
import {useQuery} from '@tanstack/react-query'
import {useTranslation} from 'react-i18next'
import {getShippingStatusColor, getStatusText, shippingStatus} from '@/utils/status'
import {getStatusColor} from "@/utils/status.ts"
import {ExpandMore} from '@mui/icons-material'

// 格式化时间戳
const formatDate = (timestamp: any) => {
    if (!timestamp) return ''

    // 处理不同格式的时间戳
    let date
    if (timestamp.seconds) {
        // Firestore 时间戳格式
        date = new Date(timestamp.seconds * 1000)
    } else {
        // ISO 字符串或其他格式
        date = new Date(timestamp)
    }

    return date.toLocaleString()
}

// 获取订单中所有商品的总数量
const getTotalItemsCount = (items: ConsumerOrderItem[]) => {
    return items.reduce((total, item) => {
        return total + (item.item.quantity || 1);
    }, 0);
}

interface OrderListProps {
    orders: MergedOrder[]
}

export default function OrderList({orders}: OrderListProps) {
    const {t} = useTranslation()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 获取订单详情
    const {isLoading} = useQuery({
        queryKey: ['orderDetail', selectedOrderId],
        queryFn: () => orderService.getOrderDetail(selectedOrderId as string),
        enabled: !!selectedOrderId, // 只有在有selectedOrderId时才执行查询
        staleTime: 5 * 60 * 1000, // 5分钟内数据不会被标记为过时
    });

    // 处理点击订单
    const handleOrderClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    // 关闭模态框
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {orders.map((order: MergedOrder) => {
                    // 计算订单中的商品总数量
                    const totalItemsCount = getTotalItemsCount(order.items);
                    
                    return (
                        <Card
                            key={order.orderId}
                            variant="outlined"
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 'md',
                                    borderColor: 'primary.300'
                                }
                            }}
                            onClick={() => handleOrderClick(order.orderId)}
                        >
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                            <Typography level="title-md">
                                                {t('order.id')}: {order.orderId}
                                            </Typography>
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                color={getStatusColor(order.paymentStatus)}
                                            >
                                                {getStatusText(order.paymentStatus)}
                                            </Chip>
                                        </Box>
                                        <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                            {t('order.date')}: {formatDate(order.createdAt)}
                                        </Typography>
                                        <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                            {t('order.subOrders')}: {order.subOrders.length}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>
                                    
                                    {/* 商品预览区域 */}
                                    <Grid xs={12}>
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <Box key={index} sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                                                    <Avatar 
                                                        variant="solid"
                                                        src={item.item.picture} 
                                                        alt={item.item.name}
                                                        sx={{width: 50, height: 50}}
                                                    />
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Typography level="body-md" noWrap>
                                                            {item.item.name}
                                                        </Typography>
                                                        <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                                            {t('order.quantity')}: {item.item.quantity} x {item.cost / item.item.quantity}
                                                        </Typography>
                                                    </Box>
                                                    <Typography level="body-md" sx={{fontWeight: 'bold'}}>
                                                        {formatCurrency(item.cost)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            
                                            {/* 如果商品数量超过3个，显示更多提示 */}
                                            {totalItemsCount > 3 && (
                                                <Typography level="body-sm" sx={{color: 'text.secondary', textAlign: 'center'}}>
                                                    {t('order.moreItems', {count: totalItemsCount - 3})}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                    
                                    <Grid xs={12}>
                                        <Divider />
                                    </Grid>
                                    
                                    <Grid xs={12}>
                                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <Box>
                                                <Typography level="body-sm">
                                                    {t('order.totalItems')}: {totalItemsCount}
                                                </Typography>
                                            </Box>
                                            <Box sx={{textAlign: 'right'}}>
                                                <Typography level="body-sm">{t('order.total')}:</Typography>
                                                <Typography level="title-md" sx={{color: 'primary.600'}}>
                                                    {formatCurrency(order.totalAmount)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* 订单详情模态框 */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <ModalDialog size="lg" sx={{maxWidth: 800, width: '100%', maxHeight: '90vh', overflow: 'auto'}}>
                    <ModalClose />
                    <Typography level="h4" sx={{mb: 2}}>
                        {t('order.details')}
                    </Typography>
                    
                    {isLoading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                            <Typography>{t('loading')}</Typography>
                        </Box>
                    ) : selectedOrderId ? (
                        <Box>
                            {/* 查找当前选中的订单 */}
                            {(() => {
                                const selectedOrder = orders.find(order => order.orderId === selectedOrderId);
                                
                                if (!selectedOrder) {
                                    return <Typography>{t('order.notFound')}</Typography>;
                                }
                                
                                return (
                                    <>
                                        <Sheet variant="outlined" sx={{p: 2, borderRadius: 'sm', mb: 2}}>
                                            <Grid container spacing={2}>
                                                <Grid xs={12} md={6}>
                                                    <Typography level="title-sm">{t('order.id')}:</Typography>
                                                    <Typography level="body-md">{selectedOrder.orderId}</Typography>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Typography level="title-sm">{t('order.date')}:</Typography>
                                                    <Typography level="body-md">{formatDate(selectedOrder.createdAt)}</Typography>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Typography level="title-sm">{t('order.paymentStatus')}:</Typography>
                                                    <Chip
                                                        variant="soft"
                                                        size="sm"
                                                        color={getStatusColor(selectedOrder.paymentStatus)}
                                                    >
                                                        {getStatusText(selectedOrder.paymentStatus)}
                                                    </Chip>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Typography level="title-sm">{t('order.totalAmount')}:</Typography>
                                                    <Typography level="body-md">{formatCurrency(selectedOrder.totalAmount)}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Sheet>
                                        
                                        <Typography level="title-md" sx={{mb: 1}}>
                                            {t('order.subOrders')} ({selectedOrder.subOrders.length})
                                        </Typography>
                                        
                                        {/* 子订单列表 */}
                                        {selectedOrder.subOrders.map((subOrder, index) => (
                                            <Accordion key={subOrder.subOrderId} sx={{mb: 2}}>
                                                <AccordionSummary indicator={<ExpandMore />}>
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                                                        <Typography level="title-sm">
                                                            {t('order.subOrder')} #{index + 1} - {subOrder.subOrderId}
                                                        </Typography>
                                                        <Chip
                                                            variant="soft"
                                                            size="sm"
                                                            color={getShippingStatusColor(subOrder.shippingStatus)}
                                                        >
                                                            {getStatusText(subOrder.shippingStatus)}
                                                        </Chip>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Sheet variant="outlined" sx={{borderRadius: 'sm', overflow: 'hidden'}}>
                                                        {subOrder.items.map((item, itemIndex) => (
                                                            <Box key={itemIndex}>
                                                                <Box sx={{display: 'flex', p: 2, gap: 2}}>
                                                                    <Avatar
                                                                        src={item.item.picture} 
                                                                        alt={item.item.name}
                                                                        sx={{width: 80, height: 80}}
                                                                    />
                                                                    <Box sx={{flex: 1}}>
                                                                        <Typography level="title-sm">{item.item.name}</Typography>
                                                                        <Typography level="body-sm" sx={{color: 'text.secondary', mb: 1}}>
                                                                            {t('product.merchantId')}: {item.item.merchantId}
                                                                        </Typography>
                                                                        <Stack direction="row" justifyContent="space-between">
                                                                            <Typography level="body-md">
                                                                                {formatCurrency(item.cost)} × {item.item.quantity}
                                                                            </Typography>
                                                                            <Typography level="title-sm">
                                                                                {formatCurrency(item.cost * item.item.quantity)}
                                                                            </Typography>
                                                                        </Stack>
                                                                    </Box>
                                                                </Box>
                                                                {itemIndex < subOrder.items.length - 1 && <Divider />}
                                                            </Box>
                                                        ))}
                                                    </Sheet>
                                                    
                                                    <Box sx={{mt: 2}}>
                                                        <Typography level="title-sm" sx={{mb: 1}}>
                                                            {t('order.subOrderDetails')}:
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid xs={12} md={6}>
                                                                <Typography level="body-sm">{t('order.createdAt')}:</Typography>
                                                                <Typography level="body-md">{formatDate(subOrder.createdAt)}</Typography>
                                                            </Grid>
                                                            <Grid xs={12} md={6}>
                                                            物流状态:{shippingStatus(subOrder.shippingStatus)}
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                        
                                        <Grid container spacing={2} sx={{mt: 2}}>
                                            <Grid xs={12} md={6}>
                                                <Typography level="title-md" sx={{mb: 1}}>
                                                    {t('order.shippingAddress')}
                                                </Typography>
                                                <Sheet variant="outlined" sx={{p: 2, borderRadius: 'sm'}}>
                                                    <Typography level="body-md">
                                                        {selectedOrder.address.streetAddress}
                                                    </Typography>
                                                    <Typography level="body-md">
                                                        {selectedOrder.address.city}, {selectedOrder.address.state}
                                                    </Typography>
                                                    <Typography level="body-md">
                                                        {selectedOrder.address.country}, {selectedOrder.address.zipCode}
                                                    </Typography>
                                                    <Typography level="body-md" sx={{mt: 1}}>
                                                        {t('order.email')}: {selectedOrder.email}
                                                    </Typography>
                                                </Sheet>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Typography level="title-md" sx={{mb: 1}}>
                                                    {t('order.summary')}
                                                </Typography>
                                                <Sheet variant="outlined" sx={{p: 2, borderRadius: 'sm'}}>
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                                        <Typography level="body-md">{t('order.subtotal')}:</Typography>
                                                        <Typography level="body-md">
                                                            {formatCurrency(selectedOrder.totalAmount)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                                        <Typography level="body-md">{t('order.shipping')}:</Typography>
                                                        <Typography level="body-md">{formatCurrency(0)}</Typography>
                                                    </Box>
                                                    <Divider sx={{my: 1}} />
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Typography level="title-sm">{t('order.total')}:</Typography>
                                                        <Typography level="title-sm">
                                                            {formatCurrency(selectedOrder.totalAmount)}
                                                        </Typography>
                                                    </Box>
                                                </Sheet>
                                            </Grid>
                                        </Grid>
                                    </>
                                );
                            })()}
                        </Box>
                    ) : (
                        <Typography>{t('order.notFound')}</Typography>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
}
