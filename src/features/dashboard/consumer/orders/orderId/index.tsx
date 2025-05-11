import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Card, CardContent, Container, Divider, Grid, IconButton, Table, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { ArrowBack, Delete, Edit } from '@mui/icons-material';
import { orderService } from "@/features/dashboard/consumer/orders/api.ts";

export default function ConsumerOrderDetail() {
    const {orderId} = useParams({from: '/consumer/orders/$orderId'});
    const {t} = useTranslation();
    const navigate = useNavigate();

    const {data: order, isLoading, error} = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderDetail(orderId),
    });

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Typography level="body-lg">{t('orders.loading')}</Typography>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Typography level="body-lg" color="danger">
                    {t('orders.error')}: {error instanceof Error ? error.message : t('orders.unknownError')}
                </Typography>
            </Container>
        );
    }

    // 模拟订单详情数据
    const mockOrder = {
        id: orderId,
        email: 'buyer@email.co',
        name: 'John Doe',
        schedule: 'Repeat every month on last Friday',
        orderDate: '2023-11-24',
        nextDeliveryDate: '2023-12-24',
        shippingMethod: 'International Express',
        paymentMethod: 'Credit Card',
        shippingAddress: '4517 Washington Ave. Manchester, Kentucky 39495',
        paymentAddress: '4517 Washington Ave. Manchester, Kentucky 39495',
        total: 1318.54,
        items: [
            {
                id: '001',
                name: 'Air stone Cylinder Small 1.4IN X 1.7IN',
                quantity: 100,
                price: 100.00,
                image: 'https://via.placeholder.com/100'
            },
            {
                id: '001',
                name: 'Air stone Cylinder Small 1.4IN X 1.7IN',
                quantity: 100,
                price: 100.00,
                image: 'https://via.placeholder.com/100'
            },
            {
                id: '001',
                name: 'Air stone Cylinder Small 1.4IN X 1.7IN',
                quantity: 100,
                price: 100.00,
                image: 'https://via.placeholder.com/100'
            }
        ]
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                <IconButton
                    variant="plain"
                    color="neutral"
                    sx={{mr: 1}}
                    onClick={() => navigate({to: '/consumer/orders'})}
                >
                    <ArrowBack/>
                </IconButton>
                <Typography level="h2" component="h1">
                    {t('orders.orderNo')} {orderId}
                </Typography>
            </Box>

            <Card variant="outlined" sx={{mb: 4}}>
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography level="title-lg">
                            {t('orders.details')}
                        </Typography>
                        <Box>
                            <IconButton color="primary" sx={{mr: 1}}>
                                <Edit/>
                            </IconButton>
                            <IconButton color="danger">
                                <Delete/>
                            </IconButton>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <Table>
                                <tbody>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.account')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.email}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.name')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.name}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.schedule')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.schedule}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.orderDate')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.orderDate}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.nextDeliveryDate')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.nextDeliveryDate}</Typography>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Table>
                                <tbody>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.shippingMethod')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.shippingMethod}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.paymentMethod')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.paymentMethod}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.shippingAddress')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.shippingAddress}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography level="title-sm">{t('orders.paymentAddress')}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-md">{mockOrder.paymentAddress}</Typography>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 订单商品列表 */}
            <Typography level="title-lg" sx={{mt: 4, mb: 2}}>
                {t('orders.items')}
            </Typography>

            {mockOrder.items.map((item, index) => (
                <Card key={index} variant="outlined" sx={{mb: 2}}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid xs={12} sm={2} md={1}>
                                <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.name}
                                    sx={{width: '100%', aspectRatio: '1/1', objectFit: 'contain', borderRadius: '4px'}}
                                />
                            </Grid>
                            <Grid xs={12} sm={6} md={7}>
                                <Typography level="title-md">
                                    {item.name}
                                </Typography>
                                <Typography level="body-sm" color="neutral">
                                    SKU: {item.id}
                                </Typography>
                                <Box sx={{display: 'flex', mt: 1}}>
                                    <Typography level="body-sm" color="neutral" sx={{mr: 1}}>
                                        {t('orders.unit')}: {item.quantity}
                                    </Typography>
                                    <Typography level="body-sm" color="neutral">
                                        {t('orders.unitPrice')}: ${item.price.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} sm={4} md={4} sx={{textAlign: 'right'}}>
                                <Typography level="title-lg" fontWeight="bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}

            {/* 订单总计 */}
            <Card variant="outlined">
                <CardContent>
                    <Typography level="title-lg" sx={{mb: 2}}>
                        {t('orders.orderTotal')}
                    </Typography>
                    <Divider sx={{my: 2}}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                        <Typography level="title-md">
                            {t('orders.total')}:
                        </Typography>
                        <Typography level="title-md" fontWeight="bold">
                            ${mockOrder.total.toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2}}>
                <Button variant="outlined" color="neutral">
                    {t('orders.printOrder')}
                </Button>
                <Button variant="solid" color="primary">
                    {t('orders.reorder')}
                </Button>
            </Box>
        </Container>
    )
}
