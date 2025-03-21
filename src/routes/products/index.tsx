import {createFileRoute} from '@tanstack/react-router'
import {useNavigate, useSearch} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {productService} from "@/api/productService.ts";
import {useSnapshot} from "valtio/react";
import {cartStore} from "@/store/cartStore.ts";
import {ChangeEvent} from 'react';
import {Box, SvgIcon} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Breadcrumbs from '@/components/Breadcrumbs';
import {styled} from '@mui/joy';

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
    const pageSize = 20
    const status = 2
    const snapshot = useSnapshot(cartStore)

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

    const addToCartHandler = async (
        id: string,
        name: string,
        merchantId: string,
        price: number,
    ) => {
        // 确保productId不为空
        if (!id || id.trim() === '') {
            console.error('添加商品失败: 商品ID不能为空');
            return;
        }
        
        // 修正参数顺序：productId, name, merchantId, picture, quantity
        await cartStore.addItem(id, name, merchantId, '', 1) // 固定添加1个商品到购物车
    }

    // 使用网络数据
    const displayData = data || [];

    // 显示错误信息
    if (isError) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Breadcrumbs pathMap={{'products': '全部商品'}}/>
                <Typography level="h2" sx={{mb: 3}}>{search.query ? `搜索结果: ${search.query}` : '全部商品'}</Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8}}>
                    <Typography color="danger" level="h4" sx={{mb: 2}}>加载数据失败</Typography>
                    <Typography color="neutral" level="body-md" sx={{mb: 4}}>抱歉，无法获取商品数据，请稍后再试</Typography>
                    <Button onClick={() => window.location.reload()} variant="outlined">重新加载</Button>
                </Box>
            </Box>
        )
    }

    // 显示加载状态
    if (isLoading) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Breadcrumbs pathMap={{'products': '全部商品'}}/>
                <Typography level="h2" sx={{mb: 3}}>{search.query ? `搜索结果: ${search.query}` : '全部商品'}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                    <Typography level="body-lg">加载中...</Typography>
                </Box>
            </Box>
        )
    }

    const UpdateImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log('文件名称:', file.name);
        console.log('文件大小:', file.size, 'bytes');
        console.log('文件类型:', file.type);

        fetch(`http://localhost:8000/v1/products/uploadfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                method: "POST",
                contentType: file.type,
                bucketName: "ecommerce",
                fileName: file.name
            })
        }).then(res => res.json()).then(data => {
            console.log('上传URL:', data)
            if (data.downloadUrl) {
                fetch(data.downloadUrl, {
                    method: 'PUT',
                    body: file
                }).then(res => {
                    if (res.status === 200) {
                        console.log('文件上传成功')
                        // 保存图片URL到本地状态，可以在后续创建商品时使用
                        // 从downloadUrl中提取永久访问URL
                        // 通常downloadUrl格式为：http://domain/bucket/objectName?签名参数
                        // 我们需要提取不带签名参数的部分作为永久URL
                        const permanentUrl = data.downloadUrl.split('?')[0];
                        console.log('永久访问URL:', permanentUrl);

                        // 这里可以将URL保存到本地状态或者直接用于创建商品
                        // 例如，可以将URL显示在界面上或保存到表单中
                        // 在实际应用中，您可能需要将此URL与商品ID关联起来
                    }
                }).catch(err => {
                    console.error('上传文件失败:', err)
                })
            }
        }).catch(err => {
            console.error('获取上传URL失败:', err)
        })
    }
    const VisuallyHiddenInput = styled('input')`
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        white-space: nowrap;
        width: 1px;
    `;


    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'products': '全部商品'}}/>

            {/* 根据是否有搜索词显示不同标题 */}
            {search.query ? (
                <Typography level="h2" sx={{mb: 3}}>
                    搜索结果: {search.query} {displayData.length > 0 ? `(${displayData.length}个结果)` : ''}
                </Typography>
            ) : (
                <Typography level="h2" sx={{mb: 3}}>全部商品</Typography>
            )}

            {/* 没有搜索结果时显示提示 */}
            {search.query && displayData.length === 0 && (
                <Typography level="body-lg" sx={{mb: 3}}>
                    没有找到与 "{search.query}" 相关的商品
                </Typography>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                }}
            >
                <Box>
                    <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        color="neutral"
                        startDecorator={
                            <SvgIcon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                    />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        Upload a file
                        <VisuallyHiddenInput type="file" onChange={UpdateImage}/>
                    </Button>
                </Box>

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
                                search: { merchantId: product.merchantId }
                            });
                        }}
                    >
                        <AspectRatio ratio="4/3" objectFit="cover">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0].imageUrl : "https://picsum.photos/300/200"}
                                loading="lazy"
                                alt={product.name}
                            />
                        </AspectRatio>
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                                <IconButton
                                    aria-label="收藏商品"
                                    variant="outlined"
                                    color="neutral"
                                    size="sm"
                                >
                                    <BookmarkAdd />
                                </IconButton>
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
                                {product.description || '暂无描述'}
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
                            
                            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>价格</Typography>
                                    <Typography 
                                        level="h4" 
                                        sx={{ 
                                            color: 'primary.600',
                                            fontWeight: 'bold' 
                                        }}
                                    >
                                        ¥{product.price}
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
                                            product.price
                                        );
                                    }}
                                    sx={{
                                        minWidth: 100,
                                        boxShadow: 'sm'
                                    }}
                                >
                                    加入购物车
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Typography level="body-lg">
                Cart Total: {snapshot.items.length} items
            </Typography>
        </Box>
    );
}
