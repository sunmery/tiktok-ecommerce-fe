import {createLazyFileRoute} from '@tanstack/react-router'

import {useState, useEffect} from 'react'
import {
    getSigninUrl,
    getUserinfo,
    goToLink,
    isLoggedIn,
} from '@/utils/casdoor.ts'
import type {Account} from '@/types/account'

import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography,
    Avatar,
    Select, Option,
    Alert
} from '@mui/joy'
import {setAccount, userStore} from '@/store/user'
import {useSnapshot} from 'valtio/react'
import {useNavigate} from '@tanstack/react-router'

/**
 *@returns JSXElement
 */
export default function Profile() {
    const {account} = useSnapshot(userStore)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // 辅助函数：判断 account 是否为空或默认状态
    const isAccountEmpty = (account: Account): boolean => {
        return !account || Object.values(account).every((value) => value === '')
    }

    // 角色切换处理函数
    const handleRoleChange = (newRole: string) => {
        if (account && account.owner) {
            setAccount({
                ...account,
                role: newRole
            })
            
            // 根据角色自动导航到对应页面
            if (newRole === 'merchant') {
                navigate({ to: '/merchant' }).then(() => {
                    // 商家角色切换成功后的回调
                    console.log('已切换到商家角色')
                })
            } else if (newRole === 'admin') {
                navigate({ to: '/admin' }).then(() => {
                    // 管理员角色切换成功后的回调
                    console.log('已切换到管理员角色')
                })
            } else {
                navigate({ to: '/' }).then(() => {
                    // 普通用户角色切换成功后的回调
                    console.log('已切换到普通用户角色')
                })
            }
        }
    }

    // 在组件挂载时获取用户信息
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate({ to: '/login' }).then(() => {
                console.log('获取用户信息出错，已重定向到登录页面')
            }).then(() => {
                console.log('未登录，已重定向到登录页面')
            })
            return
        }

        // 如果已经有用户信息，则不需要重新获取
        if (!isAccountEmpty(account)) {
            return
        }

        setError(null) // 重置错误状态
        getUserinfo().then((res) => {
            // 检查返回的结果是否为空对象（表示出错）
            if (res && Object.keys(res).length === 0) {
                setError('获取用户信息失败，请检查您的登录状态或稍后再试')
                navigate({ to: '/login' }).then(() => {
                console.log('获取用户信息出错，已重定向到登录页面')
            }).then(() => {
                    console.log('获取用户信息失败，已重定向到登录页面')
                })
                return
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
        }).catch(err=>{
            console.error(err)
            setError('获取用户信息时发生错误：' + (err.message || '未知错误'))
            navigate({ to: '/login' }).then(() => {
                console.log('获取用户信息出错，已重定向到登录页面')
            })
        })
    }, []) // 仅在组件挂载时执行

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 显示错误信息 */}
            {error && (
                <Alert color="danger" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            
            {isAccountEmpty(account) ? (
                <Card variant="outlined" sx={{textAlign: 'center', p: 4}}>
                    <Typography level="h2" sx={{mb: 2}}>
                        您尚未登录
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            size="lg"
                            color="primary"
                            variant="solid"
                            onClick={() => goToLink(getSigninUrl())}
                        >
                            登录
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
                                        alt={account.displayName || account.name}
                                        sx={{width: 100, height: 100, mx: {xs: 'auto', md: 0}}}
                                    />
                                </Grid>
                                <Grid xs={12} md={9}>
                                    <Typography level="h3">
                                        {account.displayName || account.name}
                                    </Typography>
                                    <Typography level="body-md" sx={{mt: 1}}>
                                        邮箱: {account.email}
                                    </Typography>
                                    <Typography level="body-md">
                                        账号ID: {account.id}
                                    </Typography>
                                    <Typography level="body-md">
                                        创建时间: {new Date(account.createdTime).toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h4" sx={{mb: 2}}>
                                账号角色
                            </Typography>
                            <Divider sx={{my: 2}} />
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Typography level="body-md">
                                    当前角色: {account.role === 'admin' ? '管理员' : account.role === 'merchant' ? '商家' : '消费者'}
                                </Typography>
                                <Select
                                    defaultValue={account.role}
                                    onChange={(_, value) => handleRoleChange(value as string)}
                                    sx={{minWidth: 150}}
                                >
                                    <Option value="consumer">消费者</Option>
                                    <Option value="merchant">商家</Option>
                                    <Option value="admin">管理员</Option>
                                </Select>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h4" sx={{mb: 2}}>
                                账号管理
                            </Typography>
                            <Divider sx={{my: 2}} />
                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate({to: '/addresses'}).then(() => {
                console.log('已跳转到地址管理页面')
            })}
                                >
                                    管理收货地址
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate({to: '/credit_cards'}).then(() => {
                console.log('已跳转到信用卡管理页面')
            })}
                                >
                                    管理支付方式
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate({to: '/orders'}).then(() => {
                console.log('已跳转到订单管理页面')
            })}
                                >
                                    查看订单历史
                                </Button>
                                <Button
                                    variant="solid"
                                    color="danger"
                                    onClick={() => navigate({to: '/logout'}).then(() => {
                console.log('已跳转到登出页面')
            })}
                                >
                                    退出登录
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            )}
        </Box>
    )
}

export const Route = createLazyFileRoute('/profile/')({  
    component: () => <Profile/>,
})
