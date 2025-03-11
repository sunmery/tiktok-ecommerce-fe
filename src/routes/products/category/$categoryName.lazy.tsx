import {createLazyFileRoute} from '@tanstack/react-router'
import {
    Box,
    Typography,
    Card,
    CardContent,
    AspectRatio,
    Button,
    Chip,
    Breadcrumbs,
} from '@mui/joy'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {Link} from '@tanstack/react-router'
import {cartStore} from '@/store/cartStore.ts'
import Skeleton from '@/components/Skeleton'
import {useState, useEffect} from 'react'
import {productService} from '@/api/productService'
import {Product} from '@/types/products.ts'

export const Route = createLazyFileRoute('/products/category/$categoryName')({
    component: CategoryProducts
})
export default function CategoryProducts() {
    const {categoryName} = Route.useParams()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 分类名称映射（用于显示中文名称）
    const categoryNameMap: Record<string, string> = {
        'phone-digital': '手机数码',
        'home-appliance': '家用电器',
        'computer-office': '电脑办公',
        'clothing-shoes': '服饰鞋包',
        'beauty-personal-care': '美妆个护',
        'sports-outdoors': '运动户外'
    }

    // 获取分类对应的中文名称
    const getCategoryDisplayName = (name: string): string => {
        return categoryNameMap[name] || name
    }

    // 获取分类商品数据
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await productService.listProductsByCategory({
                    name: categoryName
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

        fetchCategoryProducts()
    }, [categoryName])

    const addToCartHandler = (
        id: string,
        merchantId: string,
        name: string,
        price: number,
        quantity: number = 1,
        description?: string,
        images?: string[],
        categories?: string[],
    ) => {
        cartStore.addItem(id, merchantId, name, price, quantity, description, images, categories)
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
                <Link to="/products">
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
                                            product.images?.map(img => img.url),
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
