import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/core/providers/AlertProvider";
import { useState } from "react";
import { merchantAddressService } from "./api.ts";
import { t } from "i18next";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { MerchantAddress, MerchantAddressType } from "./types.ts";

export default function MerchantAddresses() {
    const queryClient = useQueryClient();
    const {showAlert} = useAlert();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [onlyDefault, setOnlyDefault] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<Partial<MerchantAddress>>({});
    const [selectedType, setSelectedType] = useState<MerchantAddressType | ''>('');

    // 获取地址列表
    const {data: addressList, isLoading} = useQuery({
        queryKey: ['addresses', page, pageSize],
        queryFn: () =>
            merchantAddressService.listAddresses({
                page,
                pageSize,
            }),
    });

    // 创建地址
    const createMutation = useMutation({
        mutationFn: merchantAddressService.createMerchantAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['addresses']});
            setOpenDialog(false);
            setEditingAddress(editingAddress);
            showAlert(t('merchant.address.createSuccess'), 'success');
        },
        onError: () => {
            showAlert(t('merchant.address.createFailed'), 'error');
        },
    });

    // 更新地址
    const updateMutation = useMutation({
        mutationFn: ({id, ...data}: MerchantAddress
        ) => merchantAddressService.updateMerchantAddress(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['addresses']});
            setOpenDialog(false);
            setEditingAddress(editingAddress);
            showAlert(t('merchant.address.updateSuccess'), 'success');
        },
        onError: () => {
            showAlert(t('merchant.address.updateFailed'), 'error');
        },
    });

    // 删除地址
    const deleteMutation = useMutation({
        mutationFn: merchantAddressService.deleteMerchantAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['addresses']});
            showAlert(t('merchant.address.deleteSuccess'), 'success');
        },
        onError: () => {
            showAlert(t('merchant.address.deleteFailed'), 'error');
        },
    });

    // 设置默认地址
    const setDefaultMutation = useMutation({
        mutationFn: merchantAddressService.setDefaultMerchantAddress,
        onMutate: async (addressId) => {
            // 取消任何正在进行的重新获取
            await queryClient.cancelQueries({queryKey: ['addresses']});

            // 获取当前数据的快照
            const previousAddresses = queryClient.getQueryData(['addresses']);

            // 乐观更新
            queryClient.setQueryData(['addresses'], (old: any) => {
                if (!old?.addresses) return old;

                const targetAddress = old.addresses.find((addr: MerchantAddress
                ) => addr.id === addressId);
                if (!targetAddress) return old;

                const updatedAddresses = old.addresses.map((addr: MerchantAddress
                ) => ({
                    ...addr,
                    isDefault: addr.id === addressId ? true :
                        addr.addressType === targetAddress.addressType ? false :
                            addr.isDefault
                }));

                return {...old, addresses: updatedAddresses};
            });

            return {previousAddresses};
        },
        onError: (_err, _addressId, context) => {
            // 发生错误时回滚到之前的数据
            queryClient.setQueryData(['addresses'], context?.previousAddresses);
            showAlert('默认地址设置失败', 'error');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['addresses']});
            showAlert('默认地址设置成功', 'success');
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingAddress) return;

        // 添加表单验证
        if (editingAddress.streetAddress && editingAddress.streetAddress.length < 5) {
            showAlert(t('merchant.address.streetAddressValidationError'), 'warning');
            return;
        }

        if ('id' in editingAddress) {
            updateMutation.mutate(editingAddress as MerchantAddress);
        } else {
            createMutation.mutate(editingAddress as MerchantAddress);
        }
    };

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'addressType',
            headerName: t('merchant.address.type'),
            width: 130,
            renderCell: (params: GridRenderCellParams) => {
                const typeMap = {
                    [MerchantAddressType.WAREHOUSE]: t('merchant.address.warehouse'),
                    [MerchantAddressType.RETURN]: t('merchant.address.return'),
                    [MerchantAddressType.STORE]: t('merchant.address.store'),
                    [MerchantAddressType.BILLING]: t('merchant.address.billing'),
                    [MerchantAddressType.HEADQUARTERS]: t('merchant.address.headquarters'),
                };
                return typeMap[params.value as MerchantAddressType];
            },
        },
        {field: 'contactPerson', headerName: t('merchant.address.contactPerson'), width: 130},
        {field: 'contactPhone', headerName: t('merchant.address.contactPhone'), width: 130},
        {field: 'streetAddress', headerName: t('merchant.address.streetAddress'), width: 200},
        {field: 'city', headerName: t('merchant.address.city'), width: 100},
        {field: 'state', headerName: t('merchant.address.state'), width: 100},
        {field: 'country', headerName: t('merchant.address.country'), width: 100},
        {field: 'zipCode', headerName: t('merchant.address.zipCode'), width: 100},
        {
            field: 'isDefault',
            headerName: t('merchant.address.isDefault'),
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={params.value}
                            onChange={() => setDefaultMutation.mutate(params.row.id)}
                            disabled={params.value}
                        />
                    }
                    label={''}
                />
            ),
        },
        {
            field: 'actions',
            headerName: t('merchant.address.actions'),
            width: 130,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <IconButton
                        onClick={() => {
                            setEditingAddress(params.row);
                            setOpenDialog(true);
                        }}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            if (window.confirm(t('merchant.address.confirmDelete'))) {
                                deleteMutation.mutate(params.row.id);
                            }
                        }}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{height: '100%', width: '100%', p: 2}}>
            <Breadcrumbs pathMap={{
                'address': t('merchant.addressTitle')
            }}/>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}> <Typography
                variant="h5">{t('merchant.address.title')}</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={onlyDefault}
                                onChange={(e) => setOnlyDefault(e.target.checked)}
                            />
                        }
                        label={t('merchant.address.showOnlyDefault')}
                    />
                    <FormControl sx={{minWidth: 120}}>
                        <InputLabel>{t('merchant.address.type')}</InputLabel>
                        <Select
                            value={selectedType}
                            label={t('merchant.address.type')}
                            onChange={(e) => setSelectedType(e.target.value as MerchantAddressType)}
                        >
                            <MenuItem value="">{t('merchant.address.all')}</MenuItem>
                            <MenuItem value={MerchantAddressType.WAREHOUSE}>{t('merchant.address.warehouse')}</MenuItem>
                            <MenuItem value={MerchantAddressType.RETURN}>{t('merchant.address.return')}</MenuItem>
                            <MenuItem value={MerchantAddressType.STORE}>{t('merchant.address.store')}</MenuItem>
                            <MenuItem value={MerchantAddressType.BILLING}>{t('merchant.address.billing')}</MenuItem>
                            <MenuItem
                                value={MerchantAddressType.HEADQUARTERS}>{t('merchant.address.headquarters')}</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => {
                            setEditingAddress({
                                addressType: MerchantAddressType.WAREHOUSE,  // 设置默认类型
                                isDefault: false,
                            });
                            setOpenDialog(true);
                        }}
                    >
                        {t('merchant.address.add')}
                    </Button>
                </Box>
            </Box>

            <DataGrid
                rows={addressList?.addresses || []}
                columns={columns}
                rowCount={addressList?.totalCount || 0}
                loading={isLoading}
                pageSizeOptions={[5, 10, 20]}
                paginationMode="server"
                paginationModel={{page: page - 1, pageSize}}
                onPaginationModelChange={(model) => {
                    setPage(model.page + 1);
                    setPageSize(model.pageSize);
                }}
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>{editingAddress?.id ? t('merchant.address.edit') : t('merchant.address.add')}</DialogTitle>
                    <DialogContent>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{t('merchant.address.type')}</InputLabel>
                                <Select
                                    value={editingAddress?.addressType || ''}
                                    label={t('merchant.address.type')}
                                    onChange={(e) => setEditingAddress((prev: any) => ({
                                        ...prev,
                                        addressType: e.target.value as MerchantAddressType
                                    }))}
                                >
                                    <MenuItem
                                        value={MerchantAddressType.WAREHOUSE}>{t('merchant.address.warehouse')}</MenuItem>
                                    <MenuItem
                                        value={MerchantAddressType.RETURN}>{t('merchant.address.return')}</MenuItem>
                                    <MenuItem value={MerchantAddressType.STORE}>{t('merchant.address.store')}</MenuItem>
                                    <MenuItem
                                        value={MerchantAddressType.BILLING}>{t('merchant.address.billing')}</MenuItem>
                                    <MenuItem
                                        value={MerchantAddressType.HEADQUARTERS}>{t('merchant.address.headquarters')}</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label={t('merchant.address.contactPerson')}
                                value={editingAddress?.contactPerson ?? ''}
                                onChange={(e) =>
                                    setEditingAddress({...editingAddress, contactPerson: e.target.value})
                                }
                                required
                            />
                            <TextField
                                label={t('merchant.address.contactPhone')}
                                value={editingAddress?.contactPhone ?? ''}
                                onChange={(e) =>
                                    setEditingAddress({...editingAddress, contactPhone: e.target.value})
                                }
                                required
                            />
                            <TextField
                                label={t('merchant.address.streetAddress')}
                                value={editingAddress?.streetAddress ?? ''}
                                onChange={(e) =>
                                    setEditingAddress({...editingAddress, streetAddress: e.target.value})
                                }
                                required
                                error={!!editingAddress?.streetAddress && editingAddress.streetAddress.length < 5}
                                helperText={
                                    !!editingAddress?.streetAddress && editingAddress.streetAddress.length < 5
                                        ? t('merchant.address.streetAddressMinLength')
                                        : ''
                                }
                                inputProps={{
                                    minLength: 5
                                }}
                            />
                            <TextField
                                label={t('merchant.address.city')}
                                value={editingAddress?.city ?? ''}
                                onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                                required
                            />
                            <TextField
                                label={t('merchant.address.state')}
                                value={editingAddress?.state ?? ''}
                                onChange={(e) => setEditingAddress({...editingAddress, state: e.target.value})}
                                required
                            />
                            <TextField
                                label={t('merchant.address.country')}
                                value={editingAddress?.country ?? ''}
                                onChange={(e) => setEditingAddress({...editingAddress, country: e.target.value})}
                                required
                            />
                            <TextField
                                label={t('merchant.address.zipCode')}
                                value={editingAddress?.zipCode ?? ''}
                                onChange={(e) => setEditingAddress({...editingAddress, zipCode: e.target.value})}
                                required
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editingAddress?.isDefault ?? false}
                                        onChange={(e) =>
                                            setEditingAddress({...editingAddress, isDefault: e.target.checked})
                                        }
                                    />
                                }
                                label={t('merchant.address.setAsDefault')}
                            />
                            <TextField
                                label={t('merchant.address.remarks')}
                                value={editingAddress?.remarks ?? ''}
                                onChange={(e) => setEditingAddress({...editingAddress, remarks: e.target.value})}
                                multiline
                                rows={3}
                            />
                        </Box>
                        {(createMutation.isError || updateMutation.isError) && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {t('merchant.address.saveFailed')}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>{t('common.cancel')}</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {t('common.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
