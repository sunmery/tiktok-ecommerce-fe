import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useCart} from "./hook.ts";
import {Box, Button, Card, IconButton, Input, Table, Typography} from "@mui/joy";
import {Add, CheckBox, CheckBoxOutlineBlank, FavoriteBorder, Remove, ShoppingCart} from "@mui/icons-material";

/**
 *@returns JSXElement
 */
export default function Cart() {
    const {t} = useTranslation()
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

    const removeItem = (productId: string, merchantId: string) => {
        try {
            apiRemoveItem({productId, merchantId})
        } catch (err) {
            setError(t('cart.error.removeItemFailed'))
        }
    }

    const updateQuantity = (id: string, change: number) => {
        try {
            const item = cartItems.find((item: { productId: string }) => item.productId === id)
            if (item) {
                const newQuantity = item.quantity + change
                if (newQuantity > 0) {
                    apiUpdateQuantity({itemId: id, quantity: newQuantity})
                } else {
                    removeItem(id, item.merchantId)
                }
            }
        } catch (err) {
            setError(t('cart.error.updateQuantityFailed'))
        }
    }

    const handleClearCart = () => {
        try {
            apiClearCart()
        } catch (err) {
            setError(t('cart.error.clearCartFailed'))
        }
    }

    // 计算商品小计
    const getItemSubtotal = (price: number, quantity: number) => {
        return price * quantity
    }

    // 处理结算逻辑
    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) {
            setError(t('cart.error.emptyCartCheckout'))
            return
        }

        const selectedCount = getSelectedItemsCount()
        if (selectedCount === 0) {
            setError(t('cart.error.noItemSelected'))
            return
        }

        try {
            setLoading(true)
            setError(null)

            // 获取选中的商品
            const selectedItems = cartItems.filter(item => item.selected)

            // 先同步购物车数据到后端，确保前后端数据一致
            console.log('结算前同步购物车数据...')
            syncWithBackend(
                // 同步成功回调
                () => {
                    console.log('购物车同步成功，准备跳转到结算页面')
                    // 只将选中的商品保存到本地存储，用于结算页面使用
                    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems))

                    // 同步成功后跳转到结算页面
                    navigate({to: '/checkout'}).then(() => {
                        console.log('已跳转到结算页面')
                    }).catch(navError => {
                        console.error('跳转到结算页面失败:', navError)
                        setError(t('cart.error.navigationFailed'))
                        setLoading(false)
                    })
                },
                // 同步失败回调
                (error: any) => {
                    console.error('购物车同步失败:', error)
                    setError(t('cart.error.syncFailed'))
                    setLoading(false)
                }
            ).then((r: any) => {
                console.log("同步购物车数据完成", r)
            })
        } catch (err) {
            console.error('结算过程发生错误:', err)
            setError(t('cart.error.checkoutFailed'))
            setLoading(false)
        }
    }

    if (loading) {
        return <div>{t('cart.loading')}</div>
    }

    if (isLoading) {
        return <div>{t('cart.fetchingData')}</div>
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 删除了面包屑导航 */}

            <Typography level="h2" sx={{mb: 3}}>{t('cart.title')}</Typography>
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
                                        {isAllSelected() ? <CheckBox/> : <CheckBoxOutlineBlank/>}
                                    </IconButton>
                                </th>
                                <th style={{width: '25%'}}>{t('cart.table.productInfo')}</th>
                                <th style={{width: '15%'}}>{t('cart.table.unitPrice')}</th>
                                <th style={{width: '20%'}}>{t('cart.table.quantity')}</th>
                                <th style={{width: '15%'}}>{t('cart.table.subtotal')}</th>
                                <th style={{width: '20%'}}>{t('cart.table.actions')}</th>
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
                                            {item.selected ? <CheckBox/> : <CheckBoxOutlineBlank/>}
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
                                                sx={{width: '60px', textAlign: 'center'}}
                                                onChange={(e) => {
                                                    const value = Math.max(1, parseInt(e.target.value) || 1);
                                                    apiUpdateQuantity({itemId: item.productId, quantity: value});
                                                }}
                                                onBlur={(e) => {
                                                    const value = Math.max(1, parseInt(e.target.value) || 1);
                                                    apiUpdateQuantity({itemId: item.productId, quantity: value});
                                                }}
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                    if (e.key === 'Enter') {
                                                        const value = Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1);
                                                        apiUpdateQuantity({itemId: item.productId, quantity: value});
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
                                            onClick={() => {
                                                console.log("item.productId, item.merchantId", item.productId, item.merchantId)
                                                removeItem(item.productId, item.merchantId)
                                            }}
                                        >
                                            {t('cart.button.remove')}
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
                            {t('cart.button.clearCart')}
                        </Button>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Typography level="h4">
                                {t('cart.total')}: ¥{getSelectedTotalPrice().toFixed(2)}
                            </Typography>
                            <Typography level="body-sm" sx={{ml: 1}}>
                                {t('cart.selectedItems', {count: getSelectedItemsCount()})}
                            </Typography>
                            <Button
                                size="lg"
                                color="primary"
                                variant="solid"
                                startDecorator={<ShoppingCart/>}
                                onClick={handleCheckout}
                                disabled={!cartItems || cartItems.length === 0 || getSelectedItemsCount() === 0}
                            >
                                {t('cart.button.checkout')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Card variant="outlined" sx={{p: 4, textAlign: 'center'}}>
                    <Typography level="h3" sx={{mb: 2}}>{t('cart.empty')}</Typography>
                    <Typography sx={{mb: 3}}>{t('cart.goShopping')}</Typography>
                </Card>
            )}
        </Box>
    )
}
