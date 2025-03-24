import { Box, Sheet, Typography, IconButton, Badge, Tooltip, Input } from '@mui/joy';
import { Link } from '@tanstack/react-router';
import { ShoppingCart as ShoppingCartIcon, Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';
import { useSnapshot } from 'valtio/react';
import { cartStore } from '@/store/cartStore';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const cartSnapshot = useSnapshot(cartStore);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate({ to: '/products', search: { query: searchQuery.trim() } });
    }
  };

  return (
    <Sheet
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        boxShadow: 'sm',
        borderRadius: 0,
        p: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {/* Logo部分 */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Typography level="title-lg" sx={{ mr: 2, color: 'primary.500' }}>
            T-Commerce
          </Typography>
        </Box>

        {/* 搜索框 */}
        <Input
          size="md"
          placeholder={t('searchPlaceholder')}
          startDecorator={<SearchIcon />}
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

        {/* 右侧操作区 */}
        <Box sx={{ display: 'flex', flexShrink: 0, gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
            {/* 语言切换器 */}
            <LanguageSwitcher />
            
            {/* 购物车按钮 */}
            <Tooltip title={t('cart')} placement="bottom">
              <IconButton
                variant="plain"
                component={Link}
                to="/carts"
                color="neutral"
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={cartSnapshot.items.length} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* 个人中心按钮 */}
            <Tooltip title={t('profile')} placement="bottom">
              <IconButton
                variant="plain"
                component={Link}
                to="/profile"
                color="neutral"
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Sheet>
  );
} 