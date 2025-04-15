import React from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Modal,
    ModalClose,
    ModalDialog,
    Sheet,
    Table,
    Typography
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import {Order, PaymentStatus} from '@/types/orders';
import {formatCurrency} from '@/utils/format';
import {getStatusColor, getStatusText} from '@/utils/status';
import {useNavigate} from '@tanstack/react-router';


// 格式化时间
const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    let date;
    if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
    } else {
        date = new Date(timestamp);
    }
    return date.toLocaleString();
};

interface OrderDetailModalProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    loading: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({open, onClose, order, loading}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    // 计算总金额
    const calculateTotal = () => {
        if (!order || !order.items) return 0;
        return order.items.reduce((total, item) => {
            return total + (item.cost * item.item.quantity);
        }, 0);
    };
    
    // 处理去支付按钮点击事件
    const handlePayment = () => {
        if (!order || !order.items) return;
        
        // 将订单商品转换为购物车项格式
        const cartItems = order.items.map(item => ({
            merchantId: item.item.merchantId || '',
            productId: item.item.productId || '',
            name: item.item.name,
            price: item.cost,
            quantity: item.item.quantity,
            picture: item.item.picture || '',
            selected: true
        }));
        
        // 将商品数据保存到本地存储
        localStorage.setItem('selectedCartItems', JSON.stringify(cartItems));
        
        // 跳转到结算页面
        navigate({to: '/checkout'});
        
        // 关闭模态框
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                aria-labelledby="order-detail-modal-title"
                size="lg"
                variant="outlined"
                sx={{
                    maxWidth: 800,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                <ModalClose/>
                <Typography id="order-detail-modal-title" level="h4" sx={{mb: 2}}>
                    {t('orders.details')}
                </Typography>

                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 3}}>
                        <CircularProgress/>
                    </Box>
                ) : !order ? (
                    <Typography level="body-lg" textAlign="center">
                        {t('orders.notFound')}
                    </Typography>
                ) : (
                    <Box>
                        {/* 订单基本信息 */}
                        <Sheet variant="soft" sx={{p: 2, mb: 3, borderRadius: 'sm'}}>
                            <Grid container spacing={2}>
                                <Grid xs={12} md={6}>
                                    <Typography level="title-sm">{t('orders.orderId')}</Typography>
                                    <Typography level="body-md" sx={{fontWeight: 'bold'}}>
                                        {order.orderId}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="title-sm">{t('orders.status')}</Typography>
                                    <Chip
                                        variant="soft"
                                        color={getStatusColor(order.paymentStatus)}
                                        size="sm"
                                        sx={{fontWeight: 'bold', mt: 0.5}}
                                    >
                                        {getStatusText(order.paymentStatus)}
                                    </Chip>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="title-sm">{t('orders.createdTime')}</Typography>
                                    <Typography level="body-md">
                                        {formatDate(order.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography level="title-sm">{t('orders.total')}</Typography>
                                    <Typography level="body-md" sx={{color: 'primary.600', fontWeight: 'bold'}}>
                                        {formatCurrency(calculateTotal(), order.currency)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Sheet>

                        {/* 收货信息 */}
                        <Typography level="title-md" sx={{mb: 1}}>{t('orders.shippingInfo')}</Typography>
                        <Sheet variant="outlined" sx={{p: 2, mb: 3}}>
                            <Typography level="body-md">
                                {t('orders.recipientEmail')}: {order.email}
                            </Typography>
                            <Typography level="body-md">
                                {t('orders.shippingAddress')}: {order.address?.streetAddress}, {order.address?.city}, {order.address?.state}, {order.address?.country} {order.address?.zipCode}
                            </Typography>
                        </Sheet>

                        {/* 商品列表 */}
                        <Typography level="title-md" sx={{mb: 1}}>{t('orders.productList')}</Typography>
                        <Sheet variant="outlined" sx={{mb: 3, overflow: 'auto'}}>
                            <Table>
                                <thead>
                                <tr>
                                    <th style={{width: '40%'}}>{t('orders.product')}</th>
                                    <th>{t('orders.unitPrice')}</th>
                                    <th>{t('orders.quantity')}</th>
                                    <th>{t('orders.total')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items.map((item, index) => {
                                    // 兼容不同的数据结构
                                    const productName = item.item.name;
                                    const price = item.cost;
                                    const quantity = item.item.quantity;

                                    return (
                                        <tr key={index}>
                                            <td>{productName}</td>
                                            <td>{formatCurrency(price, order.currency)}</td>
                                            <td>{quantity}</td>
                                            <td>{formatCurrency(price * quantity, order.currency)}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </Sheet>

                        {/* 订单总计 */}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 3}}>
                            <Sheet variant="soft" sx={{p: 2, width: {xs: '100%', sm: '300px'}}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <Typography level="title-sm">{t('orders.subtotal')}</Typography>
                                    <Typography>{formatCurrency(calculateTotal(), order.currency)}</Typography>
                                </Box>
                                <Divider sx={{my: 1}}/>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography level="title-md">{t('orders.total')}</Typography>
                                    <Typography level="title-md" sx={{color: 'primary.600'}}>
                                        {formatCurrency(calculateTotal(), order.currency)}
                                    </Typography>
                                </Box>
                            </Sheet>
                        </Box>

                        {/* 支付按钮 */}
                        {order.paymentStatus === PaymentStatus.NotPaid && (
                            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    variant="solid"
                                    color="primary"
                                    onClick={handlePayment}
                                >
                                    {t('orders.pay')}
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </ModalDialog>
        </Modal>
    );
};

export default OrderDetailModal;
