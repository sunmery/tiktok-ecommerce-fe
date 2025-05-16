import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio/react";
import { userStore } from "@/store/user.ts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Option,
    Select,
    Stack,
    Typography
} from "@mui/joy";
import { balancerService } from "@/features/dashboard/admin/rechargeBalance/api.ts";

export default function Transactions() {
    const { t } = useTranslation()
    const { account } = useSnapshot(userStore)
    const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day')

    // 使用 React Query 获取交易记录
    const {
        data: transactionsData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['transactions', account.id],
        queryFn: async () => {
            const response = await balancerService.getTransactions({
                userId: account.id,
                currency: 'CNY',
                page: 1,
                pageSize: 100,
                paymentStatus: 'PAID',
                userType: 'CONSUMER'
            })
            return response.transactions || []
        },
        enabled: !!account.id,
        staleTime: 5 * 60 * 1000, // 5分钟缓存
        retry: 2
    })

    // 根据选择的时间维度对交易记录进行分组
    const groupedTransactions: GroupedTransactions = {}

    if (transactionsData) {
        transactionsData.forEach(transaction => {
            const date = new Date(transaction.createdAt)
            let key = ''

            switch (groupBy) {
                case 'day':
                    key = format(startOfDay(date), 'yyyy-MM-dd', { locale: zhCN })
                    break
                case 'week':
                    key = format(startOfWeek(date, { locale: zhCN }), "'第'w'周' yyyy-MM-dd", { locale: zhCN })
                    break
                case 'month':
                    key = format(startOfMonth(date), 'yyyy年MM月', { locale: zhCN })
                    break
                case 'year':
                    key = format(startOfYear(date), 'yyyy年', { locale: zhCN })
                    break
            }

            if (!groupedTransactions[key]) {
                groupedTransactions[key] = {
                    transactions: [],
                    total: 0
                }
            }

            groupedTransactions[key].transactions.push(transaction)
            groupedTransactions[key].total += transaction.amount
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'success'
            case 'PENDING':
                return 'warning'
            case 'FAILED':
                return 'danger'
            default:
                return 'neutral'
        }
    }

    const getTypeText = (type: string) => {
        switch (type) {
            case 'RECHARGE':
                return t('transaction.type.recharge')
            case 'PAYMENT':
                return t('transaction.type.payment')
            case 'REFUND':
                return t('transaction.type.refund')
            default:
                return type
        }
    }

    return (
        <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography level="h2">{t('transaction.title')}</Typography>
                <Select
                    value={groupBy}
                    onChange={(_, value) => value && setGroupBy(value)}
                    sx={{ minWidth: 120 }}
                >
                    <Option value="day">{t('consumer.transactions.groupBy.day')}</Option>
                    <Option value="week">{t('consumer.transactions.groupBy.week')}</Option>
                    <Option value="month">{t('consumer.transactions.groupBy.month')}</Option>
                    <Option value="year">{t('consumer.transactions.groupBy.year')}</Option>
                </Select>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : isError ? (
                <Alert color="danger" sx={{ mb: 2 }}>
                    {t('transaction.error.fetch')}: {(error as Error).message}
                </Alert>
            ) : Object.keys(groupedTransactions).length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 4 }}>
                    {t('transaction.empty')}
                </Typography>
            ) : (
                <Stack spacing={3}>
                    {Object.entries(groupedTransactions).map(([date, group]) => (
                        <Card key={date} variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography level="h3">{date}</Typography>
                                    <Typography level="h4">
                                        {t('transaction.totalAmount')}: ¥{group.total.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Stack spacing={2}>
                                    {group.transactions.map((transaction: any) => (
                                        <Card key={transaction.id} variant="soft">
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    <Grid xs={12} sm={6} md={4}>
                                                        <Stack spacing={1}>
                                                            <Typography level="title-md">{t('consumer.transactions.fields.id')}: {transaction.id}</Typography>
                                                            <Typography level="body-md">
                                                                {getTypeText(transaction.type)} - {transaction.currency}
                                                            </Typography>
                                                            <Typography level="title-lg" color="primary">
                                                                ¥{transaction.amount.toFixed(2)}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} sm={6} md={4}>
                                                        <Stack spacing={1}>
                                                            <Typography level="body-md">
                                                                {t('consumer.transactions.fields.counterparty')}: {
                                                                transaction.toMerchantId === "00000000-0000-0000-0000-000000000000"
                                                                    ? t('consumer.transactions.system')
                                                                    : transaction.toMerchantId
                                                            }
                                                            </Typography>
                                                            <Typography level="body-md">
                                                                {t('consumer.transactions.fields.paymentMethod')}: {t(`consumer.transactions.paymentMethod.${transaction.paymentMethodType.toLowerCase()}`)}
                                                            </Typography>
                                                            <Typography level="body-md">
                                                                {t('consumer.transactions.fields.paymentAccount')}: {
                                                                transaction.paymentAccount || t('consumer.transactions.noPaymentAccount')
                                                            }
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} sm={6} md={4}>
                                                        <Stack spacing={1}>
                                                            <Chip
                                                                color={getStatusColor(transaction.status)}
                                                                variant="soft"
                                                                size="lg"
                                                            >
                                                                {t(`consumer.transactions.status.${transaction.status.toLowerCase()}`)}
                                                            </Chip>
                                                            <Typography level="body-sm">
                                                                {t('consumer.transactions.fields.createdAt')}: {format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    )
}
