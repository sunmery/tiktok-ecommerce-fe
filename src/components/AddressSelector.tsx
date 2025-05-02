import {FC, useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
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
import {MerchantAddress, merchantAddressService} from '@/api/merchant/addressService';
import {useQuery} from '@tanstack/react-query';

interface AddressSelectorProps {
    open: boolean;
    onClose: () => void;
    onSelect: (address: MerchantAddress, shipInfo: {
        trackingNumber: string;
        carrier: string;
        shippingFee: number;
        delivery: string; // 新增 delivery 字段
    }) => void | Promise<void>;
}

export const AddressSelector: FC<AddressSelectorProps> = ({open, onClose, onSelect}) => {
    const {t} = useTranslation();
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [delivery, setDelivery] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 保持 YYYY-MM-DD 格式
    const [shippingFee, setShippingFee] = useState<number>(0);

    // 获取地址列表
    const {data: addressesData, isLoading} = useQuery({
        queryKey: ['merchantAddresses'],
        queryFn: () => merchantAddressService.listAddresses({
            page: 1,
            pageSize: 100
        }),
        enabled: open, // 只在模态框打开时获取数据
    });

    // 当地址数据加载完成后，如果有默认地址则自动选中
    useEffect(() => {
        if (addressesData?.addresses) {
            const defaultAddress = addressesData.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        }
    }, [addressesData]);

    const handleConfirm = () => {
        const selectedAddress = addressesData?.addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            onSelect(selectedAddress, {
                trackingNumber,
                carrier,
                shippingFee,
                delivery // 传递 delivery
            });
        }
        onClose();
        // 重置表单
        setTrackingNumber('');
        setCarrier('');
        setShippingFee(0);
        setDelivery(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 重置 delivery
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
                <ModalClose/>
                <Typography level="h4">{t('merchant.address.selectTitle')}</Typography>

                {/* 发货信息表单 */}
                <Box sx={{my: 2}}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>{t('merchant.orders.trackingNumber')}</FormLabel>
                            <Input
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder={t('merchant.orders.enterTrackingNumber')}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>{t('merchant.orders.carrier')}</FormLabel>
                            <Input
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                placeholder={t('merchant.orders.enterCarrier')}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>{t('merchant.orders.estimatedDelivery')}</FormLabel>
                            <Input
                                type="date"
                                value={delivery}
                                onChange={(e) => setDelivery(e.target.value)}
                                slotProps={{
                                    input: {
                                        min: new Date().toISOString().split('T')[0]
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>{t('merchant.orders.shippingFee')}</FormLabel>
                            <Input
                                type="number"
                                value={shippingFee}
                                onChange={(e) => setShippingFee(Number(e.target.value))}
                                placeholder="0.00"
                                slotProps={{
                                    input: {
                                        min: "0",
                                        step: "0.01"
                                    }
                                }}
                            />
                        </FormControl>
                    </Stack>
                </Box>

                {/* 地址选择部分 */}
                <Box sx={{my: 2}}>
                    {isLoading ? (
                        <Typography>{t('common.loading')}</Typography>
                    ) : !addressesData?.addresses || addressesData.addresses.length === 0 ? (
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
                                    {addressesData.addresses.map((address) => (
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
                        disabled={!selectedAddressId || isLoading || !trackingNumber || !carrier || !delivery}
                    >
                        {t('common.confirm')}
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
};
