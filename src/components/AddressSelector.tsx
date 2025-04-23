import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog,
    Radio,
    RadioGroup,
    Sheet,
    Stack,
    Typography
} from '@mui/joy';
import {useTranslation} from 'react-i18next';
import {merchantService, MerchantAddress} from '@/api/merchantService';
import {addressService} from "@/api/merchant/addressService.ts";

interface AddressSelectorProps {
    open: boolean;
    onClose: () => void;
    onSelect: (address: MerchantAddress) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({open, onClose, onSelect}) => {
    const {t} = useTranslation();
    const [addresses, setAddresses] = useState<MerchantAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            loadAddresses();
        }
    }, [open]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressService.listAddresses({
                page: 1,
                pageSize: 100
            });
            setAddresses(response.addresses);
            // 如果有默认地址，自动选中
            const defaultAddress = response.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        } catch (error) {
            console.error('加载地址列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            onSelect(selectedAddress);
        }
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <ModalDialog
                sx={{
                    minWidth: 400,
                    maxWidth: 600,
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
            >
                <ModalClose />
                <Typography level="h4">{t('merchant.address.selectTitle')}</Typography>
                <Box sx={{my: 2}}>
                    {loading ? (
                        <Typography>{t('common.loading')}</Typography>
                    ) : addresses.length === 0 ? (
                        <Typography>{t('merchant.address.noAddresses')}</Typography>
                    ) : (
                        <FormControl>
                            <FormLabel>{t('merchant.address.warehouseAddresses')}</FormLabel>
                            <RadioGroup 
                                name="address-selection" 
                                value={selectedAddressId} 
                                onChange={(e) => {
                                    const newValue = Number(e.target.value);
                                    setSelectedAddressId(newValue);
                                }} 
                            > 
                                <Stack spacing={1}> 
                                    {addresses.map((address) => ( 
                                        <Sheet 
                                            key={address.id} 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 2, 
                                                borderRadius: 'sm', 
                                                cursor: 'pointer', 
                                                '&:hover': {borderColor: 'primary.500'}, 
                                                borderColor: selectedAddressId === address.id ? 'primary.500' : 'neutral.outlinedBorder' 
                                            }} 
                                            onClick={() => {
                                                setSelectedAddressId(address.id);
                                            }} 
                                        > 
                                            <Radio 
                                                value={address.id} 
                                                checked={selectedAddressId === address.id}
                                                label={ 
                                                    <Box> 
                                                        <Typography level="title-sm"> 
                                                            {address.contactPerson} - {address.contactPhone} 
                                                            {address.isDefault && ( 
                                                                <Typography 
                                                                    component="span" 
                                                                    sx={{ml: 1, color: 'primary.500'}} 
                                                                > 
                                                                    ({t('merchant.address.default')}) 
                                                                </Typography> 
                                                            )} 
                                                        </Typography> 
                                                        <Typography level="body-sm"> 
                                                            {address.streetAddress}, {address.city}, {address.state}, {address.country} {address.zipCode} 
                                                        </Typography> 
                                                        {address.remarks && ( 
                                                            <Typography level="body-xs" sx={{color: 'neutral.500'}}> 
                                                                {address.remarks} 
                                                            </Typography> 
                                                        )} 
                                                    </Box> 
                                                } 
                                            /> 
                                        </Sheet> 
                                    ))} 
                                </Stack> 
                            </RadioGroup> 
                        </FormControl>
                    )}
                </Box>
                <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                    <Button variant="plain" color="neutral" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedAddressId || loading}
                    >
                        {t('common.confirm')}
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
};
