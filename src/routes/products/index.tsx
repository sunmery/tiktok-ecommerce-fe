import {createFileRoute} from '@tanstack/react-router'
import {useNavigate, useSearch} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {productService} from "@/api/productService.ts";
import {useSnapshot} from "valtio/react";
import {cartStore} from "@/store/cartStore.ts";
import {useState, useEffect} from 'react';
import {Box} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import type {Product} from "@/types/products.ts";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";
import AspectRatio from "@mui/joy/AspectRatio";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Breadcrumbs from '@/components/Breadcrumbs';

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
    const [mockData, setMockData] = useState<Product[]>([])
    const snapshot = useSnapshot(cartStore)

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "page": 1,
            "page_size": 200,
            "status": 2
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/ecommerce.product.v1.ProductService/ListRandomProducts", requestOptions)
            .then(response => response.json())
            .then(result => console.log("result:",result))
            .catch(error => console.log('error', error));
    }, []);

    // 使用React Query获取商品列表
    const {data, error, isError, isLoading} = useQuery({
        queryKey: ['products', search.query],
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

    // 如果网络请求失败，使用mock数据
    useEffect(() => {
        if (isError || (data && data.length === 0)) {
            console.log("网络请求失败或无数据，使用模拟数据")
            // 从mockData.ts导入mock数据
            import('@/utils/mockData').then(module => {
                setMockData(module.mockProducts)
            })
        }
    }, [isError, data]);

    const addToCartHandler = (
        id: string,
        name: string,
        merchantId: string,
        price: number,
    ) => {
        cartStore.addItem(id, merchantId, name, price, 1) // 固定添加1个商品到购物车
    }

    // 使用网络数据或mock数据
    const displayData = data && data.length > 0 ? data : mockData;

    // 显示错误信息
    if (error && !mockData.length) {
        return <Typography color="danger">加载数据失败</Typography>
    }

    // 显示加载状态
    if (isLoading && !displayData.length) {
        return (
            <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
                <Typography level="h2" sx={{mb: 3}}>商品搜索</Typography>
                <Typography>加载中...</Typography>
            </Box>
        )
    }

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
                {displayData.map((product: Product, index: number) => (
                    <Card
                        key={product.name + index}
                        sx={{
                            width: 320,
                            position: 'relative',
                            m: 1,
                            transition: 'transform 0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 'md'
                            }
                        }}
                        onClick={(e) => {
                            // 阻止事件冒泡，避免点击按钮时也触发卡片点击事件
                            if (e.defaultPrevented) return;
                            // 导航到商品详情页
                            navigate({to: `/products/${product.id}`});
                        }}
                    >
                        <Box sx={{position: 'relative', mb: 2}}>
                            {index < 3 && (
                                <Typography
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        bgColor: 'warning.400',
                                        color: 'white',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 'sm',
                                        fontSize: 'xs',
                                        fontWeight: 'bold',
                                        zIndex: 1
                                    }}
                                >
                                    New
                                </Typography>
                            )}
                            <Typography level="title-lg" sx={{mb: 1}}>{product.name}</Typography>
                            <IconButton
                                aria-label="收藏商品"
                                variant="outlined"
                                color="neutral"
                                size="sm"
                                sx={{position: 'absolute', top: 8, right: 8, zIndex: 1}}
                            >
                                <BookmarkAdd/>
                            </IconButton>
                        </Box>
                        <AspectRatio
                            minHeight="120px"
                            maxHeight="200px"
                        >
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0].url : "https://picsum.photos/300/200"}
                                loading="lazy"
                                alt={product.name}
                                style={{objectFit: "cover"}}
                            />
                        </AspectRatio>
                        <Typography>{product.description}</Typography>
                        {product.category && (
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    mt: 1,
                                    ml: 1
                                }}
                                variant="outlined"
                            >
                                {product.category.categoryName}
                            </Typography>
                        )}
                        <CardContent orientation="horizontal"
                                     sx={{justifyContent: "space-between", alignItems: "center"}}>
                            <div>
                                <Typography level="body-xs">Price:</Typography>
                                <Typography sx={{fontSize: 'lg', fontWeight: 'lg'}}>
                                    ¥{product.price}
                                </Typography>
                            </div>
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                aria-label="添加到购物车"
                                sx={{
                                    fontWeight: 600,
                                    ml: 'auto',
                                    '&:hover': {
                                        bgColor: 'primary.600'
                                    }
                                }}
                                onClick={(e) => {
                                    e.preventDefault(); // 阻止事件冒泡
                                    addToCartHandler(
                                        product.id,
                                        product.name,
                                        product.merchantId || '', // 确保merchantId存在，如果不存在则传空字符串
                                        product.price
                                    )
                                }}
                            >
                                加入购物车
                            </Button>
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
