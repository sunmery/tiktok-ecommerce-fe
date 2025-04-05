import React, {useEffect, useState} from 'react';
import {AspectRatio, Box, Button, Card, CardContent, CircularProgress, Grid, Modal, Sheet, Typography} from '@mui/joy';
import {Category} from '@/types/category';
import {categoryService} from '@/api/categoryService';
import {Link, useNavigate} from '@tanstack/react-router';
import CategoryNavigator from '@/components/CategoryNavigator';
import {useCategoryWithChildrenProducts} from '@/hooks/useProduct';
import {Product, ProductStatus} from '@/types/products';

interface HotCategoriesProps {
    // 定制顶部标题
    title?: string;
    // 最多显示的分类数量
    limit?: number;
    // 过滤特定层级的分类
    maxLevel?: number;
}

const HotCategories: React.FC<HotCategoriesProps> = ({
                                                         title = '热门分类',
                                                         limit = 10,
                                                         maxLevel = 1
                                                     }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const navigate = useNavigate();

    // 获取热门分类（根分类的直接子分类）
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryService.getDirectSubCategories({parentId: "1"});
                const filtered = response.categories?.filter(cat => cat.level <= maxLevel) || [];
                setCategories(filtered.slice(0, limit));
            } catch (error) {
                console.error('获取热门分类失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories().then(() => {
            console.log('获取热门分类')
        });
    }, [limit, maxLevel]);

    // 获取所选分类及其子分类的商品
    const {
        data: categoryProducts,
        isLoading: isProductsLoading,
        isError: isProductsError
    } = useCategoryWithChildrenProducts(
        selectedCategory ? parseInt(selectedCategory.id) : 0,
        {page: 1, pageSize: 12, status: ProductStatus.PRODUCT_STATUS_APPROVED}
    );

    // 当选择分类时
    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setShowProducts(true);
    };

    // 返回分类选择
    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setShowProducts(false);
    };

    // 当选择子分类时
    const handleSubCategorySelect = (category: Category) => {
        setOpenModal(false);
        navigate({to: `/products/category/${category.id}`}).then(() => {
            console.log('选择子分类')
        });
    };

    // 当点击商品时
    const handleProductClick = (product: Product) => {
        navigate({to: `/products/${product.id}`}).then(() => {
            console.log('点击商品')
        });
    };

    // 类别图片映射
    const getCategoryImage = (categoryName: string) => {
        const categoryImages: { [key: string]: string } = {
            '手机': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
            '电脑': 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
            '电器': 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
            '服饰': 'https://images.unsplash.com/photo-1560243563-062bfc001d68',
            '美妆': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da',
            '运动': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
            '智能手机': 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7',
            '男装': 'https://images.unsplash.com/photo-1617137968427-85924c800a22',
            '女装': 'https://images.unsplash.com/photo-1551232864-3f0890e580d9',
            '童装': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea',
            '化妆品': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
            '运动服': 'https://images.unsplash.com/photo-1562183241-840b8af0721e',
            '运动鞋': 'https://images.unsplash.com/photo-1562183241-b937e95585b6',
            '冰箱': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
            '笔记本': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
        };

        return categoryImages[categoryName] || 'https://via.placeholder.com/300';
    };

    if (loading) {
        return (
            <Box sx={{my: 4}}>
                <Typography level="h2" component="h2" sx={{mb: 3}}>
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid key={i} xs={6} sm={4} md={3}>
                            <Card variant="outlined">
                                <CardContent
                                    sx={{height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography>加载中...</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    // 显示分类的商品
    if (showProducts && selectedCategory) {
        return (
            <Box sx={{my: 4}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <Button
                            variant="plain"
                            onClick={handleBackToCategories}
                            sx={{mr: 2}}
                        >
                            返回
                        </Button>
                        <Typography level="h2" component="h2">
                            {selectedCategory.name}
                        </Typography>
                    </Box>
                    <Button
                        variant="plain"
                        component={Link}
                        to={`/categories/${selectedCategory.id}`}
                    >
                        查看全部
                    </Button>
                </Box>

                {isProductsLoading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : isProductsError ? (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography level="body-lg">加载商品失败，请重试</Typography>
                    </Box>
                ) : !categoryProducts?.items || categoryProducts.items.length === 0 ? (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography level="body-lg">该分类暂无商品</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {categoryProducts.items.map((product) => (
                            <Grid key={product.id} xs={6} sm={4} md={3} lg={3}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 'md',
                                        },
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <AspectRatio ratio="1/1">
                                        <img
                                            src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            style={{objectFit: 'cover'}}
                                        />
                                    </AspectRatio>
                                    <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                                        <Typography
                                            level="title-md"
                                            sx={{
                                                mb: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                color: 'text.tertiary',
                                                mb: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {product.description}
                                        </Typography>
                                        <Box sx={{
                                            mt: 'auto',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography level="title-lg" color="primary">
                                                ¥{product.price.toFixed(2)}
                                            </Typography>
                                            <Typography level="body-sm" color="neutral">
                                                库存: {product.inventory?.stock || 0}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        );
    }

    // 显示分类列表
    return (
        <Box sx={{my: 4}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2" component="h2">
                    {title}
                </Typography>
                <Button
                    variant="plain"
                    component={Link}
                    to="/categories"
                >
                    查看全部
                </Button>
            </Box>

            <Grid container spacing={2}>
                {categories.map((category) => (
                    <Grid key={category.id} xs={6} sm={4} md={3} lg={2}>
                        <Card
                            variant="outlined"
                            sx={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'md',
                                }
                            }}
                            onClick={() => handleCategoryClick(category)}
                        >
                            <AspectRatio ratio="1/1">
                                <img
                                    src={getCategoryImage(category.name)}
                                    alt={category.name}
                                    style={{objectFit: 'cover'}}
                                />
                            </AspectRatio>
                            <CardContent>
                                <Typography
                                    level="title-md"
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {category.name}
                                </Typography>
                                <Typography
                                    level="body-sm"
                                    sx={{
                                        textAlign: 'center',
                                        color: 'text.tertiary'
                                    }}
                                >
                                    {category.isLeaf ? '热销商品' : `${category.level}级分类`}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 分类子页面模态窗口 */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        width: '90%',
                        maxWidth: 800,
                        maxHeight: '80vh',
                        overflow: 'auto',
                        p: 3,
                        borderRadius: 'md',
                        boxShadow: 'lg',
                    }}
                >
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography level="h3">
                            {selectedCategory?.name} 子分类
                        </Typography>
                        <Button variant="plain" onClick={() => setOpenModal(false)}>
                            关闭
                        </Button>
                    </Box>

                    {selectedCategory && (
                        <CategoryNavigator
                            initialRootId={selectedCategory.id}
                            onCategorySelect={handleSubCategorySelect}
                        />
                    )}
                </Sheet>
            </Modal>
        </Box>
    );
};

export default HotCategories;
