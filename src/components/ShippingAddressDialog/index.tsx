import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Modal,
  ModalDialog,
  Radio,
  RadioGroup,
  Typography,
  Stack
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { Address } from '@/api/merchant/addressService';
import { showMessage } from '@/utils/showMessage';

interface ShippingAddressDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (address: Address) => void;
  addresses: Address[];
}

export default function ShippingAddressDialog({
  open,
  onClose,
  onConfirm,
  addresses
}: ShippingAddressDialogProps) {
  const { t } = useTranslation();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // 当对话框打开时，默认选中默认地址
  useEffect(() => {
    if (open) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addresses.length > 0) {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [open, addresses]);

  const handleConfirm = () => {
    if (!selectedAddressId) {
      showMessage('请选择发货地址', 'warning');
      return;
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      onConfirm(selectedAddress);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>{t('merchant.shipping.selectAddress')}</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 1 }}>
            <FormControl>
              <FormLabel>{t('merchant.shipping.shippingAddress')}</FormLabel>
              <RadioGroup
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
              >
                {addresses.map((address) => (
                  <Stack
                    key={address.id}
                    direction="row"
                    spacing={2}
                    sx={{
                      p: 2,
                      borderRadius: 'sm',
                      bgcolor: 'background.level1',
                      mb: 1,
                    }}
                  >
                    <Radio value={address.id} />
                    <Box>
                      <Typography level="title-sm">
                        {address.contactPerson} - {address.contactPhone}
                      </Typography>
                      <Typography level="body-sm">
                        {address.streetAddress}, {address.city}, {address.state}, {address.country} {address.zipCode}
                      </Typography>
                      {address.isDefault && (
                        <Typography level="body-sm" color="primary">
                          {t('merchant.address.default')}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="plain" color="neutral" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}