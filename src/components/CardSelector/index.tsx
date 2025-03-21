import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Modal, List, ListItem, Radio, FormControl, FormLabel, Input, Stack, IconButton } from '@mui/joy';
import { CreditCard } from '@/types/creditCards';
import { useCreditCards, useUpdateCreditCard, useCreateCreditCard } from '@/hooks/useCreditCard';
import { showMessage } from '@/utils/casdoor';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface CardSelectorProps {
  selectedCardId: number;
  onCardSelect: (cardId: number) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ selectedCardId, onCardSelect }) => {
  const { data: cardsData, isLoading, error, refetch } = useCreditCards();
  const updateCardMutation = useUpdateCreditCard();
  const createCardMutation = useCreateCreditCard();
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCard, setCurrentCard] = useState<CreditCard | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState<Partial<CreditCard>>({
    number: '',
    cvv: '',
    expYear: '',
    expMonth: '',
    name: '',
    type: '',
    brand: '',
    country: ''
  });
  
  // 打开银行卡选择模态框
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
  };
  
  // 关闭模态框
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentCard(null);
    setFormData({
      number: '',
      cvv: '',
      expYear: '',
      expMonth: '',
      name: '',
      type: '',
      brand: '',
      country: ''
    });
  };
  
  // 选择银行卡
  const handleSelectCard = (card: CreditCard) => {
    onCardSelect(card.id);
    handleClose();
  };
  
  // 编辑银行卡
  const handleEditCard = (card: CreditCard) => {
    setCurrentCard(card);
    setFormData({
      id: card.id,
      number: card.number,
      cvv: card.cvv,
      expYear: card.expYear,
      expMonth: card.expMonth,
      owner: card.owner,
      name: card.name,
      type: card.type,
      brand: card.brand,
      country: card.country
    });
    setEditMode(true);
  };
  
  // 添加新银行卡
  const handleAddCard = () => {
    setCurrentCard(null);
    setFormData({
      number: '',
      cvv: '',
      expYear: '',
      expMonth: '',
      name: '',
      type: '',
      brand: '',
      country: ''
    });
    setEditMode(true);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存银行卡
  const handleSaveCard = async () => {
    try {
      // 确保必填字段已填写
      if (!formData.number || !formData.cvv || !formData.expYear || !formData.expMonth || !formData.name) {
        showMessage('请填写所有必填字段', 'error');
        return;
      }
      
      // 获取用户ID
      const owner = localStorage.getItem('userId') || '';
      
      if (currentCard) {
        // 更新现有银行卡
        await updateCardMutation.mutateAsync({
          ...formData,
          id: currentCard.id,
          owner,
          createdTime: currentCard.createdTime
        } as CreditCard);
        showMessage('银行卡更新成功', 'success');
      } else {
        // 创建新银行卡
        await createCardMutation.mutateAsync({
          ...formData,
          owner,
          createdTime: new Date().toISOString()
        } as CreditCard);
        showMessage('银行卡添加成功', 'success');
      }
      
      // 刷新银行卡列表
      refetch();
      setEditMode(false);
    } catch (error) {
      showMessage(`保存银行卡失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
    }
  };
  
  // 获取当前选中的银行卡
  const getSelectedCard = () => {
    if (!cardsData || !cardsData.credit_cards) return null;
    return cardsData.credit_cards.find(card => card.id === selectedCardId);
  };
  
  const selectedCard = getSelectedCard();
  
  // 格式化卡号显示
  const formatCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };
  
  return (
    <>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography level="h3">支付方式</Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startDecorator={selectedCard ? <EditIcon /> : <AddIcon />}
              onClick={handleOpen}
            >
              {selectedCard ? '更换银行卡' : '添加银行卡'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {selectedCard ? (
              <Box>
                <Typography level="body-md">卡号: {formatCardNumber(selectedCard.number)}</Typography>
                <Typography level="body-md">持卡人: {selectedCard.name}</Typography>
                <Typography level="body-md">有效期: {selectedCard.expMonth}/{selectedCard.expYear}</Typography>
                {selectedCard.brand && <Typography level="body-md">卡种: {selectedCard.brand}</Typography>}
              </Box>
            ) : (
              <Typography level="body-md" color="danger">请选择支付方式</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* 银行卡选择/编辑模态框 */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
            <Typography level="title-lg">
              {editMode ? (currentCard ? '编辑银行卡' : '添加新银行卡') : '选择支付方式'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {editMode ? (
            <Box sx={{ p: 2 }}>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>卡号 *</FormLabel>
                <Input 
                  name="number" 
                  value={formData.number || ''} 
                  onChange={handleInputChange} 
                  placeholder="银行卡号"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>持卡人姓名 *</FormLabel>
                <Input 
                  name="name" 
                  value={formData.name || ''} 
                  onChange={handleInputChange} 
                  placeholder="持卡人姓名"
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel>有效期月 *</FormLabel>
                  <Input 
                    name="expMonth" 
                    value={formData.expMonth || ''} 
                    onChange={handleInputChange} 
                    placeholder="MM"
                  />
                </FormControl>
                
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel>有效期年 *</FormLabel>
                  <Input 
                    name="expYear" 
                    value={formData.expYear || ''} 
                    onChange={handleInputChange} 
                    placeholder="YYYY"
                  />
                </FormControl>
              </Box>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>安全码 *</FormLabel>
                <Input 
                  name="cvv" 
                  value={formData.cvv || ''} 
                  onChange={handleInputChange} 
                  placeholder="CVV"
                  type="password"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>卡种</FormLabel>
                <Input 
                  name="brand" 
                  value={formData.brand || ''} 
                  onChange={handleInputChange} 
                  placeholder="例如: Visa, MasterCard"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>国家</FormLabel>
                <Input 
                  name="country" 
                  value={formData.country || ''} 
                  onChange={handleInputChange} 
                  placeholder="发卡国家"
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button variant="plain" color="neutral" onClick={() => setEditMode(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveCard}>
                  保存
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {isLoading ? (
                <Box sx={{ p: 2 }}>
                  <Typography>加载中...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ p: 2 }}>
                  <Typography color="danger">加载银行卡失败</Typography>
                </Box>
              ) : cardsData && cardsData.credit_cards && cardsData.credit_cards.length > 0 ? (
                <List>
                  {cardsData.credit_cards.map((card) => (
                    <ListItem 
                      key={card.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #eee',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Radio 
                          checked={selectedCardId === card.id}
                          onChange={() => handleSelectCard(card)}
                        />
                        <Box>
                          <Typography level="body-md">
                            {formatCardNumber(card.number)}
                          </Typography>
                          <Typography level="body-sm">{card.name} - {card.expMonth}/{card.expYear}</Typography>
                        </Box>
                      </Box>
                      <Button 
                        variant="plain" 
                        color="primary" 
                        onClick={() => handleEditCard(card)}
                        startDecorator={<EditIcon />}
                      >
                        编辑
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography>暂无银行卡信息</Typography>
                </Box>
              )}
              
              <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button 
                  fullWidth 
                  variant="soft" 
                  color="primary" 
                  onClick={handleAddCard}
                  startDecorator={<AddIcon />}
                >
                  添加新银行卡
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      </Modal>
    </>
  );
};

export default CardSelector;