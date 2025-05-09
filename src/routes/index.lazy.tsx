import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Box, Card, CardContent, Divider, Stack, } from '@mui/material'
import AspectRatio from '@mui/joy/AspectRatio'
import Grid from '@mui/joy/Grid'
import Typography from '@mui/joy/Typography'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSearchProducts } from '@/hooks/useProduct'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import { Product } from "@/features/products/types.ts";

import { useCategories } from "@/hooks/useCategory.ts";
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

    const {isLoading, error} = useCategories()

    if (isLoading) {
        return (
            <Box sx={{
                p: 2,
                // maxWidth: '1200px',
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
                    {t('home.loadError')}
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{bgcolor: 'background.default'}}>
            <Box sx={{maxWidth: '100%', margin: '0 auto', p: 3}}>
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
                        {/* 商品分类导航 */}
                        <HotCategories title={t('home.hotCategories')} limit={10} maxLevel={1}/>

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
                                        <Typography level="body-md">{t('home.alipayTestEnv')}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>{t('home.followMe')}</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery">GitHub</a></Typography>
                                        <Typography level="body-md">{t('home.wechatPublic')}</Typography>
                                        <Typography level="body-md">{t('home.juejin')}</Typography>
                                        <Typography level="body-md">{t('home.blog')}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Divider sx={{my: 4}}/>
                            <Typography level="body-md" textAlign="center" sx={{pb: 4}}>
                                {t('home.copyright', {year: new Date().getFullYear()})}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}
