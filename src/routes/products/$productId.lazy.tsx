import {createLazyFileRoute, useParams} from '@tanstack/react-router'

import {
    Alert,
    AspectRatio,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from '@mui/joy'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {cartStore} from '@/store/cartStore.ts'
import {useProduct} from '@/hooks/useProduct'
import {showMessage} from "@/utils/showMessage.ts";
import CommentSection from '@/components/CommentSection';
import {useEffect, useState} from 'react';
import {orderService} from '@/api/orderService';
import {useSnapshot} from 'valtio/react';
import {userStore} from '@/store/user.ts';
import {PaymentStatus} from '@/types/orders'

export const Route = createLazyFileRoute('/products/$productId')({component: ProductDetail});

export default function ProductDetail() {
    const {productId} = useParams({from: '/products/$productId'})
    const merchantId = new URLSearchParams(window.location.search).get('merchantId') || ''
    const {data, isLoading: loading, error} = useProduct(productId, merchantId)
    const [canComment, setCanComment] = useState(false)
    const [checkingOrders, setCheckingOrders] = useState(false)
    const {account} = useSnapshot(userStore)

    // 添加到购物车
    const addToCartHandler = () => {
        if (data) {
            try {
                const imageUrl = data.images[0].url ? data.images[0].url : '';

                cartStore.addItem(
                    data.id as string,
                    data.name as string,
                    data.merchantId as string,
                    imageUrl,
                    1
                );
            } catch (error) {
                console.error('添加到购物车失败:', error);
                showMessage('添加到购物车失败，请稍后重试', 'error');
            }
        }
    }
    
    // 检查用户是否有已支付的订单，只有已支付订单的用户才能发表评论
    useEffect(() => {
        const checkUserOrders = async () => {
            if (!account.id) {
                setCanComment(false)
                return
            }
            
            try {
                setCheckingOrders(true)
                const response = await orderService.getConsumerOrder({
                    userId: account.id,
                    page: 1,
                    pageSize: 50
                })
                
                if (response && response.orders) {
                    // 检查用户是否有包含该商品且状态为已支付的订单
                    const hasPaidOrder = response.orders.some(order => {
                        // 检查订单是否已支付
                        const isPaid = order.paymentStatus === PaymentStatus.Paid
                        
                        // 检查订单是否包含当前商品
                        const hasProduct = order.items.some(item => 
                            item.item.productId === productId
                        )
                        
                        return isPaid && hasProduct
                    })
                    
                    setCanComment(hasPaidOrder)
                }
            } catch (error) {
                console.error('检查用户订单失败:', error)
                setCanComment(false)
            } finally {
                setCheckingOrders(false)
            }
        }
        
        checkUserOrders()
    }, [account.id, productId])

    if (loading) {
        return (
            <Box sx={{
                p: 2,
                maxWidth: '1200px',
                mx: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
            }}>
                <CircularProgress size="lg"/>
            </Box>
        )
    }

    if (error || !data) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Alert color="danger" variant="soft">
                    {error?.message || error?.toString() || '未找到商品'}
                </Alert>
            </Box>
        )
    }

    const createdAt = data && data.createdAt ? new Date(data.createdAt).toLocaleString() : '未知';
    const updatedAt = data && data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '未知';

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            <Breadcrumbs
                pathMap={{
                    'products': '全部商品',
                    [productId]: data.name || '商品详情'
                }}
            />

            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid xs={12} md={6}>
                    <Card variant="outlined">
                        <AspectRatio ratio="1" objectFit="contain">
                            <img
                                src={data.images?.[0]?.url || ''}
                                alt={data.name}
                                loading="lazy"
                                style={{objectFit: 'contain', width: '100%', height: '100%'}}
                                onError={(e) => {
                                    console.error('商品图片加载失败，使用默认图片');
                                    e.currentTarget.src = "https://picsum.photos/300/200";
                                }}
                            />
                        </AspectRatio>
                    </Card>
                </Grid>

                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{height: '100%'}}>
                        <CardContent>
                            <Typography level="h2">{data.name}</Typography>

                            {data.category && (
                                <Box sx={{display: 'flex', gap: 1, mt: 1, mb: 2, flexWrap: 'wrap'}}>
                                    <Chip key={data.category.categoryName} size="sm" variant="soft">
                                        {data.category.categoryName}
                                    </Chip>
                                </Box>
                            )}

                            <Typography level="h3" color="primary" sx={{mt: 2}}>
                                ¥{(data.price || 0).toLocaleString()}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                商品ID: {data.id}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                商家ID: {data.merchantId}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                创建时间: {createdAt}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                更新时间: {updatedAt}
                            </Typography>

                            <Divider sx={{my: 2}}/>

                            <Typography level="title-lg" sx={{mb: 2}}>
                                商品描述
                            </Typography>
                            <Typography level="body-md">
                                {data.description || '暂无描述'}
                            </Typography>

                            <Divider sx={{my: 2}}/>

                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 3}}>
                                <Typography>库存: {data.inventory.stock }</Typography>
                            </Box>

                            <Button
                                variant="solid"
                                color="primary"
                                size="md"
                                fullWidth
                                sx={{mt: 3}}
                                onClick={addToCartHandler}
                                disabled={(data.inventory?.stock || data.quantity || 0) <= 0}
                            >
                                {(data.inventory.stock) > 0 ? '加入购物车' : '暂时缺货'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 评论区域 */}
            <Grid xs={12}>
                <CommentSection 
                    productId={productId} 
                    merchantId={merchantId} 
                    canComment={canComment} 
                    isCheckingOrders={checkingOrders}
                />
            </Grid>
        </Box>
    )
}
