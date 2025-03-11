import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  Sheet,
  Modal,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Snackbar,
  Alert,
  IconButton,
  Divider
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useUserAddress'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import type { Address } from '@/types/addresses'

export const Route = createLazyFileRoute('/addresses/')({ 
  component: AddressesRoute,
})

function AddressesRoute() {
  const { account } = useSnapshot(userStore)
  const { data: addressesData, isLoading, isError, refetch } = useAddresses()
  const createAddressMutation = useCreateAddress()
  const updateAddressMutation = useUpdateAddress()
  const deleteAddressMutation = useDeleteAddress()
  
  const [open, setOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Address>({
    id: 0,
    userId: account.id || '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  })
  
  // 重置表单数据
  const resetForm = () => {
    setFormData({
      id: 0,
      userId: account.id || '',
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    })
  }
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  // 打开新增地址模态框
  const handleAddAddress = () => {
    setEditAddress(null)
    resetForm()
    setOpen(true)
  }

  // 打开编辑地址模态框
  const handleEditAddress = (address: Address) => {
    setEditAddress(address)
    setFormData({
      ...address
    })
    setOpen(true)
  }

  // 处理删除地址
  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddressMutation.mutateAsync({
        addressesId: addressId,
        userId: account.id || ''
      })
      
      setSnackbar({
        open: true,
        message: '地址删除成功',
        severity: 'success'
      })
      
      // 刷新地址列表
      refetch()
    } catch (error) {
      console.error('删除地址失败:', error)
      setSnackbar({
        open: true,
        message: '删除地址失败，请稍后重试',
        severity: 'error'
      })
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editAddress) {
        // 更新地址
        await updateAddressMutation.mutateAsync(formData)
        setSnackbar({
          open: true,
          message: '地址更新成功',
          severity: 'success'
        })
      } else {
        // 创建新地址
        await createAddressMutation.mutateAsync(formData)
        setSnackbar({
          open: true,
          message: '地址创建成功',
          severity: 'success'
        })
      }
      
      setOpen(false)
      // 刷新地址列表
      refetch()
    } catch (error) {
      console.error('保存地址失败:', error)
      setSnackbar({
        open: true,
        message: '保存地址失败，请稍后重试',
        severity: 'error'
      })
    }
  }

  return (
    <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
      {/* 面包屑导航 */}
      <Breadcrumbs pathMap={{ 'addresses': '地址管理' }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography level="h2">地址管理</Typography>
        <Button
          startDecorator={<AddIcon />}
          onClick={handleAddAddress}
        >
          添加新地址
        </Button>
      </Box>
      
      {isLoading ? (
        <Typography>加载中...</Typography>
      ) : isError ? (
        <Typography color="danger">加载地址数据失败，请刷新页面重试</Typography>
      ) : addressesData?.addresses && addressesData.addresses.length > 0 ? (
        <Grid container spacing={2}>
          {addressesData.addresses.map((address) => (
            <Grid xs={12} md={6} lg={4} key={address.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography level="title-lg">{address.city} 地址</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 0.5 }}>详细地址:</Typography>
                    <Typography>{address.streetAddress}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 0.5 }}>城市/州/国家:</Typography>
                    <Typography>{address.city}, {address.state}, {address.country}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 0.5 }}>邮政编码:</Typography>
                    <Typography>{address.zipCode}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <IconButton
                      variant="outlined"
                      color="neutral"
                      onClick={() => handleEditAddress(address)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      variant="outlined"
                      color="danger"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <LocationOnIcon sx={{ fontSize: 60, color: 'neutral.400', mb: 2 }} />
          <Typography level="h3" sx={{ mb: 2 }}>暂无地址信息</Typography>
          <Typography sx={{ mb: 3 }}>您还没有添加任何地址，点击"添加新地址"按钮创建一个新地址</Typography>
          <Button
            startDecorator={<AddIcon />}
            onClick={handleAddAddress}
          >
            添加新地址
          </Button>
        </Card>
      )}
      
      {/* 地址表单模态框 */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>{editAddress ? '编辑地址' : '添加新地址'}</Typography>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl required>
                    <FormLabel>详细地址</FormLabel>
                    <Input
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      placeholder="街道、门牌号等"
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl required>
                    <FormLabel>城市</FormLabel>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl required>
                    <FormLabel>州/省</FormLabel>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl required>
                    <FormLabel>国家</FormLabel>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl required>
                    <FormLabel>邮政编码</FormLabel>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" loading={createAddressMutation.isPending || updateAddressMutation.isPending}>
                  {editAddress ? '更新' : '保存'}
                </Button>
              </Box>
            </CardContent>
          </form>
        </Card>
      </Modal>
      
      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          color={snackbar.severity}
          variant="soft"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
