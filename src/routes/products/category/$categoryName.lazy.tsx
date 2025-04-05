import {createLazyFileRoute, Link} from '@tanstack/react-router'
import {AspectRatio, Box, Breadcrumbs, Button, Card, CardContent, Chip, Typography,} from '@mui/joy'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {cartStore} from '@/store/cartStore.ts'
import Skeleton from '@/components/Skeleton'
import {useEffect, useState} from 'react'
import {productService} from '@/api/productService'
import {useCategories} from '@/hooks/useCategory'

export const Route = createLazyFileRoute('/products/category/$categoryName')({
    component: CategoryProducts
})

function CategoryProducts() {
    const {categoryName} = Route.useParams()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const {data: categories, isLoading: categoriesLoading, error: categoriesError} = useCategories()

// 直接使用接口返回的分类名称
    const getCategoryDisplayName = (name: string): string => {
        if (categoriesLoading) return '加载中...';
        if (categoriesError) return '名称加载失败';
        const category = categories?.categories?.find(c => c.name === name);
        return category?.name || name;
    }
    // 获取分类商品数据
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await productService.listProductsByCategory({
                    categoryName: categoryName,
                    page: 1,
                    pageSize: 200,
                    status: 2
                })
                if (response && response.items) {
                    setProducts(response.items)
                } else {
                    setProducts([])
                }
            } catch (err) {
                console.error('获取分类商品失败:', err)
                setError('获取分类商品数据失败，请稍后重试')
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategoryProducts().then(r => r)
    }, [categoryName])

    const addToCartHandler = (
        id: string,
        merchantId: string,
        name: string,
        price: number,
        quantity: number = 1,
        _description?: string,
        images?: string[],
        _categories?: string[],
    ) => {
        // 确保productId不为空
        if (!id || id.trim() === '') {
            console.error('添加商品失败: 商品ID不能为空');
            return;
        }

        // 修正参数顺序：productId, name, merchantId, picture, quantity
        cartStore.addItem(
            id,
            name,
            merchantId,
            images && images.length > 0 ? images[0] : '',
            quantity
        )
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small"/>}
                sx={{mb: 3}}
            >
                <Link to="/">
                    <Typography color="neutral">首页</Typography>
                </Link>
                <Link to="/products" search={{query: categoryName}}>
                    <Typography color="neutral">全部商品</Typography>
                </Link>
                <Typography>{getCategoryDisplayName(categoryName)}</Typography>
            </Breadcrumbs>

            <Typography level="h2" sx={{mb: 3}}>
                {getCategoryDisplayName(categoryName)}
            </Typography>

            {loading ? (
                <Skeleton variant="product" count={4}/>
            ) : error ? (
                <Typography color="danger" sx={{textAlign: 'center', p: 4}}>
                    {error}
                </Typography>
            ) : products.length === 0 ? (
                <Typography sx={{textAlign: 'center', p: 4}}>
                    该分类下暂无商品
                </Typography>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 3
                }}>
                    {products.map((product, index) => (
                        <Card
                            key={product.id || index}
                            variant="outlined"
                            sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'md',
                                }
                            }}
                        >
                            {index < 3 && (
                                <Chip
                                    size="sm"
                                    variant="solid"
                                    color="primary"
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        zIndex: 1,
                                    }}
                                >
                                    热门
                                </Chip>
                            )}
                            <AspectRatio ratio="4/3">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    style={{objectFit: 'cover'}}
                                />
                            </AspectRatio>
                            <CardContent>
                                <Typography level="title-md">{product.name}</Typography>
                                {product.description && (
                                    <Typography level="body-sm" noWrap sx={{mt: 1}}>
                                        {product.description}
                                    </Typography>
                                )}
                                {product.category && (
                                    <Box sx={{display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap'}}>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color="primary"
                                        >
                                            {product.category.categoryName}
                                        </Chip>
                                    </Box>
                                )}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 2,
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography level="h3" sx={{color: 'primary.500', fontWeight: 'bold'}}>
                                        ¥{product.price?.toFixed(2)}
                                    </Typography>
                                    <Button
                                        size="md"
                                        variant="solid"
                                        color="primary"
                                        sx={{
                                            fontWeight: 600
                                        }}
                                        onClick={() => addToCartHandler(
                                            product.id,
                                            product.merchantId,
                                            product.name,
                                            product.price,
                                            1,
                                            product.description,
                                            product.images?.map((img: { url: string }) => img.url),
                                            [product.category?.categoryName]
                                        )}
                                    >
                                        加入购物车
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    )
}
