import {Box, Chip, Divider, Grid, Modal, ModalClose, ModalDialog, Typography} from '@mui/joy'
import type {CreditCard} from '@/types/creditCards.ts'
import CardBackground from './CardBackground'
import CardDecoration from './CardDecoration'
import {useTranslation} from 'react-i18next'

interface CreditCardDetailModalProps {
    open: boolean
    onClose: () => void
    card: CreditCard | null
}

// 格式化卡号显示
const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
}

// 格式化日期显示
const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString()
}

const CreditCardDetailModal = ({open, onClose, card}: CreditCardDetailModalProps) => {
    const {t} = useTranslation();
    if (!card) return null

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                sx={{
                    maxWidth: 500,
                    overflow: 'hidden',
                    p: 0,
                    boxShadow: 'lg',
                    borderRadius: 'md'
                }}
            >
                <ModalClose/>

                {/* 卡片预览 - 使用新的背景组件 */}
                <CardBackground
                    variant={card.brand === 'visa' ? 'green' : 'purple'}
                    sx={{
                        borderRadius: '12px 12px 0 0'
                    }}
                >
                    {/* 添加装饰效果 */}
                    <CardDecoration variant={card.brand === 'visa' ? 'green' : 'purple'}/>

                    <Box
                        sx={{
                            p: 3,
                            position: 'relative',
                            zIndex: 2
                        }}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                            <Typography level="title-md" sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                            }}>{card.name || t('creditCard.myCard')}</Typography>
                            <Chip size="sm" variant="soft" sx={{bgcolor: 'rgba(255,255,255,0.2)', color: 'white'}}>
                                {card.brand.toUpperCase()}
                            </Chip>
                        </Box>

                        <Typography level="h4" sx={{
                            mb: 2,
                            letterSpacing: '2px',
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '0px 1px 3px rgba(0,0,0,0.4)'
                        }}>
                            {formatCardNumber(card.number)}
                        </Typography>

                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography level="body-xs"
                                            sx={{color: 'rgba(255,255,255,0.8)', mb: 0.5}}>{t('creditCard.cardHolder')}</Typography>
                                <Typography level="body-md" sx={{
                                    color: 'white',
                                    fontWeight: 'medium',
                                    textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                                }}>{card.owner}</Typography>
                            </Box>
                            <Box>
                                <Typography level="body-xs"
                                            sx={{color: 'rgba(255,255,255,0.8)', mb: 0.5}}>{t('creditCard.validThru')}</Typography>
                                <Typography level="body-md" sx={{
                                    color: 'white',
                                    fontWeight: 'medium',
                                    textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
                                }}>{card.expMonth}/{card.expYear}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardBackground>

                {/* 详细信息 */}
                <Box sx={{p: 3, pt: 2.5}}>
                    <Typography level="title-lg"
                                sx={{mb: 2, color: 'text.primary', fontWeight: 'bold'}}>{t('creditCard.details.title')}</Typography>
                    <Divider sx={{mb: 2.5}}/>

                    <Grid container spacing={2.5}>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.cardNumber')}</Typography>
                            <Typography level="body-md" sx={{
                                color: 'text.primary',
                                fontWeight: 'medium'
                            }}>{formatCardNumber(card.number)}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.cvv')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.cvv}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.cardHolder')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.owner}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.validThru')}</Typography>
                            <Typography level="body-md" sx={{
                                color: 'text.primary',
                                fontWeight: 'medium'
                            }}>{card.expMonth}/{card.expYear}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.cardName')}</Typography>
                            <Typography level="body-md" sx={{
                                color: 'text.primary',
                                fontWeight: 'medium'
                            }}>{card.name || '-'}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.cardType')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.type}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.issuer')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.brand}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.country')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.country}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.currency')}</Typography>
                            <Typography level="body-md"
                                        sx={{color: 'text.primary', fontWeight: 'medium'}}>{card.currency}</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography level="body-sm" sx={{color: 'text.secondary', mb: 0.5}}>{t('creditCard.details.createdTime')}</Typography>
                            <Typography level="body-md" sx={{
                                color: 'text.primary',
                                fontWeight: 'medium'
                            }}>{formatDate(card.createdTime)}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </ModalDialog>
        </Modal>
    )
}

export default CreditCardDetailModal
