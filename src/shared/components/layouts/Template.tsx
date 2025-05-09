import { Link, useNavigate } from '@tanstack/react-router';
import Box from '@mui/joy/Box';
import {
    Avatar,
    Badge,
    GlobalStyles,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Sheet,
    Tooltip,
    Typography
} from '@mui/joy';
import Person from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSnapshot } from 'valtio/react';
import { setAccount, userStore } from '@/store/user.ts';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { log } from '@/core/conf/app';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';

import { CssVarsProvider } from '@mui/joy/styles';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { cartStore } from "@/store/cartStore.ts";
import { userService } from "@/api/userService.ts";

const NAVIGATION: Navigation = [
    {
        segment: 'auth',
        title: 'Auth',
        icon: <ShoppingCartIcon/>,
        children: [
            {
                segment: 'login',
                title: 'Login',
                icon: <ShoppingCartIcon/>,
            }, {
                segment: 'logout',
                title: 'Logout',
                icon: <ShoppingCartIcon/>,
            },
        ]
    },
    {
        segment: 'products',
        title: 'Products',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: '新品上市',
        title: '新品上市',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: '趋势',
        title: '趋势',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: 'categories',
        title: 'Categories',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: 'carts',
        title: 'Cart',
        icon: <ShoppingCartIcon/>,
    },
    {
        segment: 'profile',
        title: 'Dashboard',
        icon: <Person/>,
    },
    {
        segment: 'merchant',
        title: 'MerchantDashboard',
        icon: <Person/>,
        children: [
            {
                segment: 'addresses',
                title: 'addresses',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'analytics',
                title: 'Analytics',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'inventory',
                title: 'inventory',
                icon: <ShoppingCartIcon/>,
                children: [
                    {
                        segment: 'alerts',
                        title: 'alerts',
                        icon: <ShoppingCartIcon/>,
                    }, {
                        segment: 'monitoring',
                        title: 'monitoring',
                        icon: <ShoppingCartIcon/>,
                    },
                ]
            },
            {
                segment: 'logistics',
                title: 'logistics',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'orders',
                title: 'orders',
                icon: <ShoppingCartIcon/>,
            }, {
                segment: 'products',
                title: 'products',
                icon: <ShoppingCartIcon/>,
                children: [
                    {
                        segment: 'bulkUploads',
                        title: 'bulkUploads',
                        icon: <ShoppingCartIcon/>,
                    }
                ]
            }, {
                segment: 'table',
                title: 'table',
                icon: <ShoppingCartIcon/>,
            },
        ]
    },
    {
        segment: 'consumer',
        title: 'ConsumerDashboard',
        icon: <Person/>,
        children: [
            {
                segment: 'addresses',
                title: 'Addresses',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'creditCards',
                title: 'CreditCards',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'favorites',
                title: 'Favorites',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'map',
                title: 'map',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'orders',
                title: 'orders',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'transactions',
                title: 'transactions',
                icon: <ShoppingCartIcon/>,
            },
        ]
    },
    {
        segment: 'admin',
        title: 'AdminDashboard',
        icon: <Person/>,
        children: [
            {
                segment: 'products',
                title: 'Products',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'analytics',
                title: 'Analytics',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'rechargeBalance',
                title: 'RechargeBalance',
                icon: <ShoppingCartIcon/>,
            },
            {
                segment: 'sensitiveWords',
                title: 'SensitiveWords',
                icon: <ShoppingCartIcon/>,
            },
        ]
    },

];

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
            }}
        >
            {children}
        </Sheet>
    );
};

export default function Template({children}: { children: React.ReactNode }) {
    const cart = useSnapshot(cartStore);
    const user = useSnapshot(userStore);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    // const theme = useTheme(); // Joy UI theme
    const router = useTanstackRouter();

    const userLoggedIn = userService.isLoggedIn() && user.account && user.account.id !== '';

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
        <AppProvider navigation={NAVIGATION} router={router}>
            <CssVarsProvider>
                <GlobalStyles styles={{body: {margin: 0}}}/>
                <DashboardLayout
                    navigation={NAVIGATION}
                    appBarContent={(
                        <CustomHeader>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Typography component={Link} to="/" level="title-lg"
                                            sx={{color: 'inherit', textDecoration: 'none'}}>
                                    {t('nav.project')}
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
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <LanguageSwitcher/>
                                <IconButton component={Link} to="/cart" aria-label={t('nav.cart')}
                                            sx={{color: 'inherit'}}>
                                    <Badge badgeContent={totalCartItems} color="danger">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                </IconButton>
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
                    <PageContainer sx={{
                        overflowY: 'auto',
                        height: 'calc(100vh - 64px)'
                    }}> {/* Adjust 64px based on actual header height */}
                        {children}
                    </PageContainer>
                </DashboardLayout>
            </CssVarsProvider>
        </AppProvider>
    );
}
