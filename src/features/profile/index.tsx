import { useNavigate} from '@tanstack/react-router'
import {userService} from '@/api/userService'
import type {Account} from '@/types/account'

import {Alert, Avatar, Box, Button, Card, CardContent, Divider, Grid, Stack, Typography} from '@mui/joy'
import {setAccount, userStore} from '@/store/user'
import {useSnapshot} from 'valtio/react'
import {useQuery} from '@tanstack/react-query'
import {useTranslation} from 'react-i18next'
import Skeleton from '@/shared/components/Skeleton'
import { getSigninUrl, goToLink } from "@/features/auth/login/api.ts";

/**
 *@returns JSXElement
 */
export default function Profile() {
    const {t} = useTranslation()
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()

    // 使用useQuery获取用户信息
    const {error: queryError, isLoading} = useQuery({
        queryKey: ['userinfo'],
        queryFn: async () => {
            if (!userService.isLoggedIn()) {
                await navigate({to: '/auth/login'})
                return Promise.reject(t('error.notLoggedIn'))
            }

            const res = await userService.getUserinfo()
            if (Object.keys(res).length === 0) {
                throw new Error(t('error.failedToGetUserInfo'))
            }

            // 将后端"user"角色映射为前端"consumer"角色
            const frontendRole = res.role === 'user' ? 'consumer' : res.role;

            setAccount({
                createdTime: res.createdTime,
                displayName: res.displayName,
                isDeleted: res.isDeleted,
                role: frontendRole, // 使用映射后的角色
                updatedTime: res.updatedTime,
                id: res.id,
                avatar: res.avatar,
                email: res.email,
                name: res.name,
                owner: res.owner,
                phone: res.phone,
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

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 显示错误信息 */}
            {queryError && (
                <Alert color="danger" sx={{mb: 2}}>
                    {queryError.message || t('error.failedToGetUserInfo')}
                </Alert>
            )}

            {isLoading ? (
                <Skeleton variant="card" height={300}/>
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
                                    <Typography level="body-md" sx={{mt: 1}}>
                                        {t('profile.phone')}: {account.phone}
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
                            </Box>
                        </CardContent>
                    </Card>

                </Stack>
            )}
        </Box>
    );
}
