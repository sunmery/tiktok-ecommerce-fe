import {createLazyFileRoute, Link} from '@tanstack/react-router'
import {Box, Card, CardContent, Divider, Grid, Stack, Typography} from '@mui/material'
import AspectRatio from '@mui/joy/AspectRatio'
import {useTranslation} from 'react-i18next'
import {useState} from 'react'

import {useSearchProducts} from '@/hooks/useProduct'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
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

    const {isLoading, error} = useCategories()

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
                    加载中...
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
                    加载失败，请重试
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
                        {/* 商品分类导航 */}
                        <HotCategories title="热门分类" limit={10} maxLevel={1}/>

                        {/* 页面底部 */}
                        <Box sx={{mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider'}}>
                            <Grid container spacing={4}>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>项目信息</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce">后端</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-fe">前端</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-gateway">网关</a></Typography>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery/tiktok-ecommerce-gateway">运维</a></Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>支付方式</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md">支付宝沙箱</Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Typography level="title-lg" sx={{mb: 2}}>关注我</Typography>
                                    <Stack spacing={1}>
                                        <Typography level="body-md"><a
                                            href="https://github.com/sunmery">GitHub</a></Typography>
                                        <Typography level="body-md">微信公众号</Typography>
                                        <Typography level="body-md">掘金</Typography>
                                        <Typography level="body-md">Blog</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Divider sx={{my: 4}}/>
                            <Typography level="body-md" textAlign="center" sx={{pb: 4}}>
                                © {new Date().getFullYear()} 基于Golang技术栈和基于角色的访问控制的领域驱动设计电商微服务
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}
