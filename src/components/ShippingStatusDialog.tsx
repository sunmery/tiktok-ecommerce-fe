import {
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    Modal,
    ModalDialog,
    Stack,
    Typography,
    Divider,
    CircularProgress,
    Box,
} from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { ShippingInfo, ShippingUpdate } from '@/types/orders';
import {shippingStatus} from "@/utils/status.ts";

interface ShippingStatusDialogProps {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    shippingInfo?: ShippingInfo;
    error?: string;
}

export default function ShippingStatusDialog({
    open,
    onClose,
    loading,
    shippingInfo,
    error,
}: ShippingStatusDialogProps) {
    const { t } = useTranslation();

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>{t('orders.shipping.status')}</DialogTitle>
                <Divider />
                <DialogContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="danger">{error}</Typography>
                    ) : shippingInfo ? (
                        <Stack spacing={2}>
                            <Box>
                                <Typography level="title-sm">{t('orders.shipping.basic')}</Typography>
                                <Typography level="body-sm">主订单号: {shippingInfo.orderId}</Typography>
                                <Typography level="body-sm">子订单号: {shippingInfo.subOrderId}</Typography>
                                <Typography level="body-sm">支付状态: {shippingInfo.paymentStatus}</Typography>
                                <Typography level="body-sm">货运状态: {shippingStatus(shippingInfo.shippingStatus)}</Typography>
                                <Typography level="body-sm">物流单号: {shippingInfo.trackingNumber}</Typography>
                                <Typography level="body-sm">物流公司: {shippingInfo.carrier}</Typography>
                            </Box>

                            {shippingInfo.updates && shippingInfo.updates.length > 0 && (
                                <Box>
                                    <Typography level="title-sm" sx={{ mb: 1 }}>
                                        {t('orders.shipping.updates')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {shippingInfo.updates.map((update: ShippingUpdate, index: number) => (
                                            <Box key={index}>
                                                <Typography level="body-sm" fontWeight="bold">
                                                    {update.timestamp}
                                                </Typography>
                                                <Typography level="body-sm">
                                                    {update.status} - {update.location}
                                                </Typography>
                                                <Typography level="body-sm">{update.description}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    ) : (
                        <Typography>{t('orders.shipping.noInfo')}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="plain" color="neutral" onClick={onClose}>
                        {t('common.close')}
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
}
