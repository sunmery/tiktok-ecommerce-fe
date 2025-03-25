import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {FavoriteBorder, Add, Remove, ShoppingCart, CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material'
import {
    Box,
    Table,
    Button,
    Typography,
    IconButton,
    Card,
    Input
} from '@mui/joy'
import {useState} from 'react'

import {useCart} from "@/hooks/useCart.ts";

export const Route = createLazyFileRoute('/carts/')({component: () => <Cart/>})

/**
 *@returns JSXElement
 */
function Cart() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const {
        cartItems,
        isLoading,
        removeItem: apiRemoveItem,
        updateQuantity: apiUpdateQuantity,
        clearCart: apiClearCart,
        getSelectedTotalPrice,
        toggleItemSelection,
        selectAllItems,
        unselectAllItems,
        isAllSelected,
        getSelectedItemsCount,
        syncWithBackend
    } = useCart()

    const removeItem = (id: string) => {
        try {
            apiRemoveItem(id)
        } catch (err) {
            setError('删除商品失败，请稍后重试')
        }
    }

    const updateQuantity = (id: string, change: number) => {
        try {
            const item = cartItems.find(item => item.productId === id)
            if (item) {
                const newQuantity = item.quantity + change
                if (newQuantity > 0) {
                    apiUpdateQuantity({itemId: id, quantity: newQuantity})
                } else {
                    removeItem(id)
                }
            }
        } catch (err) {
            setError('更新商品数量失败，请稍后重试')
        }
    }

    const handleClearCart = () => {
        try {
            apiClearCart()
        } catch (err) {
            setError('清空购物车失败，请稍后重试')
        }
    }

    // 计算商品小计
    const getItemSubtotal = (price: number, quantity: number) => {
        return price * quantity
    }

    // 处理结算逻辑
    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) {
            setError('购物车为空，无法结算')
            return
        }

        const selectedCount = getSelectedItemsCount()
        if (selectedCount === 0) {
            setError('请至少选择一件商品进行结算')
            return
        }

        try {
            setLoading(true)
            setError(null)
            
            // 先同步购物车数据到后端，确保前后端数据一致
            console.log('结算前同步购物车数据...')
            syncWithBackend(
                // 同步成功回调
                () => {
                    console.log('购物车同步成功，准备跳转到结算页面')
                    // 同步成功后跳转到结算页面
                    navigate({to: '/checkout'}).then(() => {
                        console.log('已跳转到结算页面')
                    }).catch(navError => {
                        console.error('跳转到结算页面失败:', navError)
                        setError('跳转到结算页面失败，请稍后重试')
                        setLoading(false)
                    })
                },
                // 同步失败回调
                (error) => {
                    console.error('购物车同步失败:', error)
                    setError('同步购物车失败，请稍后重试')
                    setLoading(false)
                }
            ).then(r => {
                console.log("同步购物车数据完成",r)
            })
        } catch (err) {
            console.error('结算过程发生错误:', err)
            setError('结算失败，请稍后重试')
            setLoading(false)
        }
    }

    if (loading) {
        return <div>加载中...</div>
    }

    if (isLoading) {
        return <div>获取线上的购物车数据中</div>
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 删除了面包屑导航 */}

            <Typography level="h2" sx={{mb: 3}}>购物车</Typography>
            {error && (
                <Typography color="danger" sx={{mb: 2}}>
                    {error}
                </Typography>
            )}
            {cartItems && cartItems.length > 0 ? (
                <Box>
                    <Card variant="outlined" sx={{mb: 3}}>
                        <Table>
                            <thead>
                            <tr>
                                <th style={{width: '5%'}}>
                                    <IconButton
                                        size="sm"
                                        onClick={() => isAllSelected() ? unselectAllItems() : selectAllItems()}
                                    >
                                        {isAllSelected() ? <CheckBox /> : <CheckBoxOutlineBlank />}
                                    </IconButton>
                                </th>
                                <th style={{width: '25%'}}>商品信息</th>
                                <th style={{width: '15%'}}>单价</th>
                                <th style={{width: '20%'}}>数量</th>
                                <th style={{width: '15%'}}>小计</th>
                                <th style={{width: '20%'}}>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.productId}>
                                    <td>
                                        <IconButton
                                            size="sm"
                                            onClick={() => toggleItemSelection(item.productId)}
                                        >
                                            {item.selected ? <CheckBox /> : <CheckBoxOutlineBlank />}
                                        </IconButton>
                                    </td>
                                    <td>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                            <Box
                                                component="img"
                                                src={item.picture}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                sx={{objectFit: 'cover', borderRadius: 'sm'}}
                                            />
                                            <Box>
                                                <Typography level="title-md">{item.name}</Typography>
                                                {/*{item && item.categories.length > 0 && (*/}
                                                {/*    <Box*/}
                                                {/*        sx={{display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap'}}>*/}
                                                {/*        {item.categories.map((category, index) => (*/}
                                                {/*            <Chip*/}
                                                {/*                key={index}*/}
                                                {/*                size="sm"*/}
                                                {/*                variant="soft"*/}
                                                {/*                color="primary"*/}
                                                {/*            >*/}
                                                {/*                {category}*/}
                                                {/*            </Chip>*/}
                                                {/*        ))}*/}
                                                {/*    </Box>*/}
                                                {/*)}*/}
                                            </Box>
                                        </Box>
                                    </td>
                                    <td>
                                        <Typography level="title-md">¥{(item.price || 0).toFixed(2)}</Typography>
                                    </td>
                                    <td>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                onClick={() => updateQuantity(item.productId, -1)}
                                            >
                                                <Remove/>
                                            </IconButton>
                                            <Input
                                              value={item.quantity}
                                              variant="outlined"
                                              size="sm"
                                              sx={{ width: '60px', textAlign: 'center' }}
                                              onChange={(e) => {
                                                const value = Math.max(1, parseInt(e.target.value) || 1);
                                                apiUpdateQuantity({ itemId: item.productId, quantity: value });
                                              }}
                                              onBlur={(e) => {
                                                const value = Math.max(1, parseInt(e.target.value) || 1);
                                                apiUpdateQuantity({ itemId: item.productId, quantity: value });
                                              }}
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  const value = Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1);
                                                  apiUpdateQuantity({ itemId: item.productId, quantity: value });
                                                }
                                              }}
                                            />
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                onClick={() => updateQuantity(item.productId, 1)}
                                            >
                                                <Add/>
                                            </IconButton>
                                        </Box>
                                    </td>
                                    <td>
                                        <Typography level="title-md" color="primary">
                                            ¥{getItemSubtotal((item.price || 0), (item.quantity || 0)).toFixed(2)}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Button
                                            variant="soft"
                                            color="danger"
                                            onClick={() => removeItem(item.productId)}
                                        >
                                            删除
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Button
                            variant="outlined"
                            color="danger"
                            onClick={handleClearCart}
                            startDecorator={<FavoriteBorder/>}
                        >
                            清空购物车
                        </Button>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Typography level="h4">
                                总计: ¥{getSelectedTotalPrice().toFixed(2)}
                            </Typography>
                            <Typography level="body-sm" sx={{ ml: 1 }}>
                                已选择 {getSelectedItemsCount()} 件商品
                            </Typography>
                            <Button
                                size="lg"
                                color="primary"
                                variant="solid"
                                startDecorator={<ShoppingCart/>}
                                onClick={handleCheckout}
                                disabled={!cartItems || cartItems.length === 0 || getSelectedItemsCount() === 0}
                            >
                                去结算
                            </Button>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Card variant="outlined" sx={{p: 4, textAlign: 'center'}}>
                    <Typography level="h3" sx={{mb: 2}}>购物车为空</Typography>
                    <Typography sx={{mb: 3}}>您的购物车中还没有商品，快去选购吧！</Typography>
                </Card>
            )}
        </Box>
    )
}
