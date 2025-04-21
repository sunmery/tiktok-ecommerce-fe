import {createFileRoute, useNavigate, useSearch} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {productService} from "@/api/productService.ts";
import {useSnapshot} from "valtio/react";
import {cartStore} from "@/store/cartStore.ts";
import {Box, CardOverflow} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import {useTranslation} from "react-i18next";
import Favorites from "@/components/Favorites";
import {userService} from "@/api/userService.ts";
import {userStore} from "@/store/user.ts";
import AspectRatio from "@mui/joy/AspectRatio";
import {showMessage} from "@/utils/showMessage.ts";

export const Route = createFileRoute('/products/')({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            query: search.query as string || ''
        }
    }
})

function RouteComponent() {
    return <Products/>
}

function Products() {
    const navigate = useNavigate()
    const search = useSearch({from: '/products/'})
    const page = 1
    const pageSize = 200
    const status = 2
    const snapshot = useSnapshot(cartStore)
    const accountStore = useSnapshot(userStore)
    const {t} = useTranslation();

    // 使用React Query获取商品列表
    const {data, isError, isLoading} = useQuery({
        queryKey: ['products', page, pageSize, status],
        queryFn: async () => {
            // 如果有搜索关键词，则调用搜索API
            if (search.query) {
                const res = await productService.searchProductsByName({name: search.query})
                return res.items
            } else {
                // 否则获取随机商品列表
                const res = await productService.listRandomProducts({page: page, pageSize: pageSize, status: status})
                return res.items
            }
        },
        retry: 1, // 失败后重试一次
    });

    const {data: favoriteProduct, isError: favoriteError, isLoading: favoriteLoading} = useQuery({
        queryKey: ['favoriteProduct'],
        queryFn: async () => {
            const res = await userService.getFavorites(page, pageSize)
            return res.items
        },
        retry: 1, // 失败后重试一次
        enabled: !!accountStore.account.id, // 只有在用户登录后才启用查询
    })

    const addToCartHandler = async (
        id: string,
        name: string,
        merchantId: string,
        // price: number,
    ) => {
        // 确保productId不为空
        if (!id || id.trim() === '') {
            console.error('添加商品失败: 商品ID不能为空');
            return;
        }

        // 修正参数顺序：productId, name, merchantId, picture, quantity
        cartStore.addItem(id, name, merchantId, '', 1) // 固定添加1个商品到购物车
        // 固定添加1个商品到购物车
    }

    // 使用网络数据
    const displayData = data || [];

    // 显示错误信息
    if (isError || favoriteError) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Breadcrumbs pathMap={{'products': t('allProducts')}}/>
                <Typography level="h2"
                            sx={{mb: 3}}>{search.query ? `${t('searchResults')}: ${search.query}` : t('allProducts')}</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8
                }}>
                    <Typography color="danger" level="h4" sx={{mb: 2}}>{t('errorLoadingProducts')}</Typography>
                    <Typography color="neutral" level="body-md" sx={{mb: 4}}>{t('tryAgain')}</Typography>
                    <Button onClick={() => window.location.reload()} variant="outlined">{t('refresh')}</Button>
                </Box>
            </Box>
        )
    }

    // 显示加载状态
    if (isLoading || favoriteLoading) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Breadcrumbs pathMap={{'products': t('allProducts')}}/>
                <Typography level="h2"
                            sx={{mb: 3}}>{search.query ? `${t('searchResults')}: ${search.query}` : t('allProducts')}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                    <Typography level="body-lg">{t('loading')}</Typography>
                </Box>
            </Box>
        )
    }

    // const UpdateImage = (event: ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (!file) return;
    //
    //     console.log('文件名称:', file.name);
    //     console.log('文件大小:', file.size, 'bytes');
    //     console.log('文件类型:', file.type);
    //
    //     fetch(`https://gw.localhost/v1/products/uploadfile`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + localStorage.getItem('token')
    //         },
    //         body: JSON.stringify({
    //             method: "POST",
    //             contentType: file.type,
    //             bucketName: "ecommerce",
    //             fileName: file.name
    //         })
    //     }).then(res => res.json()).then(data => {
    //         console.log('上传URL:', data)
    //         if (data.downloadUrl) {
    //             fetch(data.downloadUrl, {
    //                 method: 'PUT',
    //                 body: file
    //             }).then(res => {
    //                 if (res.status === 200) {
    //                     console.log('文件上传成功')
    //                     // 保存图片URL到本地状态，可以在后续创建商品时使用
    //                     // 从downloadUrl中提取永久访问URL
    //                     // 通常downloadUrl格式为：http://domain/bucket/objectName?签名参数
    //                     // 我们需要提取不带签名参数的部分作为永久URL
    //                     const permanentUrl = data.downloadUrl.split('?')[0];
    //                     console.log('永久访问URL:', permanentUrl);
    //
    //                     // 这里可以将URL保存到本地状态或者直接用于创建商品
    //                     // 例如，可以将URL显示在界面上或保存到表单中
    //                     // 在实际应用中，您可能需要将此URL与商品ID关联起来
    //                 }
    //             }).catch(err => {
    //                 console.error('上传文件失败:', err)
    //             })
    //         }
    //     }).catch(err => {
    //         console.error('获取上传URL失败:', err)
    //     })
    // }
    // const VisuallyHiddenInput = styled('input')`
    //     clip: rect(0 0 0 0);
    //     clip-path: inset(50%);
    //     height: 1px;
    //     overflow: hidden;
    //     position: absolute;
    //     bottom: 0;
    //     left: 0;
    //     white-space: nowrap;
    //     width: 1px;
    // `;

    if (data) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                {/* 面包屑导航 */}
                <Breadcrumbs pathMap={{'products': t('allProducts')}}/>

                {/* 根据是否有搜索词显示不同标题 */}
                {search.query ? (
                    <Typography level="h2" sx={{mb: 3}}>
                        {t('searchResults')}: {search.query} {displayData.length > 0 ? `(${displayData.length}${t('results')})` : ''}
                    </Typography>
                ) : (
                    <Typography level="h2" sx={{mb: 3}}>{t('allProducts')}</Typography>
                )}

                {/* 没有搜索结果时显示提示 */}
                {search.query && displayData.length === 0 && (
                    <Typography level="body-lg" sx={{mb: 3}}>
                        {t('noResultsFound')} "{search.query}" {t('noResultsFoundSuffix')}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    }}
                >
                    {displayData.map((product, index: number) => (
                        <Card
                            key={product.name + index}
                            sx={{
                                width: '100%',
                                maxWidth: 320,
                                position: 'relative',
                                m: 1,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'lg'
                                }
                            }}
                            onClick={async (e) => {
                                if (e.defaultPrevented) return;
                                await navigate({
                                    to: `/products/${product.id}`,
                                    search: (prev) => ({...prev, merchantId: product.merchantId})
                                });
                            }}
                        >
                            <CardOverflow>
                                <AspectRatio ratio="4/3" objectFit="cover">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0].url : ''}
                                        loading="lazy"
                                        alt={product.name}
                                    />
                                </AspectRatio>
                            </CardOverflow>

                            <CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <Typography level="title-lg" sx={{
                                        fontSize: 'md',
                                        fontWeight: 'bold',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: 1.2
                                    }}>
                                        {product.name}
                                    </Typography>
                                    <Box onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const isFavorited = favoriteProduct?.some(item =>
                                            item.id === product.id && item.merchantId === product.merchantId
                                        );
                                        if (isFavorited) {
                                            userService.deleteFavorites({
                                                productId: product.id,
                                                merchantId: product.merchantId
                                            }).then(() => {
                                                // 刷新收藏列表
                                                window.location.reload();
                                                showMessage('取消收藏成功', 'success');
                                            });
                                        } else {
                                            userService.addFavorite({
                                                productId: product.id,
                                                merchantId: product.merchantId
                                            }).then(() => {
                                                // 刷新收藏列表
                                                window.location.reload();
                                                showMessage('添加成功', 'success');
                                            });
                                        }
                                    }}>
                                        <Favorites
                                            isFavorited={favoriteProduct ? favoriteProduct.some(item =>
                                                item.id === product.id && item.merchantId === product.merchantId
                                            ) : false}
                                        />
                                    </Box>
                                </Box>

                                <Typography level="body-sm" sx={{
                                    color: 'text.secondary',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    minHeight: '2.5em',
                                    mb: 1
                                }}>
                                    {product.description || t('noDescription')}
                                </Typography>

                                {product.category && (
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            color: 'primary.500',
                                            fontWeight: 'md'
                                        }}
                                    >
                                        {product.category.categoryName}
                                    </Typography>
                                )}

                                <Box sx={{
                                    mt: 'auto',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Box>
                                        <Typography level="body-xs"
                                                    sx={{color: 'text.secondary'}}>{t('price')}</Typography>
                                        <Typography
                                            level="h4"
                                            sx={{
                                                color: 'primary.600',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ¥{product.price}
                                        </Typography>
                                        <Typography level="body-xs" sx={{color: 'text.secondary'}}>
                                            {t('stock')}: {product.inventory?.stock || product.quantity || 0}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCartHandler(
                                                product.id,
                                                product.name,
                                                product.merchantId,
                                                // product.price
                                            ).then(r => {
                                                console.log("addToCartHandler", r)
                                            }).catch(e => {
                                                console.error("addToCartHandler", e)
                                            })
                                        }}
                                        sx={{
                                            minWidth: 100,
                                            boxShadow: 'sm'
                                        }}
                                        disabled={(product.inventory?.stock || product.quantity || 0) <= 0}
                                    >
                                        {(product.inventory?.stock || product.quantity || 0) > 0 ? t('addToCart') : t('outOfStock')}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                <Typography level="body-lg">
                    {t('cartTotal')}: {snapshot.items.length} {t('cartItems')}
                </Typography>
            </Box>
        );
    }
}
