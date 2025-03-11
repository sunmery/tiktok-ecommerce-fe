import {createLazyFileRoute} from '@tanstack/react-router'
import {useParams} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {Box, Typography, Card, CardContent, AspectRatio, Divider, Grid, Button, Chip, CircularProgress, Alert} from '@mui/joy'
import Breadcrumbs from '@/components/Breadcrumbs'
import {cartStore} from '@/store/cartStore.ts'
import type {Product} from '@/types/products.ts'

export const Route = createLazyFileRoute('/products/$productId')();

export default function ProductDetail() {
    const {productId} = useParams({from: '/products/$productId'})
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // 获取商品详情
    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!productId) {
                setError('商品ID不能为空');
                return;
            }
            
            setLoading(true);
            setError('');
            
            try {
                // 从API获取商品详情
                const response = await fetch(`${import.meta.env.VITE_PRODUCERS_URL}/${productId}`);
                if (!response.ok) {
                    throw new Error(`获取商品详情失败: ${response.statusText}`);
                }
                
                const data = await response.json();
                if (!data) {
                    throw new Error('商品数据为空');
                }
                
                // 增强图片数据完整性检查
                const processedData = {
                    ...data,
                    images: Array.isArray(data.images) && data.images.length > 0
                        ? data.images.map(img => ({
                            ...img,
                            url: img.url || data.picture || 'https://picsum.photos/300/200',
                            isPrimary: typeof img.isPrimary === 'boolean' ? img.isPrimary : true,
                            sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : 0
                        }))
                        : [{
                            url: data.picture || 'https://picsum.photos/300/200',
                            isPrimary: true,
                            sortOrder: 0
                        }]
                };
                
                setProduct(processedData);
                setError('');
            } catch (err) {
                console.error('获取商品详情失败:', err);
                // 优化错误处理流程
                try {
                    const { mockProducts } = await import('@/utils/mockData');
                    const mockProduct = mockProducts.find(p => p.id === productId);
                    if (mockProduct) {
                        console.log('使用mock数据显示商品详情:', mockProduct);
                        setProduct(mockProduct);
                        setError('当前使用测试数据显示');
                    } else {
                        setError('商品不存在或已下架');
                    }
                } catch (mockErr) {
                    console.error('加载mock数据失败:', mockErr);
                    setError('获取商品信息失败，请稍后重试');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [productId]);

    // 添加到购物车
    const addToCartHandler = () => {
        if (product) {
            try {
                cartStore.addItem(
                    product.id,
                    product.merchantId,
                    product.name,
                    product.price,
                    1,
                    product.description,
                    product.images?.map(img => img.url)
                );
            } catch (error) {
                console.error('添加到购物车失败:', error);
                setError('添加到购物车失败，请稍后重试');
            }
        }
    }

    if (loading) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
                <CircularProgress size="lg" />
            </Box>
        )
    }

    if (error || !product) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Alert color="danger" variant="soft">
                    {error || '未找到商品'}
                </Alert>
            </Box>
        )
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            <Breadcrumbs
                pathMap={{
                    'products': '全部商品',
                    [productId]: product.name
                }}
            />

            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid xs={12} md={6}>
                    <Card variant="outlined">
                        <AspectRatio ratio="1" objectFit="contain">
                            <img
                                src={product.images?.[0]?.url}
                                alt={product.name}
                                loading="lazy"
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
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
                            <Typography level="h2">{product.name}</Typography>

                            {product.category && (
                                <Box sx={{display: 'flex', gap: 1, mt: 1, mb: 2, flexWrap: 'wrap'}}>
                                    <Chip key={product.category.categoryName} size="sm" variant="soft">
                                        {product.category.categoryName}
                                    </Chip>
                                </Box>
                            )}

                            <Typography level="h3" color="primary" sx={{mt: 2}}>
                                ¥{product.price.toLocaleString()}
                            </Typography>

                            <Divider sx={{my: 2}}/>

                            <Typography level="body-lg" sx={{mb: 2}}>
                                {product.description}
                            </Typography>

                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mt: 3}}>
                                <Typography>库存: {product.quantity}</Typography>
                            </Box>

                            <Button
                                variant="solid"
                                color="primary"
                                size="md"
                                fullWidth
                                sx={{mt: 3}}
                                onClick={addToCartHandler}
                                disabled={product.quantity <= 0}
                            >
                                {product.quantity > 0 ? '加入购物车' : '暂时缺货'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
