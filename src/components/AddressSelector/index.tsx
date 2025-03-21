import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Modal, List, ListItem, Radio, FormControl, FormLabel, Input, Stack, IconButton } from '@mui/joy';
import { Address } from '@/types/addresses';
import { useAddresses, useUpdateAddress, useCreateAddress } from '@/hooks/useUserAddress';
import { showMessage } from '@/utils/casdoor';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface AddressSelectorProps {
  selectedAddressId: number;
  onAddressSelect: (addressId: number) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ selectedAddressId, onAddressSelect }) => {
  const { data: addressesData, isLoading, error, refetch } = useAddresses();
  const updateAddressMutation = useUpdateAddress();
  const createAddressMutation = useCreateAddress();
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState<Partial<Address>>({
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  
  // 打开地址选择模态框
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
  };
  
  // 关闭模态框
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setCurrentAddress(null);
    setFormData({
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    });
  };
  
  // 选择地址
  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address.id);
    handleClose();
  };
  
  // 编辑地址
  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setFormData({
      id: address.id,
      userId: address.userId,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode
    });
    setEditMode(true);
  };
  
  // 添加新地址
  const handleAddAddress = () => {
    setCurrentAddress(null);
    setFormData({
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
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
  
  // 保存地址
  const handleSaveAddress = async () => {
    try {
      // 确保必填字段已填写
      if (!formData.streetAddress || !formData.city || !formData.state || !formData.country) {
        showMessage('请填写所有必填字段', 'error');
        return;
      }
      
      // 获取用户ID
      const userId = localStorage.getItem('userId') || '';
      
      if (currentAddress) {
        // 更新现有地址
        await updateAddressMutation.mutateAsync({
          ...formData,
          id: currentAddress.id,
          userId
        } as Address);
        showMessage('地址更新成功', 'success');
      } else {
        // 创建新地址
        await createAddressMutation.mutateAsync({
          ...formData,
          userId
        } as Address);
        showMessage('地址添加成功', 'success');
      }
      
      // 刷新地址列表
      refetch();
      setEditMode(false);
    } catch (error) {
      showMessage(`保存地址失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
    }
  };
  
  // 获取当前选中的地址
  const getSelectedAddress = () => {
    if (!addressesData || !addressesData.addresses) return null;
    return addressesData.addresses.find(addr => addr.id === selectedAddressId);
  };
  
  const selectedAddress = getSelectedAddress();
  
  return (
    <>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography level="h3">收货信息</Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              startDecorator={selectedAddress ? <EditIcon /> : <AddIcon />}
              onClick={handleOpen}
            >
              {selectedAddress ? '更换地址' : '添加地址'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {selectedAddress ? (
              <Box>
                <Typography level="body-md">收货人: {selectedAddress.name || '未设置'}</Typography>
                <Typography level="body-md">电话: {selectedAddress.phone || '未设置'}</Typography>
                <Typography level="body-md">
                  地址: {selectedAddress.country} {selectedAddress.state} {selectedAddress.city} {selectedAddress.streetAddress}
                </Typography>
                <Typography level="body-md">邮编: {selectedAddress.zipCode}</Typography>
              </Box>
            ) : (
              <Typography level="body-md" color="danger">请选择收货地址</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* 地址选择/编辑模态框 */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
            <Typography level="title-lg">
              {editMode ? (currentAddress ? '编辑地址' : '添加新地址') : '选择收货地址'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {editMode ? (
            <Box sx={{ p: 2 }}>
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>街道地址 *</FormLabel>
                <Input 
                  name="streetAddress" 
                  value={formData.streetAddress || ''} 
                  onChange={handleInputChange} 
                  placeholder="详细街道地址"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>城市 *</FormLabel>
                <Input 
                  name="city" 
                  value={formData.city || ''} 
                  onChange={handleInputChange} 
                  placeholder="城市"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>省/州 *</FormLabel>
                <Input 
                  name="state" 
                  value={formData.state || ''} 
                  onChange={handleInputChange} 
                  placeholder="省/州"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>国家 *</FormLabel>
                <Input 
                  name="country" 
                  value={formData.country || ''} 
                  onChange={handleInputChange} 
                  placeholder="国家"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>邮政编码</FormLabel>
                <Input 
                  name="zipCode" 
                  value={formData.zipCode || ''} 
                  onChange={handleInputChange} 
                  placeholder="邮政编码"
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button variant="plain" color="neutral" onClick={() => setEditMode(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveAddress}>
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
                  <Typography color="danger">加载地址失败</Typography>
                </Box>
              ) : addressesData && addressesData.addresses && addressesData.addresses.length > 0 ? (
                <List>
                  {addressesData.addresses.map((address) => (
                    <ListItem 
                      key={address.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #eee',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Radio 
                          checked={selectedAddressId === address.id}
                          onChange={() => handleSelectAddress(address)}
                        />
                        <Box>
                          <Typography level="body-md">
                            {address.country} {address.state} {address.city}
                          </Typography>
                          <Typography level="body-sm">{address.streetAddress}</Typography>
                        </Box>
                      </Box>
                      <Button 
                        variant="plain" 
                        color="primary" 
                        onClick={() => handleEditAddress(address)}
                        startDecorator={<EditIcon />}
                      >
                        编辑
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography>暂无地址信息</Typography>
                </Box>
              )}
              
              <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button 
                  fullWidth 
                  variant="soft" 
                  color="primary" 
                  onClick={handleAddAddress}
                  startDecorator={<AddIcon />}
                >
                  添加新地址
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      </Modal>
    </>
  );
};

export default AddressSelector;