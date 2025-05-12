import { Link, useNavigate } from '@tanstack/react-router';
import Box from '@mui/joy/Box';
import {
    Avatar,
    Badge,
    Button,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Sheet,
    Tooltip,
    Typography,
    useColorScheme
} from '@mui/joy';
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

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import PaymentsIcon from '@mui/icons-material/Payments';
import BlockIcon from '@mui/icons-material/Block';
import { useSnapshot } from 'valtio/react';
import { setAccount, userStore } from '@/store/user.ts';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { log } from '@/core/conf/app';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';

import { CssVarsProvider } from '@mui/joy/styles';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import MenuIcon from '@mui/icons-material/Menu';
import { cartStore } from "@/store/cartStore.ts";
import { userService } from "@/api/userService.ts";
import { createTheme } from "@mui/material/styles";

// 定义导航项类型，扩展Navigation类型以包含权限控制
interface NavigationItem {
    segment: string;
    title: string;
    icon: React.ReactNode;
    roles?: string[];
    children?: NavigationItem[];
}

// 创建导航配置
const createNavigation = (userRole: string): Navigation => {
    // 基础导航项，所有用户可见
    const baseNavItems: NavigationItem[] = [
        {
            segment: 'auth',
            title: 'Auth',
            icon: <Person/>,
            children: [
                {
                    segment: 'login',
                    title: 'Login',
                    icon: <LoginIcon/>,
                }, {
                    segment: 'logout',
                    title: 'Logout',
                    icon: <LogoutIcon/>,
                },
            ]
        },
    ];

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

// 移除多余的空数组结束符

function useTanstackRouter(): Router {
    const navigate = useNavigate();
    return {
        pathname: window.location.pathname, // This might need to be dynamic if not re-rendering AppProvider
        searchParams: new URLSearchParams(window.location.search),
        navigate: (path: string | URL) => navigate({to: path.toString()}),
    };
}

const CustomHeader = ({children}: any) => {
    return (
        <Sheet
            variant="solid"
            color="primary"
            invertedColors
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.surface',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                backgroundColor: 'yellow',
            }}
        >
            {children}
        </Sheet>
    );
};
const demoTheme = createTheme({
    colorSchemes: {light: true, dark: true},
    cssVariables: {
        colorSchemeSelector: 'class',
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
export default function Template({children}: { children: React.ReactNode }) {
    const cart = useSnapshot(cartStore);
    const user = useSnapshot(userStore);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const {mode} = useColorScheme();
    const router = useTanstackRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hideNavigation, setHideNavigation] = useState(false);

    const userLoggedIn = userService.isLoggedIn() && user.account && user.account.id !== '';

    // 获取用户角色，默认为consumer
    const userRole = useMemo(() => {
        return user.account && user.account.role ? user.account.role : 'consumer';
    }, [user.account]);

    // 根据用户角色创建导航配置
    const navigation = useMemo(() => {
        return createNavigation(userRole);
    }, [userRole]);

    // 商品相关导航项 - 仅在用户为消费者时显示在顶部导航栏
    const topNavItems = useMemo(() => {
        if (userRole === 'consumer') {
            return [
                {to: '/products', label: t('nav.products'), icon: <StorefrontIcon/>},
                {to: '/新品上市', label: t('nav.newArrivals'), icon: <NewReleasesIcon/>},
                {to: '/趋势', label: t('nav.trends'), icon: <TrendingUpIcon/>},
                {to: '/categories', label: t('nav.categories'), icon: <CategoryIcon/>},
            ];
        }
        return [];
    }, [userRole, t]);

    // 默认隐藏侧边栏
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate({to: '/products', search: {query: searchQuery}}).then(() => {
                // callback
            });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleRoleChange = (newRole: string) => {
        if (user.account && user.account.owner) {
            setAccount({
                ...user.account,
                role: newRole,
            });
            const targetRoute = newRole === 'merchant' ? '/merchant' : newRole === 'admin' ? '/admin' : '/profile';
            navigate({to: targetRoute}).then(() => {
                log(`用户角色:${newRole}, 已跳转到对应路由`);
            });
        }
    };

    const totalCartItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AppProvider
            navigation={navigation}
            router={router}
            theme={demoTheme}
            branding={{
                logo: <img src="https://mui.com/static/logo.png" alt="MUI logo"/>,
                title: t('common.title')
            }}
        >
            <CssVarsProvider defaultMode={mode}>
                <DashboardLayout
                    hideNavigation={hideNavigation} // 是否隐藏导航栏
                    defaultSidebarCollapsed
                    navigation={navigation}
                    drawerOpen={sidebarOpen}
                    onDrawerOpenChange={setSidebarOpen}
                    appBarContent={(
                        <CustomHeader>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2,backgroundColor: 'yellow',}}>
                                <Typography component={Link} to="/" level="title-lg"
                                            sx={{color: 'inherit', textDecoration: 'none'}}>
                                    TT电商
                                </Typography>
                                <Input
                                    size="sm"
                                    placeholder={t('nav.search')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    startDecorator={<SearchIcon/>}
                                    sx={{display: {xs: 'none', md: 'flex'}}}
                                />
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
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <LanguageSwitcher/>
                                <IconButton component={Link} to="/cart" aria-label={t('nav.cart')}
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
                                {userLoggedIn ? (
                                    <Menu
                                        anchorEl={null} // This needs to be managed for Menu to work correctly
                                        open={false} // This needs to be managed for Menu to work correctly
                                    >
                                        <MenuButton
                                            slots={{root: IconButton}}
                                            slotProps={{
                                                root: {
                                                    variant: 'plain',
                                                    color: 'neutral',
                                                    sx: {color: 'inherit'}
                                                }
                                            }}
                                        >
                                            <Avatar src={user.account.avatar || undefined} size="sm">
                                                {!user.account.avatar && <Person/>}
                                            </Avatar>
                                        </MenuButton>
                                        <MenuItem
                                            onClick={() => navigate({to: '/profile'})}>{t('nav.profile')}</MenuItem>
                                        {user.account.owner && (
                                            <MenuItem
                                                onClick={() => handleRoleChange(user.account.role === 'consumer' ? 'merchant' : 'consumer')}>
                                                {user.account.role === 'consumer' ? t('nav.switchToSeller') : t('nav.switchToBuyer')}
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={() => {
                                            userService.logout();
                                            navigate({to: '/auth/login'});
                                        }}>{t('nav.logout')}</MenuItem>
                                    </Menu>
                                ) : (
                                    <Tooltip title={t('nav.login')} variant="outlined">
                                        <IconButton component={Link} to="/login" sx={{color: 'inherit'}}>
                                            <Person/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </CustomHeader>
                    )}
                >
                    <Box sx={{
                        width:'100vw',
                        flex: 1,
                        border: 0,
                        backgroundColor: 'red',
                    }}>
                        {children}
                    </Box>
                </DashboardLayout>
            </CssVarsProvider>
        </AppProvider>
    );
}
