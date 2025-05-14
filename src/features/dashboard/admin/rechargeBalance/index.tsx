import {useTranslation} from "react-i18next";
import {useSnapshot} from "valtio/react";
import {userStore} from "@/store/user.ts";
import {useNavigate} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import  {
    BalanceReply, CreateConsumerBalanceRequest, CreateMerchantBalanceRequest,
    GetBalanceRequest, GetTransactionsRequest,
    OperationMode,
    RechargeBalanceRequest,
    RechargeMerchantBalanceRequest
} from "./type.ts";
import {showMessage} from "@/utils/showMessage.ts";
import {v4 as uuidv4} from "uuid";
import {PaymentStatus} from "@/types/status.ts";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent, CircularProgress,
    Divider,
    FormControl, FormLabel,
    Grid, IconButton, Input, Option, Select,
    Stack,
    Tab,
    TabList,
    Tabs,
    Typography
} from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RefreshIcon from "@mui/icons-material/Refresh";
import { balancerService } from "@/features/dashboard/admin/rechargeBalance/api.ts";

export default function RechargeBalance() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const [userId, setUserId] = useState('')
    const [amount, setAmount] = useState<number>(0)
    const [currency, setCurrency] = useState('CNY')
    const [paymentMethod, setPaymentMethod] = useState('BALANCE') // Note: This might be less relevant for initialization
    const [paymentAccount, setPaymentAccount] = useState('') // Note: This might be less relevant for initialization
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [page, _] = useState(1)
    const [pageSize] = useState(10)
    const [userType, setUserType] = useState<'consumer' | 'merchant'>('consumer')
    const [mode, setMode] = useState<OperationMode>('recharge'); // Add mode state

    const INITIAL_BALANCE = 1000; // Default initial balance

    useEffect(() => {
        console.log("account",account.id)
        setUserId(account.id)
    }, [account, navigate])

    // 获取用户余额信息
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        refetch: refetchBalance
    } = useQuery<BalanceReply | undefined>({
        queryKey: ['userBalance', userId, currency, userType],
        queryFn: async () => {
            if (!userId || !currency) {
                return undefined;
            }
            const request: GetBalanceRequest = {
                userId,
                currency,
            }
            console.log('userType', userType)
            try {
                return userType === 'consumer'
                    ? await balancerService.getUserBalance(request)
                    : await balancerService.getMerchantBalance({merchantId: userId, currency});
            } catch (e) {
                console.warn("Failed to fetch balance:", e);
                return undefined;
            }
        },
        enabled: !!userId && !!currency,
        retry: 1
    })

    // 充值操作 Mutation
    const rechargeMutation = useMutation({
        mutationFn: (rechargeData: RechargeBalanceRequest | RechargeMerchantBalanceRequest) => {
            if (userType === 'consumer') {
                return balancerService.rechargeBalance(rechargeData as RechargeBalanceRequest);
            } else {
                return balancerService.rechargeMerchantBalance(rechargeData as RechargeMerchantBalanceRequest);
            }
        },
        onSuccess: (data) => {
            setSuccess(`充值成功！交易ID: ${data.transactionId}, 新版本号: ${data.newVersion}`)
            refetchBalance().then(() => {
                console.log('余额信息已刷新')
                showMessage(t('success.rechargeSuccess'), 'success')
            })
            // 重置部分表单
            setAmount(0)
            // setPaymentAccount('') // Keep payment account for potential subsequent recharges
        },
        onError: (err: Error) => {
            if (err.message.includes('optimistic lock failed') || err.message.includes('OPTIMISTIC_LOCK_FAILED')) {
                // 乐观锁错误，自动刷新余额并提示用户重试
                refetchBalance().then(() => {
                    setError(`乐观锁错误：数据已被其他操作修改，已自动刷新余额信息，请重新尝试充值操作。`)
                    showMessage('数据已更新，请重新尝试', 'warning')
                })
            } else {
                setError(`充值失败: ${err.message}`)
            }
        }
    })

    // 初始化余额 Mutation
    const initializeBalanceMutation = useMutation({
        mutationFn: async (initData: {
            userId: string;
            currency: string;
            balanceType: string; // Payment Method acts as balanceType here
            accountDetails: Record<string, any>;
        }) => {
            if (userType === 'consumer') {
                const request: CreateConsumerBalanceRequest = {
                    userId: initData.userId,
                    currency: initData.currency,
                    initialBalance: INITIAL_BALANCE,
                    balanceType: initData.balanceType,
                    isDefault: true, // Assuming default for initialization
                    accountDetails: initData.accountDetails,
                };
                return balancerService.createConsumerBalance(request);
            } else {
                const request: CreateMerchantBalanceRequest = {
                    merchantId: initData.userId, // Use userId as merchantId here
                    currency: initData.currency,
                    initialBalance: INITIAL_BALANCE,
                    balanceType: initData.balanceType,
                    isDefault: true, // Assuming default for initialization
                    accountDetails: initData.accountDetails,
                };
                return balancerService.createMerchantBalance(request);
            }
        },
        onSuccess: (data) => {
            setSuccess(`初始化成功！用户ID: ${data.userId}, 可用余额: ${data.available}`)
            refetchBalance().then(() => {
                console.log('余额信息已刷新')
                showMessage('初始化余额成功', 'success') // Use a specific message
            })
            // Reset relevant fields after initialization
            setPaymentAccount('');
        },
        onError: (err: Error) => {
            setError(`初始化失败: ${err.message}`)
        }
    })


    // 处理提交 (根据模式调用不同 mutation)
    const handleSubmit = () => {
        setError(null)
        setSuccess(null)

        // 表单验证
        if (!userId) {
            setError(userType === 'consumer' ? '请输入用户ID' : '请输入商家ID')
            return
        }

        // 验证用户ID长度
        if (userId.length !== 36) {
            setError('ID必须是36位UUID格式字符串')
            return
        }

        // if (!paymentAccount) {
        //     setError('请输入支付账号')
        //     return
        // }

        // // 验证支付账号格式
        // if (paymentMethod === 'ALIPAY' && !paymentAccount.includes('@')) {
        //     setError('请输入有效的支付宝账号（需包含@）')
        //     return
        // }

        if (mode === 'recharge') {
            // 充值模式特定验证
            if (!amount || amount <= 0) {
                setError('请输入有效的充值金额（必须大于0）')
                return
            }

            if (!balanceData) {
                setError('无法获取当前用户余额信息，请确认用户ID正确或先初始化余额')
                return
            }

            // 所有验证通过后，执行充值操作
            if (userType === 'consumer') {
                const rechargeData: RechargeBalanceRequest = {
                    userId,
                    amount,
                    currency,
                    externalTransactionId: Date.now(),
                    paymentMethodType: paymentMethod,
                    paymentAccount,
                    idempotencyKey: uuidv4(),
                    expectedVersion: balanceData?.version ?? 0
                }
                rechargeMutation.mutate(rechargeData)
            } else {
                const rechargeData: RechargeMerchantBalanceRequest = {
                    merchantId: userId,
                    amount,
                    currency,
                    paymentMethod: paymentMethod,
                    paymentAccount,
                    paymentExtra: {},
                    expectedVersion: balanceData?.version ?? 0,
                    idempotencyKey: uuidv4()
                }
                rechargeMutation.mutate(rechargeData)
            }
        } else if (mode === 'initialize') {
            // 初始化模式特定验证
            if (!currency) {
                setError('请选择货币类型')
                return
            }

            // 所有验证通过后，执行初始化操作
            const initRequest = {
                userId,
                currency,
                balanceType: paymentMethod,
                accountDetails: {
                    account: paymentAccount,
                }
            }
            initializeBalanceMutation.mutate(initRequest)
        }
    }

    // 获取交易记录
    const {
        data: transactionsData,
        isLoading: isTransactionsLoading,
        refetch: transactionsQuery
    } = useQuery({
        queryKey: ['transactions', userId, currency, page, pageSize, userType], // 已添加 userType 到 key
        queryFn: async () => {
            if (!userId || !currency) {
                return null;
            }
            // Note: getTransactions might need adjustment if it's user-specific and doesn't support merchantId directly
            // Assuming getTransactions works for both based on userId for now.
            const request: GetTransactionsRequest = {
                userId,
                currency,
                page,
                pageSize,
                paymentStatus: PaymentStatus.Paid,
                userType: userType === 'consumer' ? '0' : '1' // 根据用户类型设置 userType 参数
            };
            try {
                return await balancerService.getTransactions(request);
            } catch (e) {
                console.warn("Failed to fetch transactions:", e);
                return {transactions: []}; // Return empty list on error
            }
        },
        enabled: !!userId && !!currency
    });

    return (
        <Box sx={{p: 2}}>
            <Button
                startDecorator={<ArrowBackIcon/>}
                variant="plain"
                onClick={() => navigate({to: '/admin'})}
                sx={{mb: 2}}
            >
                {t('admin.rechargeBalance.backToDashboard')}
            </Button>

            <Typography level="h2" sx={{mb: 3}}>{t('admin.rechargeBalance.title')}</Typography>

            <Grid container spacing={3}>
                {/* 表单 */}
                <Grid xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            {/* Mode Tabs */}
                            <Tabs
                                aria-label="Operation mode"
                                value={mode}
                                onChange={(_, newValue) => setMode(newValue as OperationMode)}
                                sx={{mb: 2}}
                            >
                                <TabList>
                                    <Tab value="recharge">为现有用户充值</Tab>
                                    <Tab value="initialize">初始化用户余额</Tab>
                                </TabList>
                            </Tabs>

                            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                <AccountBalanceWalletIcon color="primary" sx={{mr: 1}}/>
                                <Typography level="h3">
                                    {mode === 'recharge' ? t('admin.rechargeBalance.formTitle') : '初始化用户余额'}
                                </Typography>
                            </Box>
                            <Divider sx={{my: 2}}/>

                            {error && (
                                <Alert color="danger" sx={{mb: 2}}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert color="success" sx={{mb: 2}}>
                                    {success}
                                </Alert>
                            )}

                            <Stack spacing={2}>
                                <FormControl required>
                                    <FormLabel>{t('admin.rechargeBalance.userType')}</FormLabel>
                                    <Select
                                        value={userType}
                                        onChange={(_, value) => {
                                            if (value) {
                                                setUserType(value);
                                                setUserId(''); // Reset userId when type changes
                                                setError(null);
                                                setSuccess(null);
                                            }
                                        }}
                                    >
                                        <Option value="consumer">消费者</Option>
                                        <Option value="merchant">商家</Option>
                                    </Select>
                                </FormControl>

                                <FormControl required>
                                    <FormLabel>{userType === 'consumer' ? t('admin.rechargeBalance.userId') : t('admin.rechargeBalance.merchantId')}</FormLabel>
                                    <Input
                                        value={userId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 36) {
                                                setUserId(value);
                                            }
                                        }}
                                        placeholder={userType === 'consumer' ? "请输入36位用户ID (UUID格式)" : "请输入36位商家ID (UUID格式)"}
                                        error={userId.length > 0 && userId.length !== 36}
                                        helperText={userId.length > 0 && userId.length !== 36 ? "ID必须是36位UUID格式字符串" : "提示：可以从用户管理页面复制ID"}
                                    />
                                </FormControl>

                                {/* Conditional Amount Field */}
                                {mode === 'recharge' && (
                                    <FormControl required>
                                        <FormLabel>{t('admin.rechargeBalance.amount')}</FormLabel>
                                        <Input
                                            value={amount || ''}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            placeholder="请输入充值金额"
                                            slotProps={{input: {min: 0.01}}} // Ensure positive amount
                                        />
                                    </FormControl>
                                )}
                                {mode === 'initialize' && (
                                    <FormControl disabled>
                                        <FormLabel>初始金额</FormLabel>
                                        <Input value={INITIAL_BALANCE} readOnly/>
                                    </FormControl>
                                )}

                                <FormControl required>
                                    <FormLabel>{t('admin.rechargeBalance.currency')}</FormLabel>
                                    <Select
                                        value={currency}
                                        onChange={(_, value) => value && setCurrency(value)}
                                    >
                                        <Option value="CNY">人民币 (CNY)</Option>
                                        <Option value="USD">美元 (USD)</Option>
                                        <Option value="EUR">欧元 (EUR)</Option>
                                    </Select>
                                </FormControl>

                                <FormControl required>
                                    {/* Label might need adjustment based on mode */}
                                    <FormLabel>{mode === 'recharge' ? t('admin.rechargeBalance.paymentMethod') : '账户类型'}</FormLabel>
                                    <Select
                                        value={paymentMethod}
                                        onChange={(_, value) => value && setPaymentMethod(value)}
                                    >
                                        {/* Adjust options based on what balanceType expects */}
                                        <Option value="ALIPAY">支付宝</Option>
                                        <Option value="WECHAT">微信支付</Option>
                                        <Option value="BANK_CARD">银行卡</Option>
                                        <Option value="CREDIT_CARD">信用卡</Option> {/* Added Credit Card */}
                                        <Option value="BALANCE">余额 (内部)</Option>
                                    </Select>
                                </FormControl>

                                {/*<FormControl required>*/}
                                {/*    /!* Label might need adjustment based on mode *!/*/}
                                {/*    <FormLabel>{mode === 'recharge' ? t('admin.rechargeBalance.paymentAccount') : '账户标识'}</FormLabel>*/}
                                {/*    <Input*/}
                                {/*        value={paymentAccount}*/}
                                {/*        onChange={(e) => setPaymentAccount(e.target.value)}*/}
                                {/*        placeholder={mode === 'recharge' ? "请输入支付账号" : "请输入账户标识 (如卡号)"}*/}
                                {/*    />*/}
                                {/*</FormControl>*/}

                                <Button
                                    color="primary"
                                    loading={rechargeMutation.isPending || initializeBalanceMutation.isPending}
                                    onClick={handleSubmit}
                                    sx={{mt: 2}}
                                >
                                    {mode === 'recharge' ? '确认充值' : '确认初始化'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 用户余额信息 & 交易记录 (No changes needed here for the core logic) */}
                <Grid xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h3" sx={{mb: 2}}>
                                {t('admin.rechargeBalance.userBalancerInfo')}
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <IconButton
                                        size="sm"
                                        variant="plain"
                                        color="neutral"
                                        onClick={() => {
                                            refetchBalance().then(()=>{
                                                showMessage('刷新余额完成', 'info')
                                            })
                                            transactionsQuery().then(() => {
                                                showMessage('加载交易记录完成', 'info');
                                            })
                                        }}
                                        sx={{ml: 1}}
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>
                            </Typography>
                            <Divider sx={{my: 2}}/>

                            {!userId ? (
                                <Typography level="body-md" sx={{textAlign: 'center', py: 4}}>
                                    请输入{userType === 'consumer' ? '用户ID' : '商家ID'}查询余额信息
                                </Typography>
                            ) : isBalanceLoading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : balanceData ? (
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography level="body-sm">可用余额:</Typography>
                                        <Typography level="h4" color="primary">
                                            {balanceData.available} {balanceData.currency}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm">冻结余额:</Typography>
                                        <Typography level="h4">
                                            {balanceData.frozen} {balanceData.currency}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm">版本号:</Typography>
                                        <Typography level="body-md">
                                            {balanceData.version}
                                        </Typography>
                                    </Box>
                                </Stack>
                            ) : (
                                <Alert color="warning" sx={{mb: 2}}>
                                    {mode === 'recharge' ? '未找到该用户的余额信息，请先初始化。' : '该用户尚未初始化余额。'}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* 最近交易记录 */}
                    <Card variant="outlined" sx={{mt: 2}}>
                        <CardContent>
                            <Typography level="h3"
                                        sx={{mb: 2}}>{t('admin.rechargeBalance.recentTransactions')}</Typography>
                            <Divider sx={{my: 2}}/>

                            {!userId ? (
                                <Typography level="body-md" sx={{textAlign: 'center', py: 4}}>
                                    请输入{userType === 'consumer' ? '用户ID' : '商家ID'}查询交易记录
                                </Typography>
                            ) : isTransactionsLoading ? (
                                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                                    <CircularProgress/>
                                </Box>
                            ) : transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
                                <Stack spacing={2} sx={{maxHeight: '300px', overflowY: 'auto'}}> {/* Added scroll */}
                                    {transactionsData.transactions.map((transaction) => (
                                        <Box key={transaction.id} sx={{
                                            p: 1.5,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 'sm'
                                        }}>
                                            <Grid container spacing={1}>
                                                <Grid xs={6}>
                                                    <Typography level="body-xs">交易ID: {transaction.id}</Typography>
                                                    <Typography level="body-xs">类型: {transaction.type}</Typography>
                                                    <Typography
                                                        level="body-xs">金额: {transaction.amount} {transaction.currency}</Typography>
                                                </Grid>
                                                <Grid xs={6}>
                                                    <Typography level="body-xs">状态: {transaction.status}</Typography>
                                                    <Typography
                                                        level="body-xs">支付方式: {transaction.paymentMethodType}</Typography>
                                                    <Typography
                                                        level="body-xs">时间: {new Date(transaction.createdAt).toLocaleString()}</Typography> {/* Formatted date */}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Alert color="neutral" sx={{mb: 2}}> {/* Changed color to neutral */}
                                    暂无交易记录
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
