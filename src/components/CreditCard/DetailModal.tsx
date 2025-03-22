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
          p: 0
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
              color: 'white',
              position: 'relative'
            }}
          >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="title-md" sx={{ color: 'white' }}>{card.name || '我的卡'}</Typography>
            <Chip size="sm" variant="soft">
              {card.brand.toUpperCase()}
            </Chip>
          </Box>
          
          <Typography level="h4" sx={{ mb: 2, letterSpacing: '2px', color: 'white' }}>
            {formatCardNumber(card.number)}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography level="body-xs" sx={{ color: 'white' }}>持卡人</Typography>
              <Typography level="body-md" sx={{ color: 'white' }}>{card.owner}</Typography>
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ color: 'white' }}>有效期</Typography>
              <Typography level="body-md" sx={{ color: 'white' }}>{card.expMonth}/{card.expYear}</Typography>
            </Box>
          </Box>
          </Box>
        </CardBackground>
        
        {/* 详细信息 */}
        <Box sx={{ p: 3 }}>
          <Typography level="title-lg" sx={{ mb: 2 }}>卡片详细信息</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">卡号</Typography>
              <Typography level="body-md">{formatCardNumber(card.number)}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">安全码 (CVV)</Typography>
              <Typography level="body-md">{card.cvv}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">持卡人</Typography>
              <Typography level="body-md">{card.owner}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">有效期</Typography>
              <Typography level="body-md">{card.expMonth}/{card.expYear}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">卡片名称</Typography>
              <Typography level="body-md">{card.name || '-'}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">卡片类型</Typography>
              <Typography level="body-md">{card.type}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">发卡机构</Typography>
              <Typography level="body-md">{card.brand}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">发行国家</Typography>
              <Typography level="body-md">{card.country}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">币种</Typography>
              <Typography level="body-md">{card.currency}</Typography>
            </Grid>
            <Grid xs={6}>
              <Typography level="body-sm" color="neutral">创建时间</Typography>
              <Typography level="body-md">{formatDate(card.createdAt)}</Typography>
            </Grid>
          </Grid>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default CreditCardDetailModal
