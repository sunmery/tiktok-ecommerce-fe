import {createLazyFileRoute, Link} from '@tanstack/react-router'
import {AspectRatio, Box, Button, Card, CardContent, Divider, Grid, Stack, Typography,} from '@mui/joy'
import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'

import {useSearchProducts} from '@/hooks/useProduct'

import {cartStore} from '@/store/cartStore'
import Breadcrumbs from '@/components/Breadcrumbs'
import {CartItem} from "@/types/cart";
import {Product} from "@/types/products.ts";

import {useCategories} from "@/hooks/useCategory.ts";
import HotCategories from "@/components/HotCategories.tsx";

export const Route = createLazyFileRoute('/')({
    component: Home,
})

/**
 * 首页组件
 * @returns JSXElement
 */
function Home() {
    const {t} = useTranslation()

    const [searchTerm] = useState('')
    // 使用搜索钩子获取搜索结果
    const {data: searchResults} = useSearchProducts(searchTerm)

    // 添加商品到购物车
    const addToCart = (product: CartItem) => {
        // 确保productId不为空
        const productId = product.productId;
        if (!productId || productId.trim() === '') {
            console.error(t('error.addToCart.emptyProductId'));
            return;
        }

        cartStore.addItem(productId, product.name, product.merchantId, product.picture || '', 1);
    }


    // 轮播图数据
    const banners = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            name: t('home.banner.summerSale'),
            description: t('home.banner.summerSaleDesc'),
            buttonText: t('home.banner.summerSaleBtn')
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f',
            name: t('home.banner.newArrivals'),
            description: t('home.banner.newArrivalsDesc'),
            buttonText: t('home.banner.newArrivalsBtn')
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
            name: t('home.banner.memberExclusive'),
            description: t('home.banner.memberExclusiveDesc'),
            buttonText: t('home.banner.memberExclusiveBtn')
        }
    ]

    // 当前显示的轮播图索引
    const [currentBanner, setCurrentBanner] = useState(0)

    // 自动轮播
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    // const categories = [
    //     {
    //         id: 3,
    //         name: '手机',
    //         image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    //         slug: 'phone'
    //     },
    //     {
    //         id: 8,
    //         name: '电器',
    //         image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    //         slug: 'appliance'
    //     },
    //     {
    //         id: 9,
    //         name: '电脑',
    //         image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    //         slug: 'computer'
    //     },
    //     {
    //         name: '服饰',
    //         image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68',
    //         slug: 'clothing'
    //     },
    //     {
    //         name: '美妆',
    //         image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da',
    //         slug: 'beauty'
    //     },
    //     {
    //         name: '运动',
    //         image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    //         slug: 'sports'
    //     }
    // ]

    const {data, isLoading, error} = useCategories()

    // 热门商品数据
    const hotProducts = [
        {
            id: 1,
            name: t('product.smartWatch'),
            price: 1299,
            discount: 999,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
            rating: 4.8,
            sales: 1200,
            description: t('product.smartWatch.description')
        },
        {
            id: 2,
            name: t('product.wirelessEarphones'),
            price: 899,
            discount: 699,
            image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
            rating: 4.7,
            sales: 980,
            description: t('product.wirelessEarphones.description')
        },
        {
            id: 3,
            name: t('product.mechanicalKeyboard'),
            price: 499,
            discount: 399,
            image: 'https://images.unsplash.com/photo-1595225476474-63038da0e238',
            rating: 4.5,
            sales: 850,
            description: t('product.mechanicalKeyboard.description')
        },
        {
            id: 4,
            name: t('product.gamingMouse'),
            price: 299,
            discount: 249,
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
            rating: 4.6,
            sales: 760,
            description: t('product.gamingMouse.description')
        }
    ]

    // 新品上市数据
    const newProducts = [
        {
            id: 5,
            name: t('product.smartSpeaker'),
            price: 599,
            image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab',
            isNew: true,
            description: t('product.smartSpeaker.description')
        },
        {
            id: 6,
            name: t('product.portablePowerBank'),
            price: 199,
            image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
            isNew: true,
            description: t('product.portablePowerBank.description')
        },
        {
            id: 7,
            name: t('product.bluetoothSpeaker'),
            price: 399,
            image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d',
            isNew: true,
            description: t('product.bluetoothSpeaker.description')
        },
        {
            id: 8,
            name: t('product.smartLamp'),
            price: 159,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
            isNew: true,
            description: t('product.smartLamp.description')
        }
    ]

    if (isLoading) {
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
                <Typography level="h2" sx={{textAlign: 'center'}}>
                    {t('home.loading')}
                </Typography>
            </Box>
        )
    }

    if (error) {
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
                <Typography level="h2" sx={{textAlign: 'center'}}>
                    {t('home.loadingFailed')}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{bgcolor: 'background.default'}}>
            <Box sx={{maxWidth: 1200, margin: '0 auto', p: 3}}>
                {/* 面包屑导航 */}
                <Breadcrumbs showHomeIcon={false}/>
                {/* 如果有搜索结果，显示搜索结果 */}
                {searchTerm && (
                    <Box sx={{mb: 4}}>
                        <Typography level="h2" sx={{mb: 2}}>
                            {t('search.results')} "{searchTerm}"
                        </Typography>

                        {isLoading ? (
                            <Typography>{t('search.loading')}</Typography>
                        ) : searchResults?.items ? (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: 3
                            }}>
                                {Array.isArray(searchResults.items) ? (
                                    searchResults.items.map((product: Product, index: number) => (
                                        <Card
                                            key={index}
                                            variant="outlined"
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 'md',
                                                }
                                            }}
                                            component={Link}
                                            to={`/products/${product.id}`}
                                        >
                                            <AspectRatio ratio="4/3">
                                                <img
                                                    src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300'}
                                                    alt={product.name}
                                                    style={{objectFit: 'cover'}}
                                                />
                                            </AspectRatio>
                                            <CardContent>
                                                <Typography level="h3" sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                                                    {product.name}
                                                </Typography>
                                                <Typography level="body-md" sx={{mt: 1}}>
                                                    ¥{product.price}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography>{t('search.noResults')}</Typography>
                                )}
                            </Box>
                        ) : (
                            <Typography>{t('search.noResults')}</Typography>
                        )}
                    </Box>
                )}

                {/* 如果没有搜索，显示首页内容 */}
                {!searchTerm && (
                    <>
                        {/* 轮播图 */}
                        <Box sx={{mb: 6, position: 'relative'}}>
                            <AspectRatio ratio="21/9" maxHeight={500} sx={{borderRadius: 'xl', overflow: 'hidden'}}>
                                <img
                                    src={banners[currentBanner].image}
                                    alt={banners[currentBanner].name}
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '10%',
                                        transform: 'translateY(-50%)',
                                        color: 'white',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                        maxWidth: '500px',
                                    }}
                                >
                                    <Typography level="h1" sx={{
                                        mb: 2,
                                        fontSize: {xs: '2rem', md: '3rem'}
                                    }}>{banners[currentBanner].name}</Typography>
                                    <Typography level="body-md" sx={{
                                        mb: 3,
                                        fontSize: {xs: '1rem', md: '1.25rem'}
                                    }}>{banners[currentBanner].description}</Typography>
                                    <Button
                                        size="lg"
                                        variant="solid"
                                        color="primary"
                                        sx={{
                                            borderRadius: 'xl',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                transition: 'transform 0.2s',
                                            }
                                        }}
                                    >
                                        {banners[currentBanner].buttonText}
                                    </Button>
                                </Box>
                            </AspectRatio>

                            {/* 轮播图指示器 */}
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                {banners.map((_, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setCurrentBanner(index)}
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            mx: 0.5,
                                            bgcolor: index === currentBanner ? 'primary.main' : 'grey.300',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* 商品分类导航 */}
                        <HotCategories title={t('home.hotCategories')} limit={10} maxLevel={1}/>

                        {/* 热门商品区 */}
                        {/*<Box sx={{mb: 6}}>*/}
                        {/*    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>*/}
                        {/*        <Box sx={{display: 'flex', alignItems: 'center'}}>*/}
                        {/*            <LocalOfferIcon color="error" sx={{mr: 1}}/>*/}
                        {/*            <Typography level="h2">热卖爆品</Typography>*/}
                        {/*        </Box>*/}
                        {/*        <Button*/}
                        {/*            endDecorator={<ArrowForwardIcon/>}*/}
                        {/*            variant="plain"*/}
                        {/*            component={Link}*/}
                        {/*            to="/products"*/}
                        {/*        >*/}
                        {/*            更多热卖*/}
                        {/*        </Button>*/}
                        {/*    </Box>*/}

                        {/*    <Box sx={{*/}
                        {/*        display: 'grid',*/}
                        {/*        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',*/}
                        {/*        gap: 3*/}
                        {/*    }}>*/}
                        {/*        {hotProducts.map((product, index) => (*/}
                        {/*            <Card*/}
                        {/*                key={index}*/}
                        {/*                variant="outlined"*/}
                        {/*                sx={{*/}
                        {/*                    position: 'relative',*/}
                        {/*                    cursor: 'pointer',*/}
                        {/*                    transition: 'transform 0.2s, box-shadow 0.2s',*/}
                        {/*                    '&:hover': {*/}
                        {/*                        transform: 'translateY(-4px)',*/}
                        {/*                        boxShadow: 'md',*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                {product.discount && (*/}
                        {/*                    <Chip*/}
                        {/*                        size="sm"*/}
                        {/*                        variant="solid"*/}
                        {/*                        color="danger"*/}
                        {/*                        sx={{*/}
                        {/*                            position: 'absolute',*/}
                        {/*                            top: 10,*/}
                        {/*                            right: 10,*/}
                        {/*                            zIndex: 1,*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        {Math.round((1 - product.discount / product.price) * 100)}% OFF*/}
                        {/*                    </Chip>*/}
                        {/*                )}*/}
                        {/*                <AspectRatio ratio="4/3">*/}
                        {/*                    <img src={product.image} alt={product.name} style={{objectFit: 'cover'}}/>*/}
                        {/*                </AspectRatio>*/}
                        {/*                <CardContent>*/}
                        {/*                    <Typography level="body-md">{product.name}</Typography>*/}
                        {/*                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mt: 1}}>*/}
                        {/*                        {[...Array(5)].map((_, i) => (*/}
                        {/*                            <StarIcon*/}
                        {/*                                key={i}*/}
                        {/*                                fontSize="small"*/}
                        {/*                                sx={{color: i < Math.floor(product.rating) ? 'warning.500' : 'grey.300'}}*/}
                        {/*                            />*/}
                        {/*                        ))}*/}
                        {/*                        <Typography level="body-md" sx={{ml: 1}}>{product.rating}</Typography>*/}
                        {/*                        <Typography level="body-md" sx={{*/}
                        {/*                            ml: 'auto',*/}
                        {/*                            color: 'text.secondary'*/}
                        {/*                        }}>{product.sales}人已购买</Typography>*/}
                        {/*                    </Box>*/}
                        {/*                    <Box sx={{display: 'flex', alignItems: 'center', mt: 1.5}}>*/}
                        {/*                        <Typography level="h3" sx={{*/}
                        {/*                            color: 'danger.500',*/}
                        {/*                            fontWeight: 'bold'*/}
                        {/*                        }}>¥{product.discount}</Typography>*/}
                        {/*                        {product.discount && (*/}
                        {/*                            <Typography level="body-md" sx={{*/}
                        {/*                                ml: 1,*/}
                        {/*                                textDecoration: 'line-through',*/}
                        {/*                                color: 'text.tertiary'*/}
                        {/*                            }}>¥{product.price}</Typography>*/}
                        {/*                        )}*/}
                        {/*                        <Button*/}
                        {/*                            size="md"*/}
                        {/*                            variant="solid"*/}
                        {/*                            color="primary"*/}
                        {/*                            sx={{ml: 'auto', fontWeight: 600}}*/}
                        {/*                            onClick={() => addToCart({*/}
                        {/*                                merchantId:*/}
                        {/*                                product.merchantId,*/}
                        {/*                                quantity: 0,*/}
                        {/*                                productId: product.id,*/}
                        {/*                                name: product.name,*/}
                        {/*                                price: product.discount || product.price,*/}
                        {/*                                image: product.image,*/}
                        {/*                                categories: product.categories,*/}
                        {/*                            })}*/}
                        {/*                        >*/}
                        {/*                            加入购物车*/}
                        {/*                        </Button>*/}
                        {/*                    </Box>*/}
                        {/*                </CardContent>*/}
                        {/*            </Card>*/}
                        {/*        ))}*/}
                        {/*    </Box>*/}
                        {/*</Box>*/}

                        {/* 新品上市区 */}
                        {/*<Box sx={{mb: 6}}>*/}
                        {/*    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>*/}
                        {/*        <Box sx={{display: 'flex', alignItems: 'center'}}>*/}
                        {/*            <NewReleasesIcon color="success" sx={{mr: 1}}/>*/}
                        {/*            <Typography level="h2">新品上市</Typography>*/}
                        {/*        </Box>*/}
                        {/*        <Button*/}
                        {/*            endDecorator={<ArrowForwardIcon/>}*/}
                        {/*            variant="plain"*/}
                        {/*            component={Link}*/}
                        {/*            to="/products"*/}
                        {/*        >*/}
                        {/*            更多新品*/}
                        {/*        </Button>*/}
                        {/*    </Box>*/}

                        {/*    <Box sx={{*/}
                        {/*        display: 'grid',*/}
                        {/*        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',*/}
                        {/*        gap: 3*/}
                        {/*    }}>*/}
                        {/*        {newProducts.map((product:Product, index:number) => (*/}
                        {/*            <Card*/}
                        {/*                key={index}*/}
                        {/*                variant="outlined"*/}
                        {/*                sx={{*/}
                        {/*                    position: 'relative',*/}
                        {/*                    cursor: 'pointer',*/}
                        {/*                    transition: 'transform 0.2s, box-shadow 0.2s',*/}
                        {/*                    '&:hover': {*/}
                        {/*                        transform: 'translateY(-4px)',*/}
                        {/*                        boxShadow: 'md',*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                {product.isNew && (*/}
                        {/*                    <Chip*/}
                        {/*                        size="sm"*/}
                        {/*                        variant="solid"*/}
                        {/*                        color="success"*/}
                        {/*                        sx={{*/}
                        {/*                            position: 'absolute',*/}
                        {/*                            top: 10,*/}
                        {/*                            right: 10,*/}
                        {/*                            zIndex: 1,*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        新品*/}
                        {/*                    </Chip>*/}
                        {/*                )}*/}
                        {/*                <AspectRatio ratio="4/3">*/}
                        {/*                    <img src={product.image} alt={product.name} style={{objectFit: 'cover'}}/>*/}
                        {/*                </AspectRatio>*/}
                        {/*                <CardContent>*/}
                        {/*                    <Typography level="body-md">{product.name}</Typography>*/}
                        {/*                    <Box sx={{display: 'flex', alignItems: 'center', mt: 1.5}}>*/}
                        {/*                        <Typography level="h3" sx={{*/}
                        {/*                            color: 'primary.500',*/}
                        {/*                            fontWeight: 'bold'*/}
                        {/*                        }}>¥{product.price}</Typography>*/}
                        {/*                        <Button*/}
                        {/*                            size="md"*/}
                        {/*                            variant="solid"*/}
                        {/*                            color="primary"*/}
                        {/*                            sx={{ml: 'auto', fontWeight: 600}}*/}
                        {/*                            onClick={() => addToCart({*/}
                        {/*                                merchantId: product.merchantId,*/}
                        {/*                                productId: product.id,*/}
                        {/*                                name: product.name,*/}
                        {/*                                price: product.price,*/}
                        {/*                                image: product.image,*/}
                        {/*                                categories: ['新品上市']*/}
                        {/*                            })}*/}
                        {/*                        >*/}
                        {/*                            加入购物车*/}
                        {/*                        </Button>*/}
                        {/*                    </Box>*/}
                        {/*                </CardContent>*/}
                        {/*            </Card>*/}
                        {/*        ))}*/}
                        {/*    </Box>*/}
                        {/*</Box>*/}

                        {/* 页面底部 */}
                        <Box sx={{mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider'}}>
                            <Grid container spacing={4}>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>{t('home.projectInfo')}</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce">{t('home.backend')}</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-fe">{t('home.frontend')}</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-gateway">{t('home.gateway')}</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-gateway">{t('home.devops')}</a></Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>{t('home.paymentMethods')}</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md">{t('home.alipayTest')}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>{t('home.followMe')}</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery">GitHub</a></Typography>
                                        <Typography level="body-md">{t('home.wechat')}</Typography>
                                        <Typography level="body-md">{t('home.juejin')}</Typography>
                                        <Typography level="body-md">{t('home.blog')}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Divider sx={{my: 4}}/>
                            <Typography level="body-md" textAlign="center" sx={{pb: 4}}>
                                © {new Date().getFullYear()} {t('home.projectDescription')}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}
