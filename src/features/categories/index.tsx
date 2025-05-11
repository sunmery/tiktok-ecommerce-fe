import {Box, Button, Card, CardContent, Chip, Container, Divider, FormControl, FormLabel, Grid, IconButton, Input, Option, Select, Stack, Typography} from '@mui/joy';
import {Category} from '@/types/category';
import {useState, useEffect} from 'react';
import {t} from 'i18next';
import CategoryNavigator from '@/components/CategoryNavigator';
import {Add, FilterAlt, Search, ShoppingCart} from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {cartStore} from '@/store/cartStore';
import {showMessage} from '@/utils/showMessage';

export function Categories() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState('default');
    const [loading, setLoading] = useState(false);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        // 在实际应用中，这里可以根据选择的分类加载相关商品
        console.log('Selected category:', category);
        // 模拟加载商品数据
        loadProductsForCategory(category.id);
    };
    
    // 模拟加载分类商品
    const loadProductsForCategory = (categoryId: string) => {
        setLoading(true);
        // 模拟API调用延迟
        setTimeout(() => {
            // 模拟商品数据
            const mockProducts = [
                {
                    id: '1',
                    name: 'CAL-MAG PLUS GALLON',
                    price: 29.99,
                    image: '/images/products/cal-mag.jpg',
                    brand: 'Brand Name',
                    variant: 'Available',
                    merchantId: 'merchant1'
                },
                {
                    id: '2',
                    name: 'CAL-MAG PLUS GALLON',
                    price: 29.99,
                    image: '/images/products/cal-mag.jpg',
                    brand: 'Brand Name',
                    variant: 'Available',
                    merchantId: 'merchant1'
                },
                {
                    id: '3',
                    name: 'CAL-MAG PLUS GALLON',
                    price: 29.99,
                    image: '/images/products/cal-mag.jpg',
                    brand: 'Lowest- Heights',
                    variant: 'Available',
                    merchantId: 'merchant1'
                },
            ];
            setProducts(mockProducts);
            setLoading(false);
        }, 500);
    };
    
    // 添加到购物车
    const handleAddToCart = (product: any) => {
        try {
            cartStore.addItem(
                product.id,
                product.name,
                product.merchantId,
                product.image,
                1
            );
            showMessage(t('product.addedToCart'), 'success');
        } catch (error) {
            console.error('添加到购物车失败:', error);
            showMessage(t('product.addToCartFailed'), 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography level="h1" component="h1" sx={{mb: 4}}>
                {t('category.pageTitle')}
            </Typography>

            <Grid container spacing={4}>
                <Grid xs={12} md={3}>
                    {/* 分类导航器 */}
                    <Box sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        overflow: 'hidden'
                    }}>
                        <Typography
                            level="title-md"
                            sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.level1'
                            }}
                        >
                            {t('category.browseCategories')}
                        </Typography>
                        <CategoryNavigator onCategorySelect={handleCategorySelect}/>
                    </Box>
                    
                    {/* 标签过滤 */}
                    <Box sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        overflow: 'hidden',
                        mt: 2
                    }}>
                        <Typography
                            level="title-md"
                            sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.level1'
                            }}
                        >
                            {t('category.tag')}
                        </Typography>
                        <Box sx={{p: 2}}>
                            <Chip size="sm" color="primary" sx={{m: 0.5}}>植物护理</Chip>
                            <Chip size="sm" color="primary" sx={{m: 0.5}}>营养素</Chip>
                            <Chip size="sm" color="primary" sx={{m: 0.5}}>水培泵</Chip>
                            <Chip size="sm" color="primary" sx={{m: 0.5}}>生长介质</Chip>
                            <Chip size="sm" color="primary" sx={{m: 0.5}}>花盆+容器</Chip>
                        </Box>
                    </Box>
                    
                    {/* 品牌过滤 */}
                    <Box sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        overflow: 'hidden',
                        mt: 2
                    }}>
                        <Typography
                            level="title-md"
                            sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.level1'
                            }}
                        >
                            {t('category.brands')}
                        </Typography>
                        <Box sx={{p: 2}}>
                            <Chip size="sm" color="neutral" sx={{m: 0.5}}>品牌1</Chip>
                            <Chip size="sm" color="neutral" sx={{m: 0.5}}>品牌2</Chip>
                            <Chip size="sm" color="neutral" sx={{m: 0.5}}>品牌3</Chip>
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={12} md={9}>
                    {/* 选中分类的内容区域 */}
                    <Box>
                        {selectedCategory ? (
                            <Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Box>
                                        <Typography level="h4" component="h2">
                                            {selectedCategory.name}
                                        </Typography>
                                        <Typography level="body-sm" color="neutral">
                                            {products.length > 0 ? `${products.length} ${t('category.productsFound')}` : t('category.noProducts')}
                                        </Typography>
                                    </Box>
                                    <Select 
                                        size="sm"
                                        placeholder="默认排序"
                                        value={sortOrder}
                                        onChange={(_, value) => setSortOrder(value as string)}
                                        sx={{minWidth: 180}}
                                    >
                                        <Option value="default">{t('category.defaultSorting')}</Option>
                                        <Option value="price_asc">{t('category.priceLowToHigh')}</Option>
                                        <Option value="price_desc">{t('category.priceHighToLow')}</Option>
                                        <Option value="name_asc">{t('category.nameAZ')}</Option>
                                        <Option value="name_desc">{t('category.nameZA')}</Option>
                                    </Select>
                                </Box>
                                
                                {loading ? (
                                    <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                        <Typography>{t('category.loading')}</Typography>
                                    </Box>
                                ) : products.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {products.map((product) => (
                                            <Grid key={product.id} xs={12} sm={6} md={4}>
                                                <Card variant="outlined" sx={{height: '100%'}}>
                                                    <Box sx={{
                                                        p: 2,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        height: '100%'
                                                    }}>
                                                        <Box 
                                                            component="img"
                                                            src={product.image || '/placeholder.png'}
                                                            alt={product.name}
                                                            sx={{
                                                                width: '100%',
                                                                height: 200,
                                                                objectFit: 'contain',
                                                                mb: 2
                                                            }}
                                                        />
                                                        <Typography level="body-xs" sx={{mb: 1}}>
                                                            {product.brand}
                                                        </Typography>
                                                        <Typography level="title-md" sx={{mb: 1, flexGrow: 1}}>
                                                            {product.name}
                                                        </Typography>
                                                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <Typography level="h4" sx={{fontWeight: 'bold'}}>
                                                                ${product.price.toFixed(2)}
                                                            </Typography>
                                                            <Button 
                                                                variant="solid" 
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleAddToCart(product)}
                                                                startDecorator={<ShoppingCartIcon />}
                                                            >
                                                                {t('product.addToCart')}
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 300,
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            borderRadius: 'sm',
                                        }}
                                    >
                                        <Typography level="body-lg" color="neutral">
                                            {t('category.noProductsFound')}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {/* 分页 */}
                                {products.length > 0 && (
                                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                                        <Box sx={{display: 'flex', gap: 1}}>
                                            <Chip color="primary" variant="solid">1</Chip>
                                            <Chip color="neutral" variant="soft">2</Chip>
                                            <Chip color="neutral" variant="soft">3</Chip>
                                            <Chip color="neutral" variant="soft">4</Chip>
                                            <Typography sx={{alignSelf: 'center'}}>from 2000</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 400,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 'sm',
                                }}
                            >
                                <Typography level="body-lg" color="neutral">
                                    {t('category.selectPrompt')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}