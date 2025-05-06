import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box, Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Modal,
    ModalClose,
    ModalDialog,

    Typography
} from '@mui/joy'
import {ConsumerOrderItem, MergedOrder, PaymentStatus} from '@/types/orders.ts'
import {formatCurrency} from '@/utils/format.ts'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import { getStatusText, } from '@/utils/status'
import {getStatusColor} from "@/utils/status.ts"
import { LocalShipping, Payment, ShoppingCart} from '@mui/icons-material'
import {useNavigate} from '@tanstack/react-router'

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
    showPaymentButton?: boolean
    onPayOrder?: (orderId: string) => void
    onAddToCart?: (items: ConsumerOrderItem[]) => void
    showLogisticsButton?: boolean
}

export default function OrderList({orders, showPaymentButton = false, showLogisticsButton = false, onPayOrder, onAddToCart}: OrderListProps) {
    const {t} = useTranslation()
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // 处理点击订单
    const handleOrderClick = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    // 关闭模态框
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 处理支付订单
    const handlePayOrder = (e: React.MouseEvent, orderId: string) => {
        e.stopPropagation(); // 阻止事件冒泡
        if (onPayOrder) {
            onPayOrder(orderId);
        }
    };

    // 处理添加到购物车
    const handleAddToCart = (e: React.MouseEvent, items: ConsumerOrderItem[]) => {
        e.stopPropagation(); // 阻止事件冒泡
        if (onAddToCart) {
            onAddToCart(items);
        }
    };

    // 处理查看物流
    const handleViewLogistics = (e: React.MouseEvent, subOrderId: string) => {
        e.stopPropagation(); // 阻止事件冒泡
        navigate({to: `/consumer/logistics/${subOrderId}`}).then(() => {
            console.log(`跳转到物流页面: ${subOrderId}`);
        });
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {orders.map((order: MergedOrder) => {
                    // 计算订单中的商品总数量
                    const totalItemsCount = getTotalItemsCount(order.items);
                    // 检查是否为未支付状态
                    const isNotPaid = order.paymentStatus === PaymentStatus.NotPaid;

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
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1
                                        }}>
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
                                        <Divider/>
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
                                                <Typography level="body-sm"
                                                            sx={{color: 'text.secondary', textAlign: 'center'}}>
                                                    {t('order.moreItems', {count: totalItemsCount - 3})}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid xs={12}>
                                        <Divider/>
                                    </Grid>

                                    <Grid xs={12}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
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
                                        
                                        {/* 添加支付和购物车按钮 */}
                                        {showPaymentButton && isNotPaid && (
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                                <Button
                                                    size="sm"
                                                    variant="outlined"
                                                    color="neutral"
                                                    startDecorator={<ShoppingCart />}
                                                    onClick={(e) => handleAddToCart(e, order.items)}
                                                >
                                                    {t('consumer.orders.addToCart')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    color="primary"
                                                    startDecorator={<Payment />}
                                                    onClick={(e) => handlePayOrder(e, order.orderId)}
                                                >
                                                    {t('consumer.orders.payNow')}
                                                </Button>
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* 订单详情模态框 */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <ModalDialog size="lg" sx={{maxWidth: '800px', width: '100%'}}>
                    <ModalClose />
                    <Typography level="h4" sx={{mb: 2}}>
                        {t('order.details')}
                    </Typography>
                    
                    {selectedOrderId && (
                        <Box>
                            {orders.filter(order => order.orderId === selectedOrderId).map(order => (
                                <Box key={order.orderId}>
                                    <Box sx={{mb: 2}}>
                                        <Typography level="title-lg">
                                            {t('order.id')}: {order.orderId}
                                        </Typography>
                                        <Typography level="body-sm" sx={{color: 'text.secondary'}}>
                                            {t('order.date')}: {formatDate(order.createdAt)}
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                color={getStatusColor(order.paymentStatus)}
                                            >
                                                {getStatusText(order.paymentStatus)}
                                            </Chip>
                                        </Box>
                                    </Box>
                                    
                                    <Divider sx={{my: 2}} />
                                    
                                    <Typography level="title-md" sx={{mb: 1}}>
                                        {t('order.subOrders')}
                                    </Typography>
                                    
                                    {order.subOrders.map((subOrder, index) => (
                                        <Accordion key={subOrder.subOrderId || index} sx={{mb: 1}}>
                                            <AccordionSummary>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                                                    <Typography level="title-sm">
                                                        {t('order.subOrder')} #{index + 1} - {subOrder.subOrderId}
                                                    </Typography>
                                                    <Box sx={{display: 'flex', gap: 1}}>
                                                        {showLogisticsButton && subOrder.subOrderId && (
                                                            <Button
                                                                size="sm"
                                                                variant="outlined"
                                                                color="primary"
                                                                startDecorator={<LocalShipping />}
                                                                onClick={(e) => handleViewLogistics(e, subOrder.subOrderId)}
                                                            >
                                                                {t('order.viewLogistics')}
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                                    {subOrder.items.map((item, itemIndex) => (
                                                        <Box key={itemIndex} sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
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
                                                                    {t('order.quantity')}: {item.item.quantity} x {formatCurrency(item.cost / item.item.quantity)}
                                                                </Typography>
                                                            </Box>
                                                            <Typography level="body-md" sx={{fontWeight: 'bold'}}>
                                                                {formatCurrency(item.cost)}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                                
                                                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                                    <Typography level="body-md">
                                                        {t('order.subtotal')}: <strong>{formatCurrency(subOrder.items.reduce((sum, item) => sum + item.cost, 0))}</strong>
                                                    </Typography>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                    
                                    <Divider sx={{my: 2}} />
                                    
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Typography level="title-md">
                                            {t('order.total')}:
                                        </Typography>
                                        <Typography level="title-lg" sx={{color: 'primary.main'}}>
                                            {formatCurrency(order.items.reduce((sum, item) => sum + item.cost, 0))}
                                        </Typography>
                                    </Box>
                                    
                                    {showPaymentButton && order.paymentStatus === PaymentStatus.NotPaid && (
                                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                startDecorator={<Payment />}
                                                onClick={(e) => handlePayOrder(e, order.orderId)}
                                            >
                                                {t('order.payNow')}
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                </ModalDialog>
            </Modal>
        </>
    )
}
