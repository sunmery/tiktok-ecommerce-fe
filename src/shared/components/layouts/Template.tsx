import { Link, useNavigate } from '@tanstack/react-router';
import { Chip, TextField } from '@mui/material';
import { Badge, Box, Button, IconButton, Stack, Tooltip, Typography, useColorScheme } from '@mui/joy';
import Person from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import PaymentsIcon from '@mui/icons-material/Payments';
import BlockIcon from '@mui/icons-material/Block';
import { useSnapshot } from 'valtio/react';
import { userStore } from '@/store/user.ts';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ChangeEvent, Fragment, MouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppProvider, Navigation, Router, type Session } from '@toolpad/core/AppProvider';
import { CssVarsProvider } from '@mui/joy/styles';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import MenuIcon from '@mui/icons-material/Menu';
import { cartStore } from "@/store/cartStore.ts";
import { userService } from "@/api/userService.ts";
import { createTheme } from "@mui/material/styles";

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Popover from '@mui/material/Popover';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import SettingsIcon from '@mui/icons-material/Settings';
import SidebarFooterAccount from "@/shared/components/layouts/SidebarFooterAccount.tsx";

// 定义导航项类型，扩展Navigation类型以包含权限控制
interface NavigationItem {
    segment: string;
    title: string;
    icon: ReactNode;
    roles?: string[];
    children?: NavigationItem[];
}

// 创建导航配置
const createNavigation = (userRole: string): Navigation => {
    // 基础导航项，所有用户可见
    const baseNavItems: NavigationItem[] = [];

    // 商品相关导航项 - 对于消费者角色，这些会显示在顶部导航栏而不是侧边栏
    const productNavItems: NavigationItem[] = [
        {
            segment: 'products',
            title: 'Products',
            icon: <StorefrontIcon/>,
        },
        {
            segment: '新品上市',
            title: '新品上市',
            icon: <NewReleasesIcon/>,
        },
        {
            segment: '趋势',
            title: '趋势',
            icon: <TrendingUpIcon/>,
        },
        {
            segment: 'categories',
            title: 'Categories',
            icon: <CategoryIcon/>,
        },
        {
            segment: 'carts',
            title: 'Cart',
            icon: <ShoppingCartIcon/>,
        },
    ];

    // 消费者特定导航项 - 直接展示用户相关功能，不再嵌套在consumer下
    const consumerNavItems: NavigationItem[] = [
        {
            segment: 'profile',
            title: 'Dashboard',
            icon: <Person/>,
        },
        {
            segment: 'consumer/addresses',
            title: 'Addresses',
            icon: <HomeIcon/>,
        },
        {
            segment: 'consumer/creditCards',
            title: 'CreditCards',
            icon: <CreditCardIcon/>,
        },
        {
            segment: 'consumer/favorites',
            title: 'Favorites',
            icon: <FavoriteIcon/>,
        },
        {
            segment: 'consumer/map',
            title: 'Map',
            icon: <MapIcon/>,
        },
        {
            segment: 'consumer/orders',
            title: 'Orders',
            icon: <ReceiptIcon/>,
        },
        {
            segment: 'consumer/transactions',
            title: 'Transactions',
            icon: <PaymentsIcon/>,
        },
    ];

    // 商家特定导航项
    const merchantNavItems: NavigationItem[] = [
        {
            segment: 'merchant',
            title: 'MerchantDashboard',
            icon: <StorefrontIcon/>,
            roles: ['merchant'],
            children: [
                {
                    segment: 'addresses',
                    title: 'Addresses',
                    icon: <HomeIcon/>,
                },
                {
                    segment: 'analytics',
                    title: 'Analytics',
                    icon: <BarChartIcon/>,
                },
                {
                    segment: 'inventory',
                    title: 'Inventory',
                    icon: <InventoryIcon/>,
                    children: [
                        {
                            segment: 'alerts',
                            title: 'Alerts',
                            icon: <NotificationsIcon/>,
                        }, {
                            segment: 'monitoring',
                            title: 'Monitoring',
                            icon: <MonitorHeartIcon/>,
                        },
                    ]
                },
                {
                    segment: 'logistics',
                    title: 'Logistics',
                    icon: <LocalShippingIcon/>,
                },
                {
                    segment: 'orders',
                    title: 'Orders',
                    icon: <ReceiptIcon/>,
                }, {
                    segment: 'products',
                    title: 'Products',
                    icon: <StorefrontIcon/>,
                    children: [
                        {
                            segment: 'bulkUploads',
                            title: 'Bulk Uploads',
                            icon: <UploadFileIcon/>,
                        }
                    ]
                }, {
                    segment: 'table',
                    title: 'Table',
                    icon: <TableChartIcon/>,
                },
            ]
        }]

    // 管理员特定导航项
    const adminNavItems: NavigationItem[] = [
        {
            segment: 'admin',
            title: 'AdminDashboard',
            icon: <AdminPanelSettingsIcon/>,
            roles: ['admin'],
            children: [
                {
                    segment: 'products',
                    title: 'Products',
                    icon: <StorefrontIcon/>,
                },
                {
                    segment: 'analytics',
                    title: 'Analytics',
                    icon: <BarChartIcon/>,
                },
                {
                    segment: 'rechargeBalance',
                    title: 'Recharge Balance',
                    icon: <AccountBalanceWalletIcon/>,
                },
                {
                    segment: 'sensitiveWords',
                    title: 'Sensitive Words',
                    icon: <BlockIcon/>,
                },
            ]
        },
    ];

    // 根据用户角色过滤导航项
    let navItems = [...baseNavItems];

    if (userRole === 'consumer') {
        // 对于消费者，商品相关导航会显示在顶部导航栏，这里只添加用户相关导航
        navItems = [...navItems, ...consumerNavItems];
    } else {
        // 对于非消费者角色，商品相关导航显示在侧边栏
        navItems = [...navItems, ...productNavItems];

        if (userRole === 'merchant') {
            navItems = [...navItems, ...merchantNavItems];
        } else if (userRole === 'admin') {
            navItems = [...navItems, ...adminNavItems];
        }
    }

    return navItems as Navigation;
};

function useTanstackRouter(): Router {
    const navigate = useNavigate();
    return {
        pathname: window.location.pathname, // This might need to be dynamic if not re-rendering AppProvider
        searchParams: new URLSearchParams(window.location.search),
        navigate: (path: string | URL) => navigate({to: path.toString()}),
    };
}

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
        light: true,
        dark: true,

    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});
export default function Template({children}: { children: ReactNode }) {
    const user = useSnapshot(userStore);
    const navigate = useNavigate();
    const {t} = useTranslation();
    // 获取用户角色，默认为consumer
    const userRole = useMemo(() => {
        return user.account && user.account.role ? user.account.role : 'consumer';
    }, [user.account]);
    // 根据用户角色创建导航配置
    const navigation = useMemo(() => {
        return createNavigation(userRole);
    }, [userRole]);

    const {mode} = useColorScheme();
    const router = useTanstackRouter();

    const [session, setSession] = useState<Session | null>(null);

    const userLoggedIn = userService.isLoggedIn() && user.account && user.account.id !== '';

    useEffect(() => {
        if (userLoggedIn) {
            setSession({
                user: {
                    name: user.account?.name,
                    email: user.account?.email,
                    image: user.account?.avatar,
                }
            });
        }
    }, [userLoggedIn, user.account]);

    const authentication = useMemo(() => {
        return {
            signIn: () => {
                setSession(session);
                navigate({to: '/auth/login'}).then(() => {
                }).catch((err) => {
                    console.error(err);
                });
            },
            signOut: () => {
                setSession(null);
                navigate({to: '/auth/logout'}).then(() => {
                }).catch((err) => {
                    console.error(err);
                });
            },
        };
    }, []);

    const cart = useSnapshot(cartStore);
    const [sidebarOpen, setSidebarOpen] = useState(false);


    // 商品相关导航项 - 仅在用户为消费者时显示在顶部导航栏
    const topNavItems = useMemo(() => {
        if (userRole === 'consumer') {
            return [
                {to: '/products', label: t('nav.products'), icon: <StorefrontIcon/>},
                {to: '/newArrivals', label: t('nav.newArrivals'), icon: <NewReleasesIcon/>},
                {to: '/trends', label: t('nav.trends'), icon: <TrendingUpIcon/>},
                {to: '/categories', label: t('nav.categories'), icon: <CategoryIcon/>},
            ];
        }
        return [];
    }, [userRole, t]);
    const totalCartItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // 默认隐藏侧边栏
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <AppProvider
            authentication={authentication}
            session={session}
            navigation={navigation}
            router={router}
            theme={demoTheme}
            branding={{
                logo: <img src="https://mui.com/static/logo.png" alt="logo"/>,
                title: t('common.title')
            }}
        >
            <CssVarsProvider defaultMode={mode}>
                <DashboardLayout
                    hideNavigation={sidebarOpen} // 是否隐藏导航栏
                    defaultSidebarCollapsed
                    navigation={navigation}
                    drawerOpen={sidebarOpen}
                    onDrawerOpenChange={setSidebarOpen}
                    slots={{
                        appTitle: () => (<Stack direction="row" alignItems="center" spacing={2}>
                            <Typography
                                component={Link}
                                to="/"
                                level="title-lg"
                                sx={{
                                    color: 'inherit',
                                    textDecoration: 'none'
                                }}>
                                {t('common.title')}
                            </Typography>
                            <CloudCircleIcon fontSize="large" color="primary"/>
                            <Chip size="small" label="BETA" color="info"/>

                            {/* 消费者角色的顶部导航栏商品相关导航 */}
                            {userRole === 'consumer' && (
                                <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 1}}>
                                    {topNavItems.map((item) => (
                                        <Button
                                            key={item.to}
                                            component={Link}
                                            to={item.to}
                                            variant="plain"
                                            color="neutral"
                                            startDecorator={item.icon}
                                            sx={{color: 'inherit'}}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>
                            )}
                            <LanguageSwitcher/>
                            <CustomThemeSwitcher/>
                            <IconButton component={Link} to="/carts" aria-label={t('nav.cart')}
                                        sx={{color: 'inherit'}}>
                                <Badge badgeContent={totalCartItems} color="danger">
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                            {/* 用户中心按钮 - 控制侧边栏显示 */}
                            {userLoggedIn && (
                                <IconButton
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    sx={{color: 'inherit'}}
                                >
                                    <MenuIcon/>
                                </IconButton>
                            )}
                        </Stack>),
                        toolbarActions: ToolbarActionsSearch,
                        toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount
                    }}
                >
                    <Box sx={{
                        width: '100vw',
                        flex: 1,
                        border: 0,
                    }}>

                        {children}
                    </Box>
                </DashboardLayout>
            </CssVarsProvider>
        </AppProvider>
    );
}

function ToolbarActionsSearch() {
    return (
        <Stack direction="row">
            <Tooltip title="Search" enterDelay={1000}>
                <div>
                    <IconButton
                        type="button"
                        aria-label="search"
                        sx={{
                            display: {xs: 'inline', md: 'none'},
                        }}
                    >
                        <SearchIcon/>
                    </IconButton>
                </div>
            </Tooltip>
            <TextField
                label="Search"
                variant="outlined"
                size="small"
                slotProps={{
                    input: {
                        endAdornment: (
                            <IconButton type="button" aria-label="search">
                                <SearchIcon/>
                            </IconButton>
                        ),
                        sx: {pr: 0.5},
                    },
                }}
                sx={{display: {xs: 'none', md: 'inline-block'}, mr: 1}}
            />
            <ThemeSwitcher/>
        </Stack>
    );
}

function CustomThemeSwitcher() {
    const {setMode} = useColorScheme();

    const handleThemeChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setMode(event.target.value as 'light' | 'dark' | 'system');
        },
        [setMode],
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const toggleMenu = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
            setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
        },
        [isMenuOpen],
    );

    return (
        <Fragment>
            <Tooltip title="Settings" enterDelay={1000}>
                <div>
                    <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
                        <SettingsIcon/>
                    </IconButton>
                </div>
            </Tooltip>
            <Popover
                open={isMenuOpen}
                anchorEl={menuAnchorEl}
                onClose={toggleMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableAutoFocus
            >
                <Box sx={{p: 2}}>
                    <FormControl>
                        <FormLabel id="custom-theme-switcher-label">Theme</FormLabel>
                        <RadioGroup
                            aria-labelledby="custom-theme-switcher-label"
                            defaultValue="system"
                            name="custom-theme-switcher"
                            onChange={handleThemeChange}
                        >
                            <FormControlLabel value="light" control={<Radio/>} label="Light"/>
                            <FormControlLabel value="system" control={<Radio/>} label="System"/>
                            <FormControlLabel value="dark" control={<Radio/>} label="Dark"/>
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Popover>
        </Fragment>
    );
}
