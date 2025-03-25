import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'

import {useEffect, useState} from 'react'
import {getSigninUrl, getUserinfo, goToLink, isLoggedIn, logout} from '@/utils/casdoor.ts'
import type {Account} from '@/types/account'

import {Alert, Avatar, Box, Button, Card, CardContent, Divider, Grid, Option, Select, Stack, Typography} from '@mui/joy'
import {setAccount, userStore} from '@/store/user'
import {useSnapshot} from 'valtio/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Skeleton from '@/components/Skeleton'
import { useTranslation } from 'react-i18next'

/**
 *@returns JSXElement
 */
export default function Profile() {
    const { t } = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    // 使用useQuery获取用户信息
    const { data: userInfo, error: queryError, isLoading } = useQuery({
      queryKey: ['userinfo'],
      queryFn: async () => {
        if (!isLoggedIn()) {
          navigate({ to: '/login' })
          return Promise.reject(t('error.notLoggedIn'))
        }
        
        const res = await getUserinfo()
        if (Object.keys(res).length === 0) {
          throw new Error(t('error.failedToGetUserInfo'))
        }
        
        setAccount({
            createdTime: res.createdTime,
            displayName: res.displayName,
            isDeleted: res.isDeleted,
            role: res.role,
            updatedTime: res.updatedTime,
            id: res.id,
            avatar: res.avatar,
            email: res.email,
            name: res.name,
            owner: res.owner,
        })
        return res
      },
      retry: 2,
      staleTime: 5 * 60 * 1000
    })

    // 辅助函数：判断 account 是否为空或默认状态
    const isAccountEmpty = (account: Account): boolean => {
        return !account || Object.values(account).every((value) => value === '')
    }

    // 角色切换处理函数
    const handleRoleChange = (newRole: string) => {
        if (account) {
            setAccount({
                ...account,
                role: newRole,
            })

            switch (newRole) {
                case 'merchant':
                    navigate({to: '/merchant'}).then(() => {
                        // 商家角色切换成功后的回调
                        console.log(t('log.switchedToMerchant'))
                    })
                    break
                case 'admin':
                    navigate({to: '/admin'}).then(() => {
                        // 管理员角色切换成功后的回调
                        console.log(t('log.switchedToAdmin'))
                    })
                    break
                case 'consumer':
                    navigate({to: '/profile'}).then(() => {
                        // 普通用户角色切换成功后的回调
                        console.log(t('log.switchedToConsumer'))
                    })
                    break
                default:
                    navigate({to: '/profile'}).then(() => {
                        // 普通用户角色切换成功后的回调
                        console.log(t('log.switchedToGuest'))
                    })
            }
        }
    }
    
    // 退出登录处理函数
    const handleLogout = () => {
        // 清除token和会话信息
        logout()
        
        // 清空 React Query 缓存
        queryClient.clear()
        
        // 重置账户状态
        setAccount({
            createdTime: '',
            displayName: '',
            isDeleted: false,
            role: '',
            updatedTime: '',
            id: '',
            avatar: '',
            email: '',
            name: '',
            owner: '',
        })
        
        // 导航到首页
        navigate({ to: '/' })
    }

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 显示错误信息 */}
            {queryError && (
                <Alert color="danger" sx={{mb: 2}}>
                    {queryError.message || t('error.failedToGetUserInfo')}
                </Alert>
            )}

            {isLoading ? (
                <Skeleton variant="card" height={300} />
            ) : isAccountEmpty(account) ? (
                <Card variant="outlined" sx={{textAlign: 'center', p: 4}}>
                    <Typography level="h2" sx={{mb: 2}}>
                        {t('profile.notLoggedIn')}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            size="lg"
                            color="primary"
                            variant="solid"
                            onClick={() => goToLink(getSigninUrl())}
                        >
                            {t('profile.login')}
                        </Button>
                    </Stack>
                </Card>
            ) : (
                <Stack spacing={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid xs={12} md={3} sx={{textAlign: {xs: 'center', md: 'left'}}}>
                                    <Avatar
                                        src={account.avatar}
                                        alt={account.name}
                                        sx={{width: 100, height: 100, mx: {xs: 'auto', md: 0}}}
                                    />
                                </Grid>
                                <Grid xs={12} md={9}>
                                    <Typography level="h3">
                                        {account.displayName || account.name}
                                    </Typography>
                                    <Typography level="body-md" sx={{mt: 1}}>
                                        {t('profile.email')}: {account.email}
                                    </Typography>
                                    <Typography level="body-md">
                                        {t('profile.accountId')}: {account.id}
                                    </Typography>
                                    <Typography level="body-md">
                                        {t('profile.createdTime')}: {new Date(account.createdTime).toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h4" sx={{mb: 2}}>
                                {t('profile.accountRole')}
                            </Typography>
                            <Divider sx={{my: 2}}/>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography level="body-md">
                                        {t('profile.currentRole')}: {(() => {
                                        switch (account.role) {
                                            case 'consumer':
                                                return t('roles.consumer')
                                            case 'merchant':
                                                return t('roles.merchant')
                                            case 'admin':
                                                return t('roles.admin')
                                            default:
                                                return t('roles.guest')
                                        }
                                    })()}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Typography level="body-md">
                                        {t('profile.switchRole')}:
                                    </Typography>
                                    <Select
                                        defaultValue={account.role || 'guest'}
                                        onChange={(_, value) => handleRoleChange(value as string)}
                                        sx={{minWidth: 150}}
                                    >
                                        {(account.role === null || account.role === '') &&
                                            <Option value="guest">{t('roles.guest')}</Option>
                                        }
                                        <Option value="consumer">{t('roles.consumer')}</Option>
                                        <Option value="merchant">{t('roles.merchant')}</Option>
                                        <Option value="admin">{t('roles.admin')}</Option>
                                    </Select>
                                </Box>
                            </Box>

                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h4" sx={{mb: 2}}>
                                {t('profile.accountManagement')}
                            </Typography>
                            <Divider sx={{my: 2}}/>
                            <Stack spacing={2}>
                                {/* 通用功能区 - 所有用户都显示 */}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate({to: '/addresses'}).then(() => {
                                        console.log(t('log.navigatedToAddresses'))
                                    })}
                                >
                                    {t('profile.shippingAddresses')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate({to: '/credit_cards'}).then(() => {
                                        console.log(t('log.navigatedToPaymentMethods'))
                                    })}
                                >
                                    {t('profile.paymentMethods')}
                                </Button>
                                
                                {/* 根据用户角色显示不同功能区 */}
                                {account.role === 'consumer' && (
                                    <>
                                        <Divider>{t('profile.consumerFeatures')}</Divider>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/consumer/orders'}).then(() => {
                                                console.log(t('log.navigatedToOrderHistory'))
                                            })}
                                        >
                                            {t('profile.orderHistory')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/consumer/orders'}).then(() => {
                                                console.log(t('log.navigatedToMyOrders'))
                                            })}
                                        >
                                            {t('profile.myOrders')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/consumer'}).then(() => {
                                                console.log(t('log.navigatedToConsumerCenter'))
                                            })}
                                        >
                                            {t('profile.consumerCenter')}
                                        </Button>
                                    </>
                                )}
                                
                                {account.role === 'merchant' && (
                                    <>
                                        <Divider>{t('profile.merchantFeatures')}</Divider>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/merchant'}).then(() => {
                                                console.log(t('log.navigatedToMerchantCenter'))
                                            })}
                                        >
                                            {t('profile.merchantCenter')}
                                        </Button>
                                    </>
                                )}
                                
                                {account.role === 'admin' && (
                                    <>
                                        <Divider>{t('profile.adminFeatures')}</Divider>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/admin'}).then(() => {
                                                console.log(t('log.navigatedToAdminPanel'))
                                            })}
                                        >
                                            {t('profile.adminPanel')}
                                        </Button>
                                    </>
                                )}
                                
                                <Divider />
                                
                                {/* 退出登录按钮 */}
                                <Button
                                    variant="solid"
                                    color="danger"
                                    onClick={handleLogout}
                                >
                                    {t('logout')}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            )}
        </Box>
    );
}

export const Route = createLazyFileRoute('/profile/')({  
    component: () => <Profile/>,
})
