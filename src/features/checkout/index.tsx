import { useNavigate } from '@tanstack/react-router'

import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import { cartStore } from '@/store/cartStore.ts'
import { useEffect, useState } from 'react'
import Breadcrumbs from '@/shared/components/Breadcrumbs'

import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Table, Typography } from '@mui/joy'

import type { CartItem } from '@/types/cart'

import { useTranslation } from 'react-i18next'
import { showMessage } from "@/utils/showMessage";
import { CreditCard } from "@/features/dashboard/consumer/creditCard/type.ts";
import { Address } from '../dashboard/consumer/address/type'
import { useAddresses } from '../dashboard/consumer/address/hook'
import { useCreditCards } from "@/features/dashboard/consumer/creditCard/hook.ts";

/**
 * Checkout page component
 * @returns Element
 */
export default function Checkout() {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const account = useSnapshot(userStore.account)
    const [loading, setLoading] = useState(true)
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number>(0)
    const [selectedCardId, setSelectedCardId] = useState<number>(0)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [creditCards, setCreditCards] = useState<CreditCard[]>([])
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)

    // 获取地址和信用卡数据
    const {data: addressesData, isLoading: isLoadingAddresses} = useAddresses()
    const {data: creditCardsData, isLoading: isLoadingCreditCards} = useCreditCards()

    // 从本地存储加载选择的商品
    useEffect(() => {
        const loadSelectedCartItems = () => {
            const savedItemsJson = localStorage.getItem('selectedCartItems')
            if (savedItemsJson) {
                try {
                    const savedItems = JSON.parse(savedItemsJson) as CartItem[]
                    setSelectedItems(savedItems)
                } catch (e) {
                    console.error(t('checkout.parseSelectedItemsFailed'), e)
                    setSelectedItems([])
                }
            } else {
                // 如果没有选中的商品数据，回到购物车页面
                navigate({to: '/carts'}).then(() => {
                    console.log(t('checkout.noSelectedItemsRedirect'))
                })
            }
        }
        loadSelectedCartItems()
    }, [navigate])

    // 加载地址和信用卡数据
    useEffect(() => {
        if (!isLoadingAddresses && addressesData?.addresses) {
            setAddresses(addressesData.addresses)
            // 如果有地址，设置第一个为默认选择
            if (addressesData.addresses.length > 0) {
                setSelectedAddressId(addressesData.addresses[0].id)
                setSelectedAddress(addressesData.addresses[0])
            }
        }

        if (!isLoadingCreditCards && creditCardsData?.creditCards) {
            setCreditCards(creditCardsData.creditCards)
            // 如果有信用卡，设置第一个为默认选择
            if (creditCardsData.creditCards.length > 0) {
                setSelectedCardId(creditCardsData.creditCards[0].id)
                setSelectedCard(creditCardsData.creditCards[0])
            }
        }

        // 数据加载完成后，关闭加载状态
        if (!isLoadingAddresses && !isLoadingCreditCards) {
            setLoading(false)
        }
    }, [isLoadingAddresses, addressesData, isLoadingCreditCards, creditCardsData])

    // 当地址ID变化时，更新选中的地址对象
    useEffect(() => {
        if (selectedAddressId && addresses.length > 0) {
            const address = addresses.find(addr => addr.id === selectedAddressId)
            if (address) {
                setSelectedAddress(address)
            }
        }
    }, [selectedAddressId, addresses])

    // 当信用卡ID变化时，更新选中的信用卡对象
    useEffect(() => {
        if (selectedCardId && creditCards.length > 0) {
            const card = creditCards.find(card => card.id === selectedCardId)
            if (card) {
                setSelectedCard(card)
            }
        }
    }, [selectedCardId, creditCards])

    // 创建订单
    const createCheckout = () => {
        if (!selectedAddress || !selectedCard) {
            showMessage(t('checkout.selectAddressAndPayment'), 'error')
            return
        }

        setLoading(true)
        console.log(t('checkout.requestingCheckoutAPI'), `${import.meta.env.VITE_URL}${import.meta.env.VITE_CHECKOUT_URL}`)

        fetch(`${import.meta.env.VITE_URL}${import.meta.env.VITE_CHECKOUT_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: account.id,
                firstname: account?.firstName,
                lastname: account?.lastName,
                email: account.email,
                addressId: selectedAddressId,
                creditCardId: selectedCardId,
                selectedItems: selectedItems // 添加选中的商品到请求中
            }),
        })
            .then(async (res) => {
                console.log(t('checkout.receivedResponseCode'), res.status)
                if (!res.ok) {
                    const text = await res.text()
                    console.error(t('checkout.responseContent'), text)
                    throw new Error(text || `${t('checkout.failed')}: ${res.status}`)
                }
                return res.json()
            })
            .then((data) => {
                console.log(data)
                // 清除本地存储中的选中商品
                localStorage.removeItem('selectedCartItems')

                // 如果结算成功，从购物车中移除已购买的商品
                selectedItems.forEach(item => {
                    cartStore.removeItem(item.productId).then(() => {
                        console.log(t('checkout.successRemovedItem', {productId: item.productId}))
                    })
                })

                // 显示成功消息

                showMessage(t('checkout.success'), 'success')
                // 跳转到支付页面
                window.open(data.paymentUrl, '_blank')
                // 成功后跳转到订单页面
                navigate({to: '/consumer/orders'}).then(() => {
                    console.log(t('checkout.redirectToOrders'))
                })

            })
            .catch((e) => {
                console.error(t('checkout.failed'), e)
                setLoading(false)
                showMessage(e.message || t('checkout.tryAgain'), 'error')
            })
    }

    // 计算商品小计
    const getItemSubtotal = (price: number, quantity: number) => {
        return price * quantity
    }

    // 计算选中商品的总价
    const getSelectedItemsTotalPrice = () => {
        return selectedItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
    }

    // 格式化价格显示
    const formatCurrency = (amount: number) => {
        return `¥${amount.toFixed(2)}`
    }

    // 添加信用卡选择函数
    const handleCardSelect = (cardId: number) => {
        setSelectedCardId(cardId)
    }

    // 添加地址选择函数
    const handleAddressSelect = (addressId: number) => {
        setSelectedAddressId(addressId)
    }

    // 地址渲染
    const renderAddressList = () => {
        if (addresses.length === 0) {
            return (
                <Box sx={{textAlign: 'center', p: 3}}>
                    <Typography level="body-lg" sx={{mb: 2}}>{t('addresses.noAddresses')}</Typography>
                    <Button onClick={() => navigate({to: '/consumer/addresses'})}>{t('addresses.addNew')}</Button>
                </Box>
            )
        }

        return (
            <Grid container spacing={2}>
                {addresses.map(address => (
                    <Grid xs={12} md={6} key={address.id}>
                        <Card
                            variant={selectedAddressId === address.id ? "solid" : "outlined"}
                            color={selectedAddressId === address.id ? "primary" : "neutral"}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'primary.300'
                                }
                            }}
                            onClick={() => handleAddressSelect(address.id)}
                        >
                            <CardContent>
                                <Typography level="title-md">{address.city} {t('addresses.addressLabel')}</Typography>
                                <Typography level="body-sm">{address.streetAddress}</Typography>
                                <Typography level="body-sm">
                                    {address.city}, {address.state}, {address.country}, {address.zipCode}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )
    }

    // 信用卡渲染
    const renderCardList = () => {
        if (creditCards.length === 0) {
            return (
                <Box sx={{textAlign: 'center', p: 3}}>
                    <Typography level="body-lg" sx={{mb: 2}}>{t('payment.noCards')}</Typography>
                    <Button onClick={() => navigate({to: '/consumer/creditCards'})}>{t('payment.addNew')}</Button>
                </Box>
            )
        }

        return (
            <Grid container spacing={2}>
                {creditCards.map((card: CreditCard) => {
                    return (
                        <Grid xs={12} md={6} key={card.id}>
                            <Card
                                variant={selectedCardId === card.id ? "solid" : "outlined"}
                                color={selectedCardId === card.id ? "primary" : "neutral"}
                                sx={{
                                    cursor: 'pointer',
                                    background: selectedCardId === card.id ? 'primary.600' : (
                                        card.brand === 'visa' ? 'linear-gradient(135deg, #0033a0, #00b2a9)' :
                                            card.brand === 'mastercard' ? 'linear-gradient(135deg, #ff5f00, #eb001b)' :
                                                card.brand === 'amex' ? 'linear-gradient(135deg, #108168, #1B6FA3)' :
                                                    card.brand === 'discover' ? 'linear-gradient(135deg, #ff6600, #d35400)' :
                                                        card.brand === 'unionpay' ? 'linear-gradient(135deg, #e21836, #00447c)' :
                                                            'linear-gradient(135deg, #5f6368, #3c4043)'
                                    ),
                                    color: selectedCardId === card.id ? 'white' : 'inherit',
                                    '&:hover': {
                                        borderColor: 'primary.300'
                                    }
                                }}
                                onClick={() => handleCardSelect(card.id)}
                            >
                                <CardContent>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                                        <Typography level="title-md"
                                                    sx={{color: 'white'}}>{card.name || t('payment.myCard')}</Typography>
                                    </Box>
                                    <Typography level="body-sm" sx={{color: 'white'}}>
                                        **** **** **** {card.number.slice(-4)}
                                    </Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                        <Typography level="body-sm" sx={{color: 'white'}}>{card.owner}</Typography>
                                        <Typography level="body-sm"
                                                    sx={{color: 'white'}}>{card.expMonth}/{card.expYear.slice(-2)}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'checkout': t('checkout.title')}}/>

            <Typography level="h2" sx={{mb: 3}}>{t('checkout.title')}</Typography>

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <CircularProgress size="lg"/>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* 购物车商品列表 */}
                    <Grid xs={12}>
                        <Card variant="outlined" sx={{mb: 3}}>
                            <CardContent>
                                <Typography level="h3" sx={{mb: 2}}>{t('checkout.cartItems')}</Typography>
                                <Divider sx={{my: 2}}/>

                                {selectedItems.length > 0 ? (
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th style={{width: '40%'}}>{t('checkout.productInfo')}</th>
                                            <th style={{width: '15%'}}>{t('checkout.unitPrice')}</th>
                                            <th style={{width: '15%'}}>{t('checkout.quantity')}</th>
                                            <th style={{width: '15%'}}>{t('checkout.subtotal')}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedItems.map((item) => (
                                            <tr key={item.productId}>
                                                <td>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                        {item.picture && (
                                                            <Box
                                                                component="img"
                                                                src={item.picture}
                                                                alt={item.name}
                                                                width={60}
                                                                height={60}
                                                                sx={{objectFit: 'cover', borderRadius: 'sm'}}
                                                            />
                                                        )}
                                                        <Box>
                                                            <Typography level="title-md">{item.name}</Typography>
                                                        </Box>
                                                    </Box>
                                                </td>
                                                <td>
                                                    <Typography
                                                        level="body-md">{formatCurrency(item.price || 0)}</Typography>
                                                </td>
                                                <td>
                                                    <Typography level="body-md">{item.quantity}</Typography>
                                                </td>
                                                <td>
                                                    <Typography level="body-md" color="primary">
                                                        {formatCurrency(getItemSubtotal(item.price || 0, item.quantity))}
                                                    </Typography>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Typography level="body-md" sx={{textAlign: 'center', py: 3}}>
                                        {t('checkout.emptyCart')}
                                    </Typography>
                                )}

                                {selectedItems.length > 0 && (
                                    <Box sx={{mt: 3}}>
                                        <Divider sx={{my: 2}}/>
                                        <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                            <Typography level="title-lg">
                                                {t('checkout.total')}: {formatCurrency(getSelectedItemsTotalPrice())}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 订单摘要 */}
                    <Grid xs={12} md={6}>
                        <Card variant="outlined" sx={{mb: 3}}>
                            <CardContent>
                                <Typography level="h3" sx={{mb: 2}}>{t('checkout.orderSummary')}</Typography>
                                <Divider sx={{my: 2}}/>

                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <Typography level="body-md">{t('checkout.subtotal')}</Typography>
                                    <Typography
                                        level="body-md">{formatCurrency(getSelectedItemsTotalPrice())}</Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <Typography level="body-md">{t('checkout.shipping')}</Typography>
                                    <Typography level="body-md">{formatCurrency(0)}</Typography>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <Typography level="body-md">{t('checkout.tax')}</Typography>
                                    <Typography level="body-md">{formatCurrency(0)}</Typography>
                                </Box>

                                <Divider sx={{my: 2}}/>

                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                    <Typography level="title-md">{t('checkout.total')}</Typography>
                                    <Typography level="title-md"
                                                color="primary">{formatCurrency(getSelectedItemsTotalPrice())}</Typography>
                                </Box>

                                <Box sx={{mt: 3}}>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        onClick={createCheckout}
                                        disabled={selectedItems.length === 0 || !selectedAddressId || !selectedCardId || loading}
                                    >
                                        {t('checkout.placeOrder')}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 收货地址和支付方式 */}
                    <Grid xs={12} md={6} container spacing={2}>
                        {/* 收货地址 */}
                        <Grid xs={12}>
                            <Card variant="outlined" sx={{mb: 3}}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography level="h3">{t('checkout.shippingAddress')}</Typography>
                                        <Button onClick={() => navigate({to: '/consumer/addresses'})}
                                                size="sm">{t('addresses.manage')}</Button>
                                    </Box>
                                    <Divider sx={{my: 2}}/>
                                    {renderAddressList()}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 支付方式 */}
                        <Grid xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography level="h3">{t('checkout.paymentMethod')}</Typography>
                                        <Button onClick={() => navigate({to: '/consumer/creditCards'})}
                                                size="sm">{t('payment.manage')}</Button>
                                    </Box>
                                    <Divider sx={{my: 2}}/>
                                    {renderCardList()}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}
