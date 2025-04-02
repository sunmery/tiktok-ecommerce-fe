import {Link, Outlet, useNavigate} from '@tanstack/react-router'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Box from '@mui/joy/Box'
import {
    Avatar,
    Badge,
    Drawer,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Option,
    Select,
    Sheet,
    Tooltip,
    Typography
} from '@mui/joy'
import {useTheme} from '@mui/joy/styles'
import Person from '@mui/icons-material/Person'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import {getSigninUrl, goToLink, isLoggedIn} from '@/utils/casdoor.ts'
import {useSnapshot} from 'valtio/react'
import {setAccount, userStore} from '@/store/user.ts'
import {cartStore} from '@/store/cartStore'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {recordTranslationKeyUsage} from '@/utils/i18n'
import ChatAssistant from '@/components/ChatAssistant'
import TranslationDebugger from '@/components/TranslationDebugger'
import {log} from '@/utils/env'
import {TOptions} from 'i18next'
import {Person as PersonIcon} from "@mui/icons-material";

/**
 * 页面模板组件
 * @returns JSXElement
 */
export default function Template() {
    const cart = useSnapshot(cartStore)
    const user = useSnapshot(userStore)
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const theme = useTheme()

    // 使用 window.matchMedia 替代 useMediaQuery
    const [isMobile, setIsMobile] = useState(false)

    // 记录翻译键的使用
    const trackTranslation = (key: string) => {
        recordTranslationKeyUsage(key)
    }

    // 在使用t函数的地方，调用trackTranslation函数记录使用的翻译键
    useEffect(() => {
        // 记录所有常用的翻译键
        const commonKeys = [
            'nav.project',
            'nav.search',
            'actions.search',
            'roles.consumer',
            'roles.merchant',
            'roles.admin',
            'nav.products',
            'nav.profile',
            'profile.avatar',
            'nav.orders',
            'profile.addresses',
            'profile.payment',
            'nav.logout',
            'nav.login',
            'nav.register',
            'nav.menu',
            'nav.home',
            'nav.cart',
            'nav.language',
            'nav.switchRole'
        ]
        commonKeys.forEach(trackTranslation)
    }, [])

    // 增强版的t函数，会记录使用的翻译键
    const tWithTracking = (key: string, defaultValue?: string) => {
        trackTranslation(key)
        // 创建一个选项对象，如果有默认值则包含它
        const options: TOptions = defaultValue ? {defaultValue} : {}
        return t(key, options)
    }

    // 使用 useEffect 监听媒体查询变化
    useEffect(() => {
        // 创建媒体查询
        const mediaQuery = window.matchMedia(`(max-width: ${theme.breakpoints.values.md}px)`)

        // 设置初始状态
        setIsMobile(mediaQuery.matches)

        // 创建监听器函数
        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches)
        }

        // 添加监听器
        mediaQuery.addEventListener('change', handleMediaQueryChange)

        // 清理函数
        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange)
        }
    }, [theme.breakpoints.values.md]) // 依赖于断点值

    // 判断用户是否已登录
    const userLoggedIn = isLoggedIn() && user.account && user.account.id !== ''

    // 处理搜索提交
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate({to: '/products', search: {query: searchQuery}}).then(() => {
                // 跳转完成后的回调逻辑
            })
            if (isMobile) {
                setMobileMenuOpen(false)
            }
        }
    }

    // 处理回车键搜索
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // 角色切换处理函数
    const handleRoleChange = (newRole: string) => {
        if (user.account && user.account.owner) {
            setAccount({
                ...user.account,
                role: newRole
            })

            // 根据角色自动导航到对应页面
            if (newRole === 'merchant') {
                navigate({to: '/merchant'}).then(() => {
                    log(`用户角色:${newRole}, 已跳转到商家路由`)
                })
            } else if (newRole === 'admin') {
                navigate({to: '/admin'}).then(() => {
                    log(`用户角色:${newRole}, 已跳转到管理员路由`)
                })
            } else {
                // 普通用户角色导航到个人中心页面，而不是首页
                navigate({to: '/profile'}).then(() => {
                    log(`用户角色:${newRole}, 已跳转到用户路由`)
                    // 跳转完成后的回调逻辑
                })
            }

            if (isMobile) {
                setMobileMenuOpen(false)
            }
        }
    }

    // 处理导航链接点击，在移动端关闭菜单
    const handleNavLinkClick = () => {
        if (isMobile) {
            setMobileMenuOpen(false)
        }
    }

    // 安全的路由定义
    const routeMap = {
        orders: '/orders' as any,
        addresses: '/addresses' as any,
        creditCards: '/credit_cards' as any,
        logout: '/logout' as any,
    }

    const handleSearchKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate({to: '/products', search: {query: searchQuery.trim()}}).then(() => {
                console.log('navigate', {to: '/products', search: {query: searchQuery.trim()}})
            });
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <Sheet
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    px: {xs: 2, md: 4},
                    bgcolor: 'background.surface',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: {xs: 1, md: 3},
                        maxWidth: 1200,
                        margin: '0 auto',
                        width: '100%',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Logo部分 */}
                    <Box component={Link} to="/" sx={{display: 'flex', alignItems: 'center', textDecoration: 'none'}}>
                        <Typography level="title-lg" sx={{mr: 2, color: 'primary.500'}}>
                            {t('nav.project')}
                        </Typography>
                    </Box>

                    {/* 桌面端搜索框 */}
                    {!isMobile && (
                        <Box sx={{flex: 1, maxWidth: 600}}>
                            <Input
                                size="md"
                                placeholder={t('searchPlaceholder')}
                                startDecorator={<SearchIcon/>}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                sx={{
                                    flexBasis: '500px',
                                    display: {
                                        xs: 'none',
                                        sm: 'flex',
                                    },
                                    boxShadow: 'sm',
                                }}
                            />
                        </Box>
                    )}

                    {/* 桌面端导航菜单 */}
                    {!isMobile ? (
                        <List orientation="horizontal" sx={{gap: 3}}>
                            <ListItem>
                                <LanguageSwitcher/>
                            </ListItem>
                            {userLoggedIn && (
                                <ListItem>
                                    <Select
                                        value={user.account.role || 'consumer'}
                                        onChange={(_, value) => handleRoleChange(value as string)}
                                        sx={{minWidth: 120}}
                                    >
                                        <Option value="consumer">{tWithTracking('roles.consumer', '消费者')}</Option>
                                        <Option value="merchant">{tWithTracking('roles.merchant', '商家')}</Option>
                                        <Option value="admin">{tWithTracking('roles.admin', '管理员')}</Option>
                                    </Select>
                                </ListItem>
                            )}
                            <ListItem>
                                <Link to="/products" search={{query: ''}}
                                      style={{textDecoration: 'none', color: 'inherit'}} onClick={handleNavLinkClick}>
                                    <Typography level="title-lg">{tWithTracking('nav.products', '商品')}</Typography>
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link to="/carts" style={{textDecoration: 'none', color: 'inherit'}}
                                      onClick={handleNavLinkClick}>
                                    <Badge badgeContent={cart.items.length} color="primary">
                                        <ShoppingCartIcon sx={{fontSize: 24}}/>
                                    </Badge>
                                </Link>
                            </ListItem>
                            <ListItem>
                                {/* 个人中心按钮 */}
                                <Tooltip title={t('profile')} placement="bottom">
                                    <IconButton
                                        variant="plain"
                                        component={Link}
                                        to="/profile"
                                        color="neutral"
                                    >
                                        <PersonIcon/>
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem>
                                <Box>
                                    <Menu
                                        placement="bottom-end"
                                        sx={{
                                            minWidth: 180,
                                            '--ListItem-radius': '8px',
                                        }}
                                    >
                                        <MenuButton
                                            slots={{root: 'div'}}
                                            slotProps={{root: {className: 'user-menu-button'}}}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                bgcolor: 'background.surface',
                                                boxShadow: 'sm',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    boxShadow: 'md'
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    cursor: 'pointer',
                                                    p: 0,
                                                }}
                                            >
                                                {userLoggedIn && user.account.avatar ? (
                                                    <Avatar
                                                        size="md"
                                                        src={user.account.avatar}
                                                        alt={tWithTracking('profile.avatar', '用户头像')}
                                                    />
                                                ) : (
                                                    <Person sx={{fontSize: 24}}/>
                                                )}
                                            </Box>
                                        </MenuButton>
                                        {userLoggedIn ? (
                                            <>
                                                <MenuItem>
                                                    <Link to={routeMap.orders} style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        width: '100%'
                                                    }}>{tWithTracking('nav.orders', '我的订单')}</Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link to={routeMap.addresses} style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        width: '100%'
                                                    }}>{tWithTracking('profile.addresses', '收货地址')}</Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link to={routeMap.creditCards} style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        width: '100%'
                                                    }}>{tWithTracking('profile.payment', '支付方式')}</Link>
                                                </MenuItem>

                                                <MenuItem>
                                                    <Link to={routeMap.logout} style={{
                                                        textDecoration: 'none',
                                                        color: 'inherit',
                                                        width: '100%'
                                                    }}>{tWithTracking('nav.logout', '退出登录')}</Link>
                                                </MenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <MenuItem onClick={() => goToLink(getSigninUrl())}>
                                                    {tWithTracking('nav.login', '登录')}
                                                </MenuItem>
                                                <MenuItem onClick={() => goToLink(getSigninUrl())}>
                                                    {tWithTracking('nav.register', '注册')}
                                                </MenuItem>
                                            </>
                                        )}
                                    </Menu>
                                </Box>
                            </ListItem>
                        </List>
                    ) : (
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {/* 移动端购物车图标 */}
                            <Link to="/carts" style={{textDecoration: 'none', color: 'inherit'}}
                                  onClick={handleNavLinkClick}>
                                <Badge badgeContent={cart.items.length} color="primary">
                                    <ShoppingCartIcon sx={{fontSize: 24}}/>
                                </Badge>
                            </Link>

                            {/* 移动端菜单按钮 */}
                            <IconButton
                                variant="outlined"
                                color="neutral"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Box>
                    )}
                </Box>
            </Sheet>

            {/* 移动端抽屉菜单 */}
            <Drawer
                size="md"
                variant="plain"
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'background.surface',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }
                    }
                }}
            >
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                    <Typography level="title-lg">{tWithTracking('nav.menu', '菜单')}</Typography>
                    <IconButton onClick={() => setMobileMenuOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                {/* 移动端搜索框 */}
                <Box sx={{mb: 3}}>
                    <Input
                        size="md"
                        variant="outlined"
                        placeholder={tWithTracking('nav.search', '搜索商品')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        startDecorator={<SearchIcon/>}
                        endDecorator={
                            <IconButton onClick={handleSearch}>
                                <SearchIcon/>
                            </IconButton>
                        }
                        sx={{width: '100%'}}
                    />
                </Box>

                <List sx={{width: '100%'}}>
                    <ListItem>
                        <Link
                            to="/"
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                            onClick={handleNavLinkClick}
                        >
                            <Typography level="title-md">{tWithTracking('nav.home', '首页')}</Typography>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            to="/products"
                            search={{query: ''}}
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                            onClick={handleNavLinkClick}
                        >
                            <Typography level="title-md">{t('nav.products', '商品')}</Typography>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            to="/carts"
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                            onClick={handleNavLinkClick}
                        >
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Typography level="title-md">{tWithTracking('nav.cart', '购物车')}</Typography>
                                <Badge badgeContent={cart.items.length} color="primary"/>
                            </Box>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            to="/profile"
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                            onClick={handleNavLinkClick}
                        >
                            <Typography level="title-md">{tWithTracking('nav.profile', '个人中心')}</Typography>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            to={routeMap.orders}
                            style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                            onClick={handleNavLinkClick}
                        >
                            <Typography level="title-md">{tWithTracking('nav.orders', '我的订单')}</Typography>
                        </Link>
                    </ListItem>

                    {userLoggedIn && (
                        <ListItem>
                            <Box sx={{width: '100%'}}>
                                <Typography level="body-sm"
                                            sx={{mb: 1}}>{tWithTracking('nav.switchRole', '切换角色')}</Typography>
                                <Select
                                    value={user.account.role || 'consumer'}
                                    onChange={(_, value) => handleRoleChange(value as string)}
                                    sx={{width: '100%'}}
                                >
                                    <Option value="consumer">{tWithTracking('roles.consumer', '消费者')}</Option>
                                    <Option value="merchant">{tWithTracking('roles.merchant', '商家')}</Option>
                                    <Option value="admin">{tWithTracking('roles.admin', '管理员')}</Option>
                                </Select>
                            </Box>
                        </ListItem>
                    )}

                    <ListItem>
                        <Box sx={{width: '100%'}}>
                            <Typography level="body-sm"
                                        sx={{mb: 1}}>{tWithTracking('nav.language', '语言')}</Typography>
                            <LanguageSwitcher/>
                        </Box>
                    </ListItem>

                    {userLoggedIn ? (
                        <ListItem>
                            <Link
                                to={routeMap.logout}
                                style={{textDecoration: 'none', color: 'inherit', width: '100%'}}
                                onClick={handleNavLinkClick}
                            >
                                <Typography level="title-md"
                                            color="danger">{tWithTracking('nav.logout', '退出登录')}</Typography>
                            </Link>
                        </ListItem>
                    ) : (
                        <ListItem>
                            <Box
                                onClick={() => {
                                    goToLink(getSigninUrl());
                                    setMobileMenuOpen(false);
                                }}
                                sx={{width: '100%', cursor: 'pointer'}}
                            >
                                <Typography level="title-md"
                                            color="primary">{tWithTracking('nav.login', '登录/注册')}</Typography>
                            </Box>
                        </ListItem>
                    )}
                </List>
            </Drawer>

            <Box sx={{flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', p: 3}}>
                <Outlet/>
            </Box>

            {/* AI客服助手 */}
            <ChatAssistant/>

            {/* 翻译调试器（仅在开发环境中显示） */}
            <TranslationDebugger/>
        </Box>
    )
}
