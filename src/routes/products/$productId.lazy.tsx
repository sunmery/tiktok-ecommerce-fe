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

export const Route = createLazyFileRoute('/products/$productId')({component: ProductDetail});

export default function ProductDetail() {
    const {productId} = useParams({from: '/products/$productId'})
    const merchantId = new URLSearchParams(window.location.search).get('merchantId') || ''
    const {data: productResponse, isLoading: loading, error} = useProduct(productId, merchantId)

    // 确保我们正确获取商品数据，无论是在 productResponse.data 中还是直接在 productResponse 中
    const product = productResponse?.data || productResponse

    // 添加到购物车
    const addToCartHandler = () => {
        if (product) {
            try {
                // 确保productId不为空
                const productIdentifier = typeof product === 'object' && 'id' in product && product.id ? product.id : '';
                const productName = product.name || '';
                const merchantId = product.merchantId || '';
                const imageUrl = product.images && product.images[0] && product.images[0].url ? product.images[0].url : '';

                cartStore.addItem(
                    productIdentifier,
                    productName,
                    merchantId,
                    imageUrl,
                    1
                );
            } catch (error) {
                console.error('添加到购物车失败:', error);
                showMessage('添加到购物车失败，请稍后重试', 'error');
            }
        }
    }

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

    if (error || !product) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Alert color="danger" variant="soft">
                    {error?.message || error?.toString() || '未找到商品'}
                </Alert>
            </Box>
        )
    }

    // 新增健壮性判断，防止 product 及其属性为 undefined
    const productId_string = productId || '';
    const productName = typeof product === 'object' && product && 'name' in product ? product.name : '';
    const productIdValue = typeof product === 'object' && product && 'id' in product ? product.id : '';
    const merchantIdValue = typeof product === 'object' && product && 'merchantId' in product ? product.merchantId : '';
    const createdAt = typeof product === 'object' && product && 'createdAt' in product && product.createdAt ? new Date(product.createdAt).toLocaleString() : '未知';
    const updatedAt = typeof product === 'object' && product && 'updatedAt' in product && product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '未知';

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            <Breadcrumbs
                pathMap={{
                    'products': '全部商品',
                    [productId_string]: productName
                }}
            />

            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid xs={12} md={6}>
                    <Card variant="outlined">
                        <AspectRatio ratio="1" objectFit="contain">
                            <img
                                src={product.images?.[0]?.url || ''}
                                alt={productName}
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
                            <Typography level="h2">{productName}</Typography>

                            {product.category && (
                                <Box sx={{display: 'flex', gap: 1, mt: 1, mb: 2, flexWrap: 'wrap'}}>
                                    <Chip key={product.category.categoryName} size="sm" variant="soft">
                                        {product.category.categoryName}
                                    </Chip>
                                </Box>
                            )}

                            <Typography level="h3" color="primary" sx={{mt: 2}}>
                                ¥{(product.price || 0).toLocaleString()}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                商品ID: {productIdValue}
                            </Typography>

                            <Typography level="body-md" sx={{mt: 1}}>
                                商家ID: {merchantIdValue}
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
                                {product.description || '暂无描述'}
                            </Typography>

                            <Divider sx={{my: 2}}/>

                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 3}}>
                                <Typography>库存: {product.inventory?.stock || product.quantity || 0}</Typography>
                            </Box>

                            <Button
                                variant="solid"
                                color="primary"
                                size="md"
                                fullWidth
                                sx={{mt: 3}}
                                onClick={addToCartHandler}
                                disabled={(product.inventory?.stock || product.quantity || 0) <= 0}
                            >
                                {(product.inventory?.stock || product.quantity || 0) > 0 ? '加入购物车' : '暂时缺货'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 评论区域 */}
            <Grid xs={12}>
                <CommentSection productId={productId} merchantId={merchantId} />
            </Grid>
        </Box>
    )
}
