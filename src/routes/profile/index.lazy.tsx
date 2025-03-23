import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'

import {useEffect, useState} from 'react'
import {getSigninUrl, getUserinfo, goToLink, isLoggedIn,} from '@/utils/casdoor.ts'
import type {Account} from '@/types/account'

import {Alert, Avatar, Box, Button, Card, CardContent, Divider, Grid, Option, Select, Stack, Typography} from '@mui/joy'
import {setAccount, userStore} from '@/store/user'
import {useSnapshot} from 'valtio/react'
import { useQuery } from '@tanstack/react-query'
import Skeleton from '@/components/Skeleton'

/**
 *@returns JSXElement
 */
export default function Profile() {
    const {account} = useSnapshot(userStore)
    const navigate = useNavigate()
    
    // 使用useQuery获取用户信息
    const { data: userInfo, error: queryError, isLoading } = useQuery({
      queryKey: ['userinfo'],
      queryFn: async () => {
        if (!isLoggedIn()) {
          navigate({ to: '/login' })
          return Promise.reject('未登录')
        }
        
        const res = await getUserinfo()
        if (Object.keys(res).length === 0) {
          throw new Error('获取用户信息失败')
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
                        console.log('已切换到商家角色')
                    })
                    break
                case 'admin':
                    navigate({to: '/admin'}).then(() => {
                        // 管理员角色切换成功后的回调
                        console.log('已切换到管理员角色')
                    })
                    break
                case 'consumer':
                    navigate({to: '/profile'}).then(() => {
                        // 普通用户角色切换成功后的回调
                        console.log('已切换到普通用户角色')
                    })
                    break
                default:
                    navigate({to: '/profile'}).then(() => {
                        // 普通用户角色切换成功后的回调
                        console.log('已切换到访客角色')
                    })
            }
        }
    }

    return (
        <Box sx={{p: 2, maxWidth: 1200, margin: '0 auto'}}>
            {/* 显示错误信息 */}
            {queryError && (
                <Alert color="danger" sx={{mb: 2}}>
                    {queryError.message || '获取用户信息失败'}
                </Alert>
            )}

            {isLoading ? (
                <Skeleton variant="card" height={300} />
            ) : isAccountEmpty(account) ? (
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
                                        alt={account.name}
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
                            <Divider sx={{my: 2}}/>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Box>
                                    <Typography level="body-md">
                                        当前角色: {(() => {
                                        switch (account.role) {
                                            case 'consumer':
                                                return '消费者'
                                            case 'merchant':
                                                return '商家'
                                            case 'admin':
                                                return '管理员'
                                            default:
                                                return '访客'
                                        }
                                    })()}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <Typography level="body-md">
                                        切换角色:
                                    </Typography>
                                    <Select
                                        defaultValue={account.role || '访客'}
                                        onChange={(_, value) => handleRoleChange(value as string)}
                                        sx={{minWidth: 150}}
                                    >
                                        {(account.role === null || account.role === '') &&
                                            <Option value="">访客</Option>
                                        }
                                        <Option value="consumer">消费者</Option>
                                        <Option value="merchant">商家</Option>
                                        <Option value="admin">管理员</Option>
                                    </Select>
                                </Box>
                            </Box>

                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography level="h4" sx={{mb: 2}}>
                                账号管理
                            </Typography>
                            <Divider sx={{my: 2}}/>
                            <Stack spacing={2}>
                                {/* 通用功能区 - 所有用户都显示 */}
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
                                
                                {/* 根据用户角色显示不同功能区 */}
                                {account.role === 'consumer' && (
                                    <>
                                        <Divider>消费者功能</Divider>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/orders'}).then(() => {
                                                console.log('已跳转到订单历史页面')
                                            })}
                                        >
                                            查看订单历史
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/consumer/orders'}).then(() => {
                                                console.log('已跳转到订单历史页面')
                                            })}
                                        >
                                            我的订单
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate({to: '/consumer'}).then(() => {
                                                console.log('已跳转到消费者中心')
                                            })}
                                        >
                                            消费者中心
                                        </Button>
                                    </>
                                )}
                                
                                {account.role === 'merchant' && (
                                    <>
                                        <Divider>商家功能</Divider>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate({to: '/merchant'}).then(() => {
                                                console.log('已跳转到商家控制台')
                                            })}
                                        >
                                            商家控制台
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate({to: '/merchant/products'}).then(() => {
                                                console.log('已跳转到产品管理页面')
                                            })}
                                        >
                                            管理产品
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate({to: '/merchant/orders'}).then(() => {
                                                console.log('已跳转到订单管理页面')
                                            })}
                                        >
                                            管理订单
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate({to: '/merchant/inventory'}).then(() => {
                                                console.log('已跳转到库存管理页面')
                                            })}
                                        >
                                            库存管理
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => navigate({to: '/merchant/analytics'}).then(() => {
                                                console.log('已跳转到销售分析页面')
                                            })}
                                        >
                                            销售分析
                                        </Button>
                                    </>
                                )}
                                
                                {account.role === 'admin' && (
                                    <>
                                        <Divider>管理员功能</Divider>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => navigate({to: '/admin'}).then(() => {
                                                console.log('已跳转到管理员控制台')
                                            })}
                                        >
                                            管理员控制台
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => navigate({to: '/admin/users'}).then(() => {
                                                console.log('已跳转到用户管理页面')
                                            })}
                                        >
                                            用户管理
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => navigate({to: '/admin/analytics'}).then(() => {
                                                console.log('已跳转到数据分析页面')
                                            })}
                                        >
                                            数据分析
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => navigate({to: '/admin/database'}).then(() => {
                                                console.log('已跳转到数据库管理页面')
                                            })}
                                        >
                                            数据库管理
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => navigate({to: '/admin/ecommerce-map'}).then(() => {
                                                console.log('已跳转到电商地图页面')
                                            })}
                                        >
                                            电商地图
                                        </Button>
                                    </>
                                )}
                                
                                <Divider />
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
