import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Option,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Sheet,
  Grid,
  Chip
} from '@mui/joy'
import { Delete, Add } from '@mui/icons-material'
import { useCreditCards, useCreateCreditCard, useDeleteCreditCard } from '@/hooks/useCreditCard'
import type { CreditCard } from '@/types/creditCards'
import Breadcrumbs from '@/components/Breadcrumbs'
import CreditCardDetailModal from '@/components/CreditCard/DetailModal.tsx'
// 移除 framer-motion 导入
// cardBackgrounds已被移除，使用内联样式替代

export const Route = createLazyFileRoute('/credit_cards/')({  
  component: RouteComponent,
})

/**
 * 信用卡管理页面组件
 * @returns Element
 */
function RouteComponent() {
  // 获取信用卡列表数据
  const { data: { creditCards } = { creditCards: [] }, isLoading, isError, error, refetch } = useCreditCards()
  
  // 创建和删除信用卡的mutation hooks
  const createCreditCardMutation = useCreateCreditCard()
  const deleteCreditCardMutation = useDeleteCreditCard()
  
  // 模态框状态
  const [open, setOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  
  // 表单数据
  const [formData, setFormData] = useState<CreditCard>({
    createdTime: "",
    id: 0,
    number: '',
    cvv: '',
    expYear: '',
    expMonth: '',
    owner: '',
    name: '',
    type: '',
    brand: '',
    country: '',
    currency: ''
  })
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
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
      number: '',
      cvv: '',
      expYear: '',
      expMonth: '',
      owner: '',
      name: '',
      type: 'credit',
      brand: 'visa',
      country: 'CN',
      currency: '',
      createdTime: ''
    })
    setOpen(true)
  }
  
  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    createCreditCardMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false)
        refetch()
      }
    })
  }
  
  // 删除信用卡
  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这张卡吗？')) {
      deleteCreditCardMutation.mutate({ id }, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  // 格式化卡号显示
  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
      <Breadcrumbs />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h2">我的银行卡</Typography>
        <Button
          startDecorator={<Add />}
          onClick={handleOpenCreateModal}
          color="primary"
        >
          添加新卡
        </Button>
      </Box>
      
      {isLoading ? (
        <Typography>加载中...</Typography>
      ) : isError ? (
        <Typography color="danger">
          加载失败: {error instanceof Error ? error.message : '未知错误'}
        </Typography>
      ) : !creditCards || creditCards.length === 0 ? (
        <Sheet sx={{ p: 4, textAlign: 'center', borderRadius: 'md' }}>
          <Typography level="body-lg" sx={{ mb: 2 }}>您还没有添加任何银行卡</Typography>
          <Button
            startDecorator={<Add />}
            onClick={handleOpenCreateModal}
            color="primary"
          >
            添加新卡
          </Button>
        </Sheet>
      ) : (
        <Grid container spacing={2}>
          {creditCards.map((card, index) => (
            <Grid key={card.id} xs={12} sm={6} md={4}>
              <div
                style={{
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  perspective: '1000px'
                }}
              >
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
                    overflow: 'hidden',
                    cursor: 'pointer' // 添加指针样式，提示可点击
                  }}
                  onClick={() => {
                    setSelectedCard(card);
                    setDetailOpen(true);
                  }}
                >
                  <CardContent>
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
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      variant="soft"
                      color="danger"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleDelete(card.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* 创建模态框 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">
            添加新卡
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>卡号</FormLabel>
                <Input
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="请输入卡号"
                />
              </FormControl>
              
              <FormControl required>
                <FormLabel>持卡人姓名</FormLabel>
                <Input
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  placeholder="请输入持卡人姓名"
                />
              </FormControl>
              
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <FormControl required>
                    <FormLabel>有效期月</FormLabel>
                    <Select
                      value={formData.expMonth}
                      onChange={(_, value) => handleSelectChange('expMonth', value)}
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0')
                        return <Option key={month} value={month}>{month}</Option>
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl required>
                    <FormLabel>有效期年</FormLabel>
                    <Select
                      value={formData.expYear}
                      onChange={(_, value) => handleSelectChange('expYear', value)}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString()
                        return <Option key={year} value={year}>{year}</Option>
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <FormControl required>
                <FormLabel>安全码 (CVV)</FormLabel>
                <Input
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="请输入安全码"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>卡名称</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="为您的卡取个名字（可选）"
                />
              </FormControl>
              
              <FormControl required>
                <FormLabel>卡类型</FormLabel>
                <Select
                  value={formData.type}
                  onChange={(_, value) => handleSelectChange('type', value)}
                >
                  <Option value="credit">信用卡</Option>
                  <Option value="debit">借记卡</Option>
                </Select>
              </FormControl>
              
              <FormControl required>
                <FormLabel>卡品牌</FormLabel>
                <Select
                  value={formData.brand}
                  onChange={(_, value) => handleSelectChange('brand', value)}
                >
                  <Option value="visa">Visa</Option>
                  <Option value="mastercard">MasterCard</Option>
                  <Option value="amex">American Express</Option>
                  <Option value="discover">Discover</Option>
                  <Option value="unionpay">银联</Option>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit" loading={createCreditCardMutation.isPending}>
                  添加
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* 详情模态框 */}
      <CreditCardDetailModal 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
        card={selectedCard} 
      />
    </Box>
  )
}
