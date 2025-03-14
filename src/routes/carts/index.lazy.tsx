import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {FavoriteBorder, Add, Remove, ShoppingCart} from '@mui/icons-material'
import type {ModalDialogProps} from '@mui/joy'
import {
    Box,
    Chip,
    Table,
    Button,
    Typography,
    IconButton,
    Card,
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

    const {cartItems, isLoading, removeItem: apiRemoveItem, updateQuantity: apiUpdateQuantity, clearCart: apiClearCart} = useCart()

    const removeItem = (id: string) => {
        try {
            apiRemoveItem(Number(id))
        } catch (err) {
            setError('删除商品失败，请稍后重试')
        }
    }

    const updateQuantity = (id: string, change: number) => {
        try {
            const item = cartItems.find(item => item.id === id)
            if (item) {
                const newQuantity = item.quantity + change
                if (newQuantity > 0) {
                    apiUpdateQuantity({itemId: Number(id), quantity: newQuantity})
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

    // 定义结账对话框的变体类型
    const [variant, setVariant] = useState<
        ModalDialogProps['variant'] | undefined
    >(undefined)

    // 计算商品小计
    const getItemSubtotal = (price: number, quantity: number) => {
        return price * quantity
    }

    // 获取购物车总价
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)
    }

    // 处理结算逻辑
    const handleCheckout = () => {
        if (!cartItems || cartItems.length === 0) {
            setError('购物车为空，无法结算')
            return
        }

        try {
            setLoading(true)
            // 跳转到结算页面
            navigate({to: '/checkout/'})
        } catch (err) {
            setError('跳转到结算页面失败，请稍后重试')
            setLoading(false)
        }
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
                                <th style={{width: '30%'}}>商品信息</th>
                                <th style={{width: '15%'}}>单价</th>
                                <th style={{width: '20%'}}>数量</th>
                                <th style={{width: '15%'}}>小计</th>
                                <th style={{width: '20%'}}>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                            {item.images && item.images.length > 0 && (
                                                <Box
                                                    component="img"
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    sx={{objectFit: 'cover', borderRadius: 'sm'}}
                                                />
                                            )}
                                            <Box>
                                                <Typography level="title-md">{item.name}</Typography>
                                                {item.description && (
                                                    <Typography level="body-sm" noWrap sx={{maxWidth: 250}}>
                                                        {item.description}
                                                    </Typography>
                                                )}
                                                {item.categories && item.categories.length > 0 && (
                                                    <Box
                                                        sx={{display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap'}}>
                                                        {item.categories.map((category, index) => (
                                                            <Chip
                                                                key={index}
                                                                size="sm"
                                                                variant="soft"
                                                                color="primary"
                                                            >
                                                                {category}
                                                            </Chip>
                                                        ))}
                                                    </Box>
                                                )}
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
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                <Remove/>
                                            </IconButton>
                                            <Typography sx={{minWidth: '40px', textAlign: 'center'}}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                onClick={() => updateQuantity(item.id, 1)}
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
                                            onClick={() => removeItem(item.id)}
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
                                总计: ¥{(getTotalPrice() || 0).toFixed(2)}
                            </Typography>
                            <Button
                                size="lg"
                                color="primary"
                                variant="solid"
                                startDecorator={<ShoppingCart/>}
                                onClick={handleCheckout}
                                disabled={!cartItems || cartItems.length === 0}
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
