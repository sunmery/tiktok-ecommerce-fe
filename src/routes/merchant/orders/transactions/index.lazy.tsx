import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    Input,
    Option,
    Select,
    Table,
    Typography
} from '@mui/joy'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import FilterListIcon from '@mui/icons-material/FilterList'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import {useSnapshot} from 'valtio/react'
import {userStore} from '@/store/user.ts'
import {useTranslation} from 'react-i18next'
import {showMessage} from '@/utils/showMessage'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import balancerService, {GetTransactionsRequest, Transactions} from '@/api/balancer'
import {usePagination} from '@/hooks/usePagination'
import PaginationBar from '@/components/PaginationBar'
import {paymentMethod, transactionType} from "@/utils/status.ts";
import {PaymentStatus} from "@/types/orders.ts";

export const Route = createLazyFileRoute('/merchant/orders/transactions/')({
    component: TransactionsComponent,
})

function TransactionsComponent() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState<Transactions[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('PAID')
    const [currency, setCurrency] = useState<string>('CNY')
    const [dateRange, setDateRange] = useState<{
        startDate: string
        endDate: string
    }>({
        startDate: '',
        endDate: ''
    })

    // 使用分页钩子
    const pagination = usePagination({
        initialPageSize: 10,
    })

    // 检查用户权限
    useEffect(() => {
        if (account && Object.keys(account).length > 0) {
            if (account.role !== 'merchant') {
                showMessage('权限不足：只有商家可以访问交易流水', 'error')
                navigate({to: '/'}).then(() => {
                    console.log(t('log.redirectedNonMerchant'))
                })
            }
        }

        loadTransactions().catch(error => {
            console.error('加载交易记录失败:', error)
            showMessage(t('transaction.error.loadFailed'), 'error')
        })
    }, [account, navigate, t, pagination.page, pagination.pageSize])

    // 加载交易记录
    // 在 loadTransactions 函数中修改分页数据处理
    const loadTransactions = async () => {
        try {
            setLoading(true);

            const params: GetTransactionsRequest = {
                userId: account.id,
                currency: currency,
                page: pagination.page,
                pageSize: pagination.pageSize,
                paymentStatus: statusFilter,
                userType: 'MERCHANT'
            };

            const response = await balancerService.getTransactions(params);

            if (response && response.transactions) {
                setTransactions(response.transactions);

                // 使用后端返回的总数，如果没有则估算
                if (response.transactions.length !== undefined) {
                    pagination.setTotalItems(response.transactions.length);
                } else {
                    // 如果当前页数据少于页大小，说明是最后一页
                    const isLastPage = response.transactions.length < pagination.pageSize;
                    const estimatedTotal = isLastPage
                        ? (pagination.page - 1) * pagination.pageSize + response.transactions.length
                        : pagination.page * pagination.pageSize + 1;
                    pagination.setTotalItems(estimatedTotal);
                }
            } else {
                setTransactions([]);
                pagination.setTotalItems(0);
            }
        } catch (error) {
            console.error('加载交易记录失败:', error);
            showMessage('加载交易记录失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 处理搜索
    const handleSearch = () => {
        pagination.setPage(1) // 重置到第一页
        loadTransactions().catch(error => {
            console.error('搜索交易记录失败:', error)
        })
    }

    // 处理刷新
    const handleRefresh = () => {
        setSearchTerm('')
        setStatusFilter('all')
        setDateRange({startDate: '', endDate: ''})
        loadTransactions().catch(error => {
            console.error('刷新交易记录失败:', error)
        })
    }

    // 处理导出
    const handleExport = () => {
        try {
            // 创建CSV内容
            let csvContent = `${t('transaction.export.headers.id')},${t('transaction.export.headers.type')},${t('transaction.export.headers.amount')},${t('transaction.export.headers.currency')},${t('transaction.export.headers.fromUser')},${t('transaction.export.headers.toMerchant')},${t('transaction.export.headers.paymentMethod')},${t('transaction.export.headers.paymentAccount')},${t('transaction.export.headers.status')},${t('transaction.export.headers.createdAt')},${t('transaction.export.headers.updatedAt')}\n`

            transactions.forEach(transaction => {
                const row = [
                    transaction.id,
                    transaction.type,
                    transaction.amount,
                    transaction.currency,
                    transaction.fromUserId,
                    transaction.toMerchantId,
                    transaction.paymentMethodType,
                    transaction.paymentAccount,
                    transaction.status,
                    new Date(transaction.createdAt).toLocaleString(),
                    new Date(transaction.updatedAt).toLocaleString()
                ].map(value => `"${value}"`).join(',')

                csvContent += row + "\n"
            })

            // 创建Blob对象
            const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})

            // 创建下载链接
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `${t('transaction.export.filename')}_${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            showMessage('交易记录导出成功', 'success')
        } catch (error) {
            console.error('导出交易记录失败:', error)
            showMessage('导出交易记录失败', 'error')
        }
    }

    // 格式化金额显示
    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: currency || 'CNY'
        }).format(amount)
    }

    // 格式化日期显示
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // 获取状态颜色
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'success'
            case 'PROCESSING':
                return 'warning'
            case 'FAILED':
                return 'danger'
            case 'CANCELLED':
                return 'neutral'
            case 'NOT_PAID':
                return 'warning'
            default:
                return 'primary'
        }
    }

    // 获取状态文本
    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID':
                return t('transaction.status.paid')
            case 'PROCESSING':
                return t('transaction.status.processing')
            case 'FAILED':
                return t('transaction.status.failed')
            case 'CANCELLED':
                return t('transaction.status.cancelled')
            case 'NOT_PAID':
                return t('transaction.status.notPaid')
            default:
                return status
        }
    }

    return (
        <Box sx={{p: 2}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{
                'merchant': t('merchant.dashboard'),
                'merchant/orders': t('merchant.orderManagement'),
                'merchant/orders/transactions': t('merchant.orderTransactions')
            }}/>

            <Typography level="h2" sx={{mb: 3}}>
                {t('merchant.orderTransactions')}
            </Typography>

            {/* 筛选和搜索区域 */}
            <Card variant="outlined" sx={{mb: 3}}>
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid xs={12} md={2}>
                            <FormControl>
                                <FormLabel>{t('transaction.filter.currency')}</FormLabel>
                                <Select
                                    value={currency}
                                    onChange={(_, value) => setCurrency(value as string)}
                                    startDecorator={<AttachMoneyIcon/>}
                                >
                                    <Option value="CNY">{t('transaction.currency.cny')}</Option>
                                    <Option value="USD">{t('transaction.currency.usd')}</Option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <FormControl>
                                <FormLabel>{t('transaction.search.orderOrCustomer')}</FormLabel>
                                <Input
                                    placeholder={t('transaction.search.placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    startDecorator={<SearchIcon/>}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={2}>
                            <FormControl>
                                <FormLabel>{t('transaction.filter.status')}</FormLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(_, value) => setStatusFilter(value as string)}
                                    startDecorator={<FilterListIcon/>}
                                >
                                    <Option value="all">{t('transaction.filter.all')}</Option>
                                    <Option value="PAID">{t('transaction.status.paid')}</Option>
                                    <Option value="PROCESSING">{t('transaction.status.processing')}</Option>
                                    <Option value="NOT_PAID">{t('transaction.status.notPaid')}</Option>
                                    <Option value="FAILED">{t('transaction.status.failed')}</Option>
                                    <Option value="CANCELLED">{t('transaction.status.cancelled')}</Option>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={2}>
                            <FormControl>
                                <FormLabel>{t('transaction.filter.startDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={2}>
                            <FormControl>
                                <FormLabel>{t('transaction.filter.endDate')}</FormLabel>
                                <Input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                />
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={3} sx={{display: 'flex', gap: 1}}>
                            <Button
                                variant="solid"
                                color="primary"
                                startDecorator={<SearchIcon/>}
                                onClick={handleSearch}
                                sx={{flexGrow: 1}}
                            >
                                {t('transaction.search.button')}
                            </Button>
                            <IconButton
                                variant="outlined"
                                color="neutral"
                                onClick={handleRefresh}
                                title={t('transaction.refresh')}
                            >
                                <RefreshIcon/>
                            </IconButton>
                            <IconButton
                                variant="outlined"
                                color="primary"
                                onClick={handleExport}
                                title={t('transaction.export')}
                            >
                                <FileDownloadIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 交易记录表格 */}
            <Card variant="outlined">
                <Box sx={{overflowX: 'auto'}}>
                    {loading ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                            <CircularProgress/>
                        </Box>
                    ) : transactions.length === 0 ? (
                        <Box sx={{textAlign: 'center', p: 4}}>
                            <ReceiptLongIcon sx={{fontSize: 60, color: 'neutral.300', mb: 2}}/>
                            <Typography level="body-lg">{t('transaction.noRecords')}</Typography>
                        </Box>
                    ) : (
                        <Table stickyHeader>
                            <thead>
                            <tr>
                                <th style={{width: '15%'}}>{t('transaction.table.id')}</th>
                                <th style={{width: '8%'}}>{t('transaction.table.type')}</th>
                                <th style={{width: '10%'}}>{t('transaction.table.amount')}</th>
                                <th style={{width: '8%'}}>{t('transaction.table.status')}</th>
                                <th style={{width: '12%'}}>{t('transaction.table.fromUser')}</th>
                                <th style={{width: '10%'}}>{t('transaction.table.paymentMethod')}</th>
                                <th style={{width: '12%'}}>{t('transaction.table.paymentAccount')}</th>
                                <th style={{width: '10%'}}>{t('transaction.table.createdAt')}</th>
                                <th style={{width: '10%'}}>{t('transaction.table.updatedAt')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.id}</td>
                                    <td>{transactionType(transaction.type)}</td>
                                    <td>{formatAmount(transaction.amount, transaction.currency)}</td>
                                    <td>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={getStatusColor(transaction.status) as any}
                                        >
                                            {getStatusText(transaction.status)}
                                        </Chip>
                                    </td>
                                    <td>{transaction.fromUserId}</td>
                                    <td>{paymentMethod(transaction.paymentMethodType)}</td>
                                    <td>{transaction.paymentAccount}</td>
                                    <td>{formatDate(transaction.createdAt)}</td>
                                    <td>{formatDate(transaction.updatedAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Box>

                {/* 分页控件 */}
                {!loading && transactions.length > 0 && (
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                        <PaginationBar
                            page={pagination.page}
                            pageSize={pagination.pageSize}
                            totalItems={transactions.length}
                            onPageChange={pagination.handlePageChange}
                            onPageSizeChange={pagination.handlePageSizeChange}
                            totalPages={0}
                        />
                    </Box>
                )}
            </Card>

            {/* 统计摘要 */}
            {!loading && transactions.length > 0 && (
                <Grid container spacing={2} sx={{mt: 3}}>
                    <Grid xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-md">{t('transaction.summary.totalTransactions')}</Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography level="h2">{transactions.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-md">{t('transaction.summary.totalAmount')}</Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography level="h2">
                                    {formatAmount(
                                        transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
                                        transactions[0]?.currency || 'CNY'
                                    )}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={4}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography level="title-md">{t('transaction.summary.successRate')}</Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography level="h2">
                                    {Math.round(
                                        (transactions.filter(t =>
                                                t.status === PaymentStatus.Paid
                                            ).length /
                                            transactions.length) * 100
                                    )}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}
