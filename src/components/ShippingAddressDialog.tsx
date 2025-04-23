import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    FormControl,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    Radio,
    RadioGroup,
    Stack,
    Typography
} from '@mui/joy';
import {Address} from '@/api/merchant/addressService';
import {showMessage} from '@/utils/showMessage';

interface ShippingAddressDialogProps {
    addresses: Address[];
    onSelect: (address: Address) => void;
    onCancel: () => void;
    open: boolean;
}

/**
 * 发货地址选择对话框组件
 * 用于商家在发货时选择发货地址
 */
const ShippingAddressDialog: React.FC<ShippingAddressDialogProps> = ({
                                                                         addresses,
                                                                         onSelect,
                                                                         onCancel,
                                                                         open
                                                                     }) => {
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // 初始化选择默认地址
    useEffect(() => {
        if (addresses.length > 0) {
            // 查找默认地址
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else if (addresses.length > 0) {
                // 如果没有默认地址，选择第一个地址
                setSelectedAddressId(addresses[0].id);
            }
        }
    }, [addresses]);

    // 处理选择地址
    const handleSelect = () => {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            onSelect(selectedAddress);
        } else {
            showMessage('请选择发货地址', 'warning');
        }
    };

    if (!open) return null;

    return (
        <Card
            variant="outlined"
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                maxWidth: '90%',
                p: 3,
                zIndex: 1000,
                maxHeight: '80vh',
                overflow: 'auto'
            }}
        >
            <Typography level="title-lg" sx={{mb: 2}}>
                选择发货地址
            </Typography>

            {addresses.length === 0 ? (
                <Typography color="warning" sx={{mb: 2}}>
                    您还没有添加任何地址，请先添加地址
                </Typography>
            ) : (
                <FormControl sx={{width: '100%'}}>
                    <RadioGroup value={selectedAddressId}
                                onChange={(e) => setSelectedAddressId(Number(e.target.value))}>
                        <List>
                            {addresses.map((address) => (
                                <ListItem key={address.id}>
                                    <ListItemButton>
                                        <Radio value={address.id} label={null}/>
                                        <ListItemContent>
                                            <Typography level="title-sm">
                                                {address.contactPerson} {address.contactPhone}
                                                {address.isDefault && (
                                                    <Typography component="span" color="primary" fontSize="sm"
                                                                sx={{ml: 1}}>
                                                        (默认)
                                                    </Typography>
                                                )}
                                            </Typography>
                                            <Typography level="body-sm">
                                                {address.streetAddress}, {address.city}, {address.state}, {address.country} {address.zipCode}
                                            </Typography>
                                        </ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </RadioGroup>
                </FormControl>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{mt: 3}}>
                <Button variant="outlined" color="neutral" onClick={onCancel}>
                    取消
                </Button>
                <Button
                    variant="solid"
                    color="primary"
                    onClick={handleSelect}
                    disabled={addresses.length === 0 || selectedAddressId === null}
                >
                    确认选择
                </Button>
            </Stack>
        </Card>
    );
};

export default ShippingAddressDialog;
