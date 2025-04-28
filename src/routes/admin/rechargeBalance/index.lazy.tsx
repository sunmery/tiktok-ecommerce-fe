import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  FormControl, 
  FormLabel, 
  Grid, 
  Input, 
  Option, 
  Select, 
  Stack, 

  Typography 
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio/react'
import { userStore } from '@/store/user.ts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import balancerService, {
  BalanceReply,
  GetBalanceRequest,
  GetTransactionsRequest,
  RechargeBalanceRequest
} from '@/api/balancer'
import { v4 as uuidv4 } from 'uuid'

export const Route = createLazyFileRoute('/admin/rechargeBalance/')({
  component: RechargeBalance,
})


function RechargeBalance() {
  const { t } = useTranslation()
  const { account } = useSnapshot(userStore)
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [currency, setCurrency] = useState('CNY')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [paymentAccount, setPaymentAccount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [page, _] = useState(1)
  const [pageSize] = useState(10)

  // 检查用户是否为管理员，如果不是则重定向到首页
  useEffect(() => {
    if (account.role !== 'admin') {
      navigate({ to: '/' }).then(() => {
        console.log('非管理员用户，已重定向到首页')
      })
    }
  }, [account.role, navigate])

  // 获取用户余额信息
  const { 
    data: balanceData, 
    isLoading: isBalanceLoading, 
    refetch: refetchBalance 
  } = useQuery<BalanceReply>({
    queryKey: ['userBalance', userId, currency],
    queryFn: async () => {
      if (!userId || !currency) {
        throw new Error('用户ID和货币类型不能为空')
      }
      const request: GetBalanceRequest = {
        userId,
        currency,
      }
      return balancerService.getUserBalance(request)
    },
    enabled: !!userId && !!currency,
    retry: 1
  })

  // 充值操作
  const rechargeMutation = useMutation({
    mutationFn: async (rechargeData: RechargeBalanceRequest) => {
      return balancerService.rechargeBalance(rechargeData)
    },
    onSuccess: (data) => {
      setSuccess(`充值成功！交易ID: ${data.transactionId}`)
      refetchBalance() // 刷新余额
      // 重置表单
      setAmount(0)
      setPaymentAccount('')
    },
    onError: (err: Error) => {
      setError(`充值失败: ${err.message}`)
    }
  })

  // 处理充值提交
  const handleRecharge = () => {
    setError(null)
    setSuccess(null)

    // 表单验证
    if (!userId) {
      setError('请输入用户ID')
      return
    }
    if (!amount || amount <= 0) {
      setError('请输入有效的充值金额')
      return
    }
    if (!paymentAccount) {
      setError('请输入支付账号')
      return
    }

    // 创建充值请求
    const rechargeRequest: RechargeBalanceRequest = {
      userId,
      amount,
      currency,
      externalTransactionId: 0, // 生成唯一的外部交易ID
      paymentMethodType: paymentMethod,
      paymentAccount,
      idempotencyKey: uuidv4(), // 生成幂等键
      expectedVersion: balanceData?.version || 0 // 使用乐观锁版本号
    }

    // 执行充值
    rechargeMutation.mutate(rechargeRequest)
  }

  // 获取交易记录
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading
  } = useQuery({
    queryKey: ['transactions', userId, currency, page, pageSize],
    queryFn: async () => {
      if (!userId || !currency) {
        return null;
      }
      const request: GetTransactionsRequest = {
        userId,
        currency,
        page,
        pageSize,
        paymentStatus: 'ALL'
      };
      return balancerService.getTransactions(request);
    },
    enabled: !!userId && !!currency
  });

  return (
    <Box sx={{ p: 2 }}>
      <Button
        startDecorator={<ArrowBackIcon />}
        variant="plain"
        onClick={() => navigate({ to: '/admin' })}
        sx={{ mb: 2 }}
      >
        {t('admin.rechargeBalance.backToDashboard')}
      </Button>

      <Typography level="h2" sx={{ mb: 3 }}>{t('admin.rechargeBalance.title')}</Typography>

      <Grid container spacing={3}>
        {/* 充值表单 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography level="h3">{t('admin.rechargeBalance.formTitle')}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {error && (
                <Alert color="danger" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Stack spacing={2}>
                <FormControl required>
                  <FormLabel>{t('admin.rechargeBalance.userId')}</FormLabel>
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="请输入用户ID"
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>{t('admin.rechargeBalance.amount')}</FormLabel>
                  <Input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="请输入充值金额"
                    slotProps={{ input: { min: 0, step: 0.01 } }}
                  />
                </FormControl>

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
                  <FormLabel>{t('admin.rechargeBalance.paymentMethod')}</FormLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(_, value) => value && setPaymentMethod(value)}
                  >
                    <Option value="ALIPAY">支付宝</Option>
                    <Option value="WECHAT">微信支付</Option>
                    <Option value="BALANCER">银行卡</Option>
                    <Option value="BANK_CARD">余额</Option>
                  </Select>
                </FormControl>

                <FormControl required>
                  <FormLabel>{t('admin.rechargeBalance.paymentAccount')}</FormLabel>
                  <Input
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    placeholder="请输入支付账号"
                  />
                </FormControl>

                <Button
                  color="primary"
                  loading={rechargeMutation.isPending}
                  onClick={handleRecharge}
                  sx={{ mt: 2 }}
                >
                  确认充值
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 用户余额信息 */}
        <Grid xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>{t('admin.rechargeBalance.userBalancerInfo')}</Typography>
              <Divider sx={{ my: 2 }} />

              {!userId ? (
                <Typography level="body-md" sx={{ textAlign: 'center', py: 4 }}>
                  请输入用户ID查询余额信息
                </Typography>
              ) : isBalanceLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
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
                <Alert color="warning" sx={{ mb: 2 }}>
                  未找到该用户的余额信息
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 最近交易记录 */}
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography level="h3" sx={{ mb: 2 }}>{t('admin.rechargeBalance.recentTransactions')}</Typography>
              <Divider sx={{ my: 2 }} />
              
              {!userId ? (
                <Typography level="body-md" sx={{ textAlign: 'center', py: 4 }}>
                  请输入用户ID查询交易记录
                </Typography>
              ) : isTransactionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
                <Stack spacing={2}>
                  {transactionsData.transactions.map((transaction) => (
                    <Box key={transaction.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 'sm' }}>
                      <Grid container spacing={2}>
                        <Grid xs={6}>
                          <Typography level="body-sm">交易ID: {transaction.id}</Typography>
                          <Typography level="body-sm">类型: {transaction.type}</Typography>
                          <Typography level="body-sm">金额: {transaction.amount} {transaction.currency}</Typography>
                        </Grid>
                        <Grid xs={6}>
                          <Typography level="body-sm">状态: {transaction.status}</Typography>
                          <Typography level="body-sm">支付方式: {transaction.paymentMethodType}</Typography>
                          <Typography level="body-sm">创建时间: {transaction.createdAt}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Alert color="warning" sx={{ mb: 2 }}>
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
