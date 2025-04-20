import { createLazyFileRoute } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
} from '@mui/material';
import { useAlert } from '@/core/providers/AlertProvider';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { addressService, Address, AddressType } from '@/api/merchant/addressService.ts';

function AddressPage() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [onlyDefault, setOnlyDefault] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [selectedType, setSelectedType] = useState<AddressType>(0);

  // 获取地址列表
  const { data: addressList, isLoading } = useQuery({
    queryKey: ['addresses', page, pageSize, selectedType, onlyDefault],
    queryFn: () =>
      addressService.listAddresses({
        page,
        pageSize,
        onlyDefault,
        addressType: selectedType as AddressType,
      }),
  });

  // 创建地址
  const createMutation = useMutation({
    mutationFn: addressService.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setOpenDialog(false);
      setEditingAddress(null);
      showAlert('地址创建成功', 'success');
    },
    onError: () => {
      showAlert('地址创建失败', 'danger');
    },
  });

  // 更新地址
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Address) => addressService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setOpenDialog(false);
      setEditingAddress(null);
      showAlert('地址更新成功', 'success');
    },
    onError: () => {
      showAlert('地址更新失败', 'danger');
    },
  });

  // 删除地址
  const deleteMutation = useMutation({
    mutationFn: addressService.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      showAlert('地址删除成功', 'success');
    },
    onError: () => {
      showAlert('地址删除失败', 'danger');
    },
  });

  // 设置默认地址
  const setDefaultMutation = useMutation({
    mutationFn: addressService.setDefaultAddress,
    onMutate: async (addressId) => {
      // 取消任何正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: ['addresses'] });
      
      // 获取当前数据的快照
      const previousAddresses = queryClient.getQueryData(['addresses']);
      
      // 乐观更新
      queryClient.setQueryData(['addresses'], (old: any) => {
        if (!old?.addresses) return old;
        
        const targetAddress = old.addresses.find((addr: Address) => addr.id === addressId);
        if (!targetAddress) return old;
        
        const updatedAddresses = old.addresses.map((addr: Address) => ({
          ...addr,
          isDefault: addr.id === addressId ? true : 
                     addr.addressType === targetAddress.addressType ? false : 
                     addr.isDefault
        }));
        
        return { ...old, addresses: updatedAddresses };
      });
      
      return { previousAddresses };
    },
    onError: (err, addressId, context) => {
      // 发生错误时回滚到之前的数据
      queryClient.setQueryData(['addresses'], context?.previousAddresses);
      showAlert('默认地址设置失败', 'danger');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      showAlert('默认地址设置成功', 'success');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAddress) return;

    if ('id' in editingAddress) {
      updateMutation.mutate(editingAddress as Address);
    } else {
      createMutation.mutate(editingAddress  as Address);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'addressType',
      headerName: '地址类型',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const typeMap = {
          [AddressType.WAREHOUSE]: '仓库地址',
          [AddressType.RETURN]: '退货地址',
          [AddressType.STORE]: '门店地址',
          [AddressType.BILLING]: '财务地址',
          [AddressType.HEADQUARTERS]: '总部地址',
        };
        return typeMap[params.value as AddressType];
      },
    },
    { field: 'contactPerson', headerName: '联系人', width: 130 },
    { field: 'contactPhone', headerName: '联系电话', width: 130 },
    { field: 'streetAddress', headerName: '街道地址', width: 200 },
    { field: 'city', headerName: '城市', width: 100 },
    { field: 'state', headerName: '省份', width: 100 },
    { field: 'country', headerName: '国家', width: 100 },
    { field: 'zipCode', headerName: '邮编', width: 100 },
    {
      field: 'isDefault',
      headerName: '是否默认地址',
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
      headerName: '操作',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setEditingAddress(params.row);
              setOpenDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (window.confirm('确定要删除这个地址吗？')) {
                deleteMutation.mutate(params.row.id);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>        <Typography variant="h5">商家地址管理</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={onlyDefault}
                onChange={(e) => setOnlyDefault(e.target.checked)}
              />
            }
            label="只显示默认地址"
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>地址类型</InputLabel>
            <Select
              value={selectedType}
              label="地址类型"
              onChange={(e) => setSelectedType(e.target.value as AddressType)}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value={AddressType.WAREHOUSE}>仓库地址</MenuItem>
              <MenuItem value={AddressType.RETURN}>退货地址</MenuItem>
              <MenuItem value={AddressType.STORE}>门店地址</MenuItem>
              <MenuItem value={AddressType.BILLING}>财务地址</MenuItem>
              <MenuItem value={AddressType.HEADQUARTERS}>总部地址</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingAddress({});
              setOpenDialog(true);
            }}
          >
            添加地址
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
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page + 1);
          setPageSize(model.pageSize);
        }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingAddress?.id ? '编辑地址' : '添加地址'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>地址类型</InputLabel>
                <Select
                  value={editingAddress?.addressType ?? ''}
                  label="地址类型"
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, addressType: e.target.value as AddressType })
                  }
                  required
                >
                  <MenuItem value={AddressType.WAREHOUSE}>仓库地址</MenuItem>
                  <MenuItem value={AddressType.RETURN}>退货地址</MenuItem>
                  <MenuItem value={AddressType.STORE}>门店地址</MenuItem>
                  <MenuItem value={AddressType.BILLING}>财务地址</MenuItem>
                  <MenuItem value={AddressType.HEADQUARTERS}>总部地址</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="联系人"
                value={editingAddress?.contactPerson ?? ''}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, contactPerson: e.target.value })
                }
                required
              />
              <TextField
                label="联系电话"
                value={editingAddress?.contactPhone ?? ''}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, contactPhone: e.target.value })
                }
                required
              />
              <TextField
                label="街道地址"
                value={editingAddress?.streetAddress ?? ''}
                onChange={(e) =>
                  setEditingAddress({ ...editingAddress, streetAddress: e.target.value })
                }
                required
              />
              <TextField
                label="城市"
                value={editingAddress?.city ?? ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                required
              />
              <TextField
                label="省份"
                value={editingAddress?.state ?? ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                required
              />
              <TextField
                label="国家"
                value={editingAddress?.country ?? ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, country: e.target.value })}
                required
              />
              <TextField
                label="邮编"
                value={editingAddress?.zipCode ?? ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, zipCode: e.target.value })}
                required
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingAddress?.isDefault ?? false}
                    onChange={(e) =>
                      setEditingAddress({ ...editingAddress, isDefault: e.target.checked })
                    }
                  />
                }
                label="设为默认地址"
              />
              <TextField
                label="备注"
                value={editingAddress?.remarks ?? ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, remarks: e.target.value })}
                multiline
                rows={3}
              />
            </Box>
            {(createMutation.isError || updateMutation.isError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                保存失败，请重试
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>取消</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              保存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export const Route = createLazyFileRoute('/merchant/address/')({  
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <AddressPage />
    </Suspense>
  ),
});
