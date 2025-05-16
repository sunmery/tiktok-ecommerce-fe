import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useCart} from "./hook.ts";
import {Box, Button, Card, IconButton, Input, Grid, Typography, Divider, CardContent, Modal, ModalDialog, ModalClose} from "@mui/joy";
import {Add,  Delete,  Remove, ShoppingCart} from "@mui/icons-material";
import { Container } from "@mui/material";
import { showMessage } from "@/utils/showMessage";

/**
 *@returns JSXElement
 */
export default function Cart() {
    const {t} = useTranslation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<{productId: string, merchantId: string, name: string} | null>(null)

    const {
        cartItems,
        isLoading,
        removeItem: apiRemoveItem,
        updateQuantity: apiUpdateQuantity,
        clearCart: apiClearCart,
        getSelectedTotalPrice,
        getSelectedItemsCount,
        syncWithBackend
    } = useCart()

    const removeItem = (productId: string, merchantId: string) => {
        try {
            apiRemoveItem({productId, merchantId})
            showMessage(t('cart.success.itemRemoved', '商品已成功从购物车中移除'), 'success')
        } catch (err) {
            setError(t('cart.error.removeItemFailed'))
        }
    }
    
    // 打开删除确认对话框
    const openDeleteConfirm = (productId: string, merchantId: string, name: string) => {
        setItemToDelete({productId, merchantId, name})
        setDeleteConfirmOpen(true)
    }
    
    // 确认删除商品
    const confirmDelete = () => {
        if (itemToDelete) {
            removeItem(itemToDelete.productId, itemToDelete.merchantId)
            setDeleteConfirmOpen(false)
            setItemToDelete(null)
        }
    }
    
    // 取消删除
    const cancelDelete = () => {
        setDeleteConfirmOpen(false)
        setItemToDelete(null)
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

    const [clearCartConfirmOpen, setClearCartConfirmOpen] = useState(false)
    
    const handleClearCart = () => {
        try {
            apiClearCart()
            showMessage(t('cart.success.cartCleared', '购物车已清空'), 'success')
        } catch (err) {
            setError(t('cart.error.clearCartFailed'))
        }
    }
    
    // 打开清空购物车确认对话框
    const openClearCartConfirm = () => {
        setClearCartConfirmOpen(true)
    }
    
    // 确认清空购物车
    const confirmClearCart = () => {
        handleClearCart()
        setClearCartConfirmOpen(false)
    }
    
    // 取消清空购物车
    const cancelClearCart = () => {
        setClearCartConfirmOpen(false)
    }

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
        <Container maxWidth="lg" sx={{py: 4}}>
            <Typography level="h2" component="h1" sx={{mb: 4}}>
                {t('cart.title')}
            </Typography>
            
            {error && (
                <Typography color="danger" sx={{mb: 2}}>
                    {error}
                </Typography>
            )}
            
            {/* 删除确认对话框 */}
            <Modal open={deleteConfirmOpen} onClose={cancelDelete}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    aria-labelledby="delete-confirmation-title"
                    aria-describedby="delete-confirmation-description"
                >
                    <ModalClose onClick={cancelDelete} />
                    <Typography
                        id="delete-confirmation-title"
                        component="h2"
                        level="title-lg"
                        startDecorator={<Delete />}
                        sx={{ mb: 2 }}
                    >
                        {t('cart.deleteConfirmation.title', '确认删除')}
                    </Typography>
                    <Typography id="delete-confirmation-description" textColor="text.tertiary" mb={3}>
                        {t('cart.deleteConfirmation.message', `您确定要从购物车中移除 "${itemToDelete?.name}" 吗？`)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button variant="plain" color="neutral" onClick={cancelDelete}>
                            {t('cart.deleteConfirmation.cancel', '取消')}
                        </Button>
                        <Button variant="solid" color="danger" onClick={confirmDelete}>
                            {t('cart.deleteConfirmation.confirm', '确认删除')}
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
            
            {cartItems && cartItems.length > 0 ? (
                <Grid container spacing={4}>
                    <Grid xs={12} md={8}>
                        <Typography level="title-lg" sx={{mb: 2}}>
                            {t('cart.products')}
                        </Typography>
                        
                        {cartItems.map((item) => (
                            <Card key={item.productId} variant="outlined" sx={{mb: 2, overflow: 'visible'}}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid xs={12} sm={2}>
                                            <Box
                                                component="img"
                                                src={item.picture}
                                                alt={item.name}
                                                sx={{
                                                    width: '100%',
                                                    aspectRatio: '1/1',
                                                    objectFit: 'contain',
                                                    borderRadius: 'sm'
                                                }}
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={4}>
                                            <Box>
                                                <Typography level="title-md" sx={{mb: 1}}>
                                                    {item.name}
                                                </Typography>
                                                <Typography level="title-md" color="primary" fontWeight="bold">
                                                    ¥{getItemSubtotal((item.price || 0), (item.quantity || 0)).toFixed(2)}
                                                </Typography>
                                                <Button 
                                                    variant="plain" 
                                                    color="danger" 
                                                    size="sm"
                                                    onClick={() => openDeleteConfirm(item.productId, item.merchantId, item.name)}
                                                    sx={{mt: 1, p: 0}}
                                                >
                                                    {t('cart.actions.remove')}
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid xs={12} sm={2}>
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
                                                    sx={{width: '40px', textAlign: 'center'}}
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
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        
                        {/* 清空购物车确认对话框 */}
                        <Modal open={clearCartConfirmOpen} onClose={cancelClearCart}>
                            <ModalDialog
                                variant="outlined"
                                role="alertdialog"
                                aria-labelledby="clear-cart-confirmation-title"
                                aria-describedby="clear-cart-confirmation-description"
                            >
                                <ModalClose onClick={cancelClearCart} />
                                <Typography
                                    id="clear-cart-confirmation-title"
                                    component="h2"
                                    level="title-lg"
                                    startDecorator={<Delete />}
                                    sx={{ mb: 2 }}
                                >
                                    {t('cart.clearCartConfirmation.title', '确认清空购物车')}
                                </Typography>
                                <Typography id="clear-cart-confirmation-description" textColor="text.tertiary" mb={3}>
                                    {t('cart.clearCartConfirmation.message', '您确定要清空购物车吗？此操作无法撤销。')}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button variant="plain" color="neutral" onClick={cancelClearCart}>
                                        {t('cart.clearCartConfirmation.cancel', '取消')}
                                    </Button>
                                    <Button variant="solid" color="danger" onClick={confirmClearCart}>
                                        {t('cart.clearCartConfirmation.confirm', '确认清空')}
                                    </Button>
                                </Box>
                            </ModalDialog>
                        </Modal>
                        
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 3}}>
                            <Button
                                variant="outlined"
                                color="neutral"
                                onClick={() => navigate({to: '/'})}
                            >
                                {t('cart.actions.backToShop')}
                            </Button>
                            
                            <Button
                                variant="outlined"
                                color="danger"
                                onClick={openClearCartConfirm}
                                startDecorator={<Delete />}
                            >
                                {t('cart.actions.clearCart')}
                            </Button>
                        </Box>
                    </Grid>
                    
                    <Grid xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{mb: 3}}>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                        <Typography level="body-md">
                                            {t('cart.summary.total')}
                                        </Typography>
                                        <Typography level="title-md" fontWeight="bold">
                                            ¥{getSelectedTotalPrice().toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Divider sx={{my: 2}} />

                                <Button
                                    variant="solid"
                                    color="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleCheckout}
                                    disabled={getSelectedItemsCount() === 0 || loading}
                                >
                                    {loading ? t('cart.actions.processing') : '立即下单'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Card variant="outlined" sx={{p: 4, textAlign: 'center'}}>
                    <ShoppingCart sx={{fontSize: 60, mb: 2, color: 'neutral.400'}}/>
                    <Typography level="h4" sx={{mb: 2}}>
                        {t('cart.empty.title')}
                    </Typography>
                    <Typography sx={{mb: 3}}>
                        {t('cart.empty.message')}
                    </Typography>
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={() => navigate({to: '/'})}>
                        {t('cart.empty.continueShopping')}
                    </Button>
                </Card>
            )}
        </Container>
    )
}
