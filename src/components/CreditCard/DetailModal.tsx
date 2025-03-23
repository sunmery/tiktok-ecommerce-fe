import { Modal, ModalDialog, ModalClose, Typography, Box, Stack, Divider, Grid, Card, CardContent, Chip } from '@mui/joy'
import type { CreditCard } from '@/types/creditCards.ts'
import CardBackground from './CardBackground'
import CardDecoration from './CardDecoration'

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

const CreditCardDetailModal = ({ open, onClose, card }: CreditCardDetailModalProps) => {
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
        <ModalClose />
        
        {/* 卡片预览 - 使用新的背景组件 */}
        <CardBackground 
          variant={card.brand === 'visa' ? 'green' : 'purple'}
          sx={{
            borderRadius: '12px 12px 0 0'
          }}
        >
          {/* 添加装饰效果 */}
          <CardDecoration variant={card.brand === 'visa' ? 'green' : 'purple'} />
          
          <Box
            sx={{
              p: 3,
              position: 'relative',
              zIndex: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography level="title-md" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{card.name || '我的卡'}</Typography>
              <Chip size="sm" variant="soft" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {card.brand.toUpperCase()}
              </Chip>
            </Box>
            
            <Typography level="h4" sx={{ mb: 2, letterSpacing: '2px', color: 'white', fontWeight: 'bold', textShadow: '0px 1px 3px rgba(0,0,0,0.4)' }}>
              {formatCardNumber(card.number)}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>持卡人</Typography>
                <Typography level="body-md" sx={{ color: 'white', fontWeight: 'medium', textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{card.owner}</Typography>
              </Box>
              <Box>
                <Typography level="body-xs" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>有效期</Typography>
                <Typography level="body-md" sx={{ color: 'white', fontWeight: 'medium', textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>{card.expMonth}/{card.expYear}</Typography>
              </Box>
            </Box>
          </Box>
        </CardBackground>
        
        {/* 详细信息 */}
        <Box sx={{ p: 3, pt: 2.5 }}>
          <Typography level="title-lg" sx={{ mb: 2, color: 'text.primary', fontWeight: 'bold' }}>卡片详细信息</Typography>
          <Divider sx={{ mb: 2.5 }} />
          
          <Grid container spacing={2.5}>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>卡号</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{formatCardNumber(card.number)}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>安全码 (CVV)</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.cvv}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>持卡人</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.owner}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>有效期</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.expMonth}/{card.expYear}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>卡片名称</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.name || '-'}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>卡片类型</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.type}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>发卡机构</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.brand}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>发行国家</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.country}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>币种</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{card.currency}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 0.5 }}>创建时间</Typography>
              <Typography level="body-md" sx={{ color: 'text.primary', fontWeight: 'medium' }}>{formatDate(card.createdAt)}</Typography>
            </Grid>
          </Grid>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default CreditCardDetailModal
