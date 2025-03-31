import {createLazyFileRoute} from '@tanstack/react-router'
import {FormEvent, useState} from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    Input,
    Modal,
    Snackbar,
    Typography
} from '@mui/joy'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Breadcrumbs from '@/components/Breadcrumbs'
import {useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress} from '@/hooks/useUserAddress'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import type {Address} from '@/types/addresses'
import {useTranslation} from 'react-i18next'

export const Route = createLazyFileRoute('/addresses/')({
    component: AddressesRoute,
})

function AddressesRoute() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const {data: addressesData, isLoading, isError, refetch} = useAddresses()
    const createAddressMutation = useCreateAddress()
    const updateAddressMutation = useUpdateAddress()
    const deleteAddressMutation = useDeleteAddress()

    const [open, setOpen] = useState(false)
    const [editAddress, setEditAddress] = useState<Address | null>(null)
    console.log("account",account)
    const [formData, setFormData] = useState<Address>({
        id: 0,
        userId: account.id,
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
            userId: account.id,
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
                userId: account.id
            })

            setSnackbar({
                open: true,
                message: t('addresses.deleteSuccess'),
                severity: 'success'
            })

            // 刷新地址列表
            await refetch()
        } catch (error) {
            console.error(t('addresses.deleteFailed'), error)
            setSnackbar({
                open: true,
                message: t('addresses.deleteFailed'),
                severity: 'error'
            })
        }
    }

    // 处理表单提交
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            if (editAddress) {
                // 更新地址
                await updateAddressMutation.mutateAsync(formData)
                setSnackbar({
                    open: true,
                    message: t('addresses.saveSuccess'),
                    severity: 'success'
                })
            } else {
                // 创建新地址
                await createAddressMutation.mutateAsync(formData)
                setSnackbar({
                    open: true,
                    message: t('addresses.saveSuccess'),
                    severity: 'success'
                })
            }

            setOpen(false)
            // 刷新地址列表
            await refetch()
        } catch (error) {
            console.error(t('addresses.saveFailed'), error)
            setSnackbar({
                open: true,
                message: t('addresses.saveFailed'),
                severity: 'error'
            })
        }
    }

    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'addresses': t('addresses.title')}}/>

            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                <Typography level="h2">{t('addresses.title')}</Typography>
                <Button
                    startDecorator={<AddIcon/>}
                    onClick={handleAddAddress}
                >
                    {t('addresses.addNew')}
                </Button>
            </Box>

            {isLoading ? (
                <Typography>{t('loading')}</Typography>
            ) : isError ? (
                <Typography color="danger">{t('addresses.loadFailed')}</Typography>
            ) : addressesData?.addresses && addressesData.addresses.length > 0 ? (
                <Grid container spacing={2}>
                    {addressesData.addresses.map((address) => (
                        <Grid xs={12} md={6} lg={4} key={address.id}>
                            <Card variant="outlined" sx={{height: '100%'}}>
                                <CardContent>
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                        <LocationOnIcon color="primary" sx={{mr: 1}}/>
                                        <Typography
                                            level="title-lg">{address.city} {t('addresses.addressLabel')}</Typography>
                                    </Box>
                                    <Divider sx={{my: 1}}/>
                                    <Box sx={{mb: 2}}>
                                        <Typography level="body-sm" sx={{mb: 0.5}}>{t('addresses.detail')}:</Typography>
                                        <Typography>{address.streetAddress}</Typography>
                                    </Box>
                                    <Box sx={{mb: 2}}>
                                        <Typography level="body-sm"
                                                    sx={{mb: 0.5}}>{t('addresses.cityStateCountry')}:</Typography>
                                        <Typography>{address.city}, {address.state}, {address.country}</Typography>
                                    </Box>
                                    <Box sx={{mb: 2}}>
                                        <Typography level="body-sm"
                                                    sx={{mb: 0.5}}>{t('addresses.zipCode')}:</Typography>
                                        <Typography>{address.zipCode}</Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2}}>
                                        <IconButton
                                            variant="outlined"
                                            color="neutral"
                                            onClick={() => handleEditAddress(address)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            variant="outlined"
                                            color="danger"
                                            onClick={() => handleDeleteAddress(address.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Card variant="outlined" sx={{p: 4, textAlign: 'center'}}>
                    <LocationOnIcon sx={{fontSize: 60, color: 'neutral.400', mb: 2}}/>
                    <Typography level="h3" sx={{mb: 2}}>{t('addresses.noAddresses')}</Typography>
                    <Typography sx={{mb: 3}}>{t('addresses.noAddressesPrompt')}</Typography>
                    <Button
                        startDecorator={<AddIcon/>}
                        onClick={handleAddAddress}
                    >
                        {t('addresses.addNew')}
                    </Button>
                </Card>
            )}

            {/* 地址表单模态框 */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Card sx={{maxWidth: 500, width: '100%', mx: 2}}>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <Typography level="h3"
                                        sx={{mb: 2}}>{editAddress ? t('addresses.edit') : t('addresses.addNew')}</Typography>
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <FormControl required>
                                        <FormLabel>{t('addresses.detail')}</FormLabel>
                                        <Input
                                            value={formData.streetAddress}
                                            onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                                            placeholder={t('addresses.streetPlaceholder')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>{t('addresses.city')}</FormLabel>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            placeholder={t('addresses.cityPlaceholder')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>{t('addresses.province')}</FormLabel>
                                        <Input
                                            value={formData.state}
                                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                                            placeholder={t('addresses.provincePlaceholder')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>{t('addresses.country')}</FormLabel>
                                        <Input
                                            value={formData.country}
                                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                                            placeholder={t('addresses.countryPlaceholder')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>{t('addresses.zipCode')}</FormLabel>
                                        <Input
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                                            placeholder={t('addresses.zipCodePlaceholder')}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2}}>
                                    <Button
                                        variant="outlined"
                                        color="neutral"
                                        onClick={() => setOpen(false)}
                                    >
                                        {t('cancel')}
                                    </Button>
                                    <Button type="submit">
                                        {t('save')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </form>
                </Card>
            </Modal>

            {/* 提示消息 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
            >
                <Alert
                    variant="soft"
                    color={snackbar.severity === 'success' ? 'success' : 'danger'}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
