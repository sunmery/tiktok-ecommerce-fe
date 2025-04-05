import {createLazyFileRoute} from '@tanstack/react-router'
import {ChangeEvent, FormEvent, useState} from 'react'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    Option,
    Select,
    Sheet,
    Stack,
    Typography
} from '@mui/joy'
import {Add, Delete} from '@mui/icons-material'
import {useCreateCreditCard, useCreditCards, useDeleteCreditCard} from '@/hooks/useCreditCard'
import type {CreditCard} from '@/types/creditCards'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import CreditCardDetailModal from '@/components/CreditCard/DetailModal.tsx'
import CardBackground from '@/components/CreditCard/CardBackground.tsx'
import CardDecoration from '@/components/CreditCard/CardDecoration.tsx'
import {useTranslation} from 'react-i18next'

export const Route = createLazyFileRoute('/credit_cards/')({
    component: RouteComponent,
})

/**
 * 信用卡管理页面组件
 * @returns Element
 */
function RouteComponent() {
    const {t} = useTranslation()
    // 获取信用卡列表数据
    const {data: {creditCards} = {creditCards: []}, isLoading, isError, error, refetch} = useCreditCards()

    // 创建和删除信用卡的mutation hooks
    const createCreditCardMutation = useCreateCreditCard()
    const deleteCreditCardMutation = useDeleteCreditCard()

    // 模态框状态
    const [open, setOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)

    // 表单数据
    const [formData, setFormData] = useState<CreditCard>({
        id: 0,
        createdTime: "",
        number: '0123-4567-8910-3456',
        cvv: '1234',
        expYear: '2025',
        expMonth: '12',
        owner: '测试用户',
        name: '广发银行卡',
        type: '信用卡',
        brand: '广发银行',
        country: '中国',
        currency: 'CNY'
    })

    // 处理表单输入变化
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // 处理下拉选择变化
    const handleSelectChange = (name: string, value: string | null) => {
        if (value) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    // 打开创建模态框
    const handleOpenCreateModal = () => {
        setFormData({
            id: 0,
            createdTime: "",
            number: '0123-4567-8910-3456',
            cvv: '1234',
            expYear: '2025',
            expMonth: '12',
            owner: '测试用户',
            name: '广发银行卡',
            type: '信用卡',
            brand: '广发银行',
            country: '中国',
            currency: 'CNY'
        })
        setOpen(true)
    }

    // 提交表单
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        createCreditCardMutation.mutate(formData, {
            onSuccess: () => {
                setOpen(false)
                refetch().then(r => {
                    if (r?.data?.creditCards?.length) {
                        setSelectedCard(r.data.creditCards[0])
                        setDetailOpen(true)
                    }
                }).catch(e => {
                    console.error(e)
                })
            }
        })
    }

    // 删除信用卡
    const handleDelete = (id: number) => {
        if (window.confirm(t('payment.deleteConfirm'))) {
            deleteCreditCardMutation.mutate({id}, {
                onSuccess: () => {
                    refetch().then(r => {
                        if (r?.data?.creditCards?.length) {
                            setSelectedCard(r.data.creditCards[0])
                            setDetailOpen(true)
                        }
                    }).catch(e => {
                        console.error(e)
                    })
                }
            })
        }
    }

    // 格式化卡号显示
    const formatCardNumber = (number: string) => {
        return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            <Breadcrumbs pathMap={{'credit_cards': t('payment.title')}}/>

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography level="h2">{t('payment.title')}</Typography>
                <Button
                    startDecorator={<Add/>}
                    onClick={handleOpenCreateModal}
                    color="primary"
                >
                    {t('payment.addNew')}
                </Button>
            </Box>

            {isLoading ? (
                <Typography>{t('loading')}</Typography>
            ) : isError ? (
                <Typography color="danger">
                    {t('payment.loadFailed')}: {error instanceof Error ? error.message : t('error.unknown')}
                </Typography>
            ) : !creditCards || creditCards.length === 0 ? (
                <Sheet sx={{p: 4, textAlign: 'center', borderRadius: 'md'}}>
                    <Typography level="body-lg" sx={{mb: 2}}>{t('payment.noCards')}</Typography>
                    <Button
                        startDecorator={<Add/>}
                        onClick={handleOpenCreateModal}
                        color="primary"
                    >
                        {t('payment.addNew')}
                    </Button>
                </Sheet>
            ) : (
                <Grid container spacing={2}>
                    {creditCards.map((card, index) => {
                        // 为每张卡片分配不同的背景变体
                        // 使用索引来交替显示不同的背景样式
                        const bgVariant = index % 3 === 0 ? 'green' :
                            index % 3 === 1 ? 'purple' : 'default';

                        return (
                            <Grid key={card.id} xs={12} sm={6} md={4}>
                                <div
                                    style={{
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        perspective: '1000px',
                                        borderRadius: '12px',
                                        cursor: 'pointer' // 添加指针样式，提示可点击
                                    }}
                                    onClick={() => {
                                        setSelectedCard(card);
                                        setDetailOpen(true);
                                    }}
                                >
                                    {bgVariant === 'default' ? (
                                        // 默认样式使用原有的品牌渐变
                                        <Card
                                            sx={{
                                                height: '100%',
                                                background: card.brand === 'visa' ? 'linear-gradient(135deg, #0033a0, #00b2a9)' :
                                                    card.brand === 'mastercard' ? 'linear-gradient(135deg, #ff5f00, #eb001b)' :
                                                        card.brand === 'amex' ? 'linear-gradient(135deg, #108168, #1B6FA3)' :
                                                            card.brand === 'discover' ? 'linear-gradient(135deg, #ff6600, #d35400)' :
                                                                card.brand === 'unionpay' ? 'linear-gradient(135deg, #e21836, #00447c)' :
                                                                    'linear-gradient(135deg, #5f6368, #3c4043)',
                                                color: 'white',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                                                    <Typography level="title-md"
                                                                sx={{color: 'white'}}>{card.name || t('payment.myCard')}</Typography>
                                                    <Chip size="sm" variant="soft">
                                                        {card.brand.toUpperCase()}
                                                    </Chip>
                                                </Box>

                                                <Typography level="h4"
                                                            sx={{mb: 2, letterSpacing: '2px', color: 'white'}}>
                                                    {formatCardNumber(card.number)}
                                                </Typography>

                                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <Box>
                                                        <Typography level="body-xs"
                                                                    sx={{color: 'white'}}>{t('payment.cardHolder')}</Typography>
                                                        <Typography level="body-md"
                                                                    sx={{color: 'white'}}>{card.owner}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography level="body-xs"
                                                                    sx={{color: 'white'}}>{t('payment.expiryDate')}</Typography>
                                                        <Typography level="body-md"
                                                                    sx={{color: 'white'}}>{card.expYear}/{card.expMonth}</Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{justifyContent: 'flex-end'}}>
                                                <IconButton
                                                    variant="soft"
                                                    color="danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 阻止事件冒泡
                                                        handleDelete(card.id);
                                                    }}
                                                >
                                                    <Delete/>
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    ) : (
                                        // 使用新的背景组件
                                        <CardBackground variant={bgVariant}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    background: 'transparent',
                                                    color: 'white',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                                                        <Typography
                                                            level="title-md">{card.name || t('payment.myCard')}</Typography>
                                                        <Chip size="sm" variant="soft">
                                                            {card.brand.toUpperCase()}
                                                        </Chip>
                                                    </Box>

                                                    <Typography level="h4" sx={{mb: 2, letterSpacing: '2px'}}>
                                                        {formatCardNumber(card.number)}
                                                    </Typography>

                                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                        <Box>
                                                            <Typography
                                                                level="body-xs">{t('payment.cardHolder')}</Typography>
                                                            <Typography level="body-md">{card.owner}</Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                level="body-xs">{t('payment.expiryDate')}</Typography>
                                                            <Typography
                                                                level="body-md">{card.expMonth}/{card.expYear}</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                                <CardDecoration/>
                                                <CardActions sx={{justifyContent: 'flex-end'}}>
                                                    <IconButton
                                                        variant="soft"
                                                        color="danger"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // 阻止事件冒泡
                                                            handleDelete(card.id);
                                                        }}
                                                    >
                                                        <Delete/>
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        </CardBackground>
                                    )}
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* 银行卡详情模态框 */}
            {selectedCard && (
                <CreditCardDetailModal
                    open={detailOpen}
                    onClose={() => setDetailOpen(false)}
                    card={selectedCard}
                />
            )}

            {/* 创建/编辑银行卡模态框 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog sx={{maxWidth: 500, width: '100%'}}>
                    <ModalClose/>
                    <Typography level="h4" mb={2}>
                        {t('payment.addNew')}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormControl required>
                                <FormLabel>{t('payment.cardHolder')}</FormLabel>
                                <Input
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.cardHolderPlaceholder')}
                                />
                            </FormControl>

                            <FormControl required>
                                <FormLabel>{t('payment.cardName')}</FormLabel>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.cardNamePlaceholder')}
                                />
                            </FormControl>

                            <FormControl required>
                                <FormLabel>{t('payment.cardNumber')}</FormLabel>
                                <Input
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.currencyPlaceholder')}
                                />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>{t('payment.type')}</FormLabel>
                                <Input
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.type')}
                                />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>{t('payment.currency')}</FormLabel>
                                <Input
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.currency')}
                                />
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl required>
                                        <FormLabel>{t('payment.expiryMonth')}</FormLabel>
                                        <Select
                                            name="expMonth"
                                            value={formData.expMonth}
                                            onChange={(_, value) => handleSelectChange('expMonth', value)}
                                            placeholder={t('payment.monthPlaceholder')}
                                        >
                                            {Array.from({length: 12}, (_, i) => {
                                                const month = (i + 1).toString().padStart(2, '0');
                                                return (
                                                    <Option key={month} value={month}>
                                                        {month}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl required>
                                        <FormLabel>{t('payment.expiryYear')}</FormLabel>
                                        <Select
                                            name="expYear"
                                            value={formData.expYear}
                                            onChange={(_, value) => handleSelectChange('expYear', value)}
                                            placeholder={t('payment.yearPlaceholder')}
                                        >
                                            {Array.from({length: 10}, (_, i) => {
                                                const year = (new Date().getFullYear() + i).toString();
                                                return (
                                                    <Option key={year} value={year}>
                                                        {year}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <FormControl required>
                                <FormLabel>{t('payment.cvv')}</FormLabel>
                                <Input
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    placeholder={t('payment.cvvPlaceholder')}
                                />
                            </FormControl>

                            <FormControl required>
                                <FormLabel>{t('payment.cardBrand')}</FormLabel>
                                <Select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={(_, value) => handleSelectChange('brand', value)}
                                >
                                    <Option value="visa">Visa</Option>
                                    <Option value="mastercard">Mastercard</Option>
                                    <Option value="amex">American Express</Option>
                                    <Option value="discover">Discover</Option>
                                    <Option value="unionpay">UnionPay</Option>
                                </Select>
                            </FormControl>

                            <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2}}>
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    onClick={() => setOpen(false)}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    loading={createCreditCardMutation.isPending}
                                >
                                    {t('save')}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Box>
    )
}
