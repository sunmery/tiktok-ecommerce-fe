import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/joy';
import { authService } from '@/utils/auth';
import { useTranslation } from 'react-i18next';

export const UserProfile: React.FC = () => {
    const { t } = useTranslation();
    const role = authService.getRole();
    const roleDisplayName = authService.getRoleDisplayName(role);
    
    // 从本地存储获取安全的用户信息
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    
    // 如果是访客，显示简单的提示
    if (role === 'guest') {
        return (
            <Card>
                <CardContent>
                    <Typography level="h4" sx={{ mb: 2 }}>
                        {t('profile.welcome')}
                    </Typography>
                    <Typography>
                        {t('profile.loginPrompt')}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={profile.avatar}
                        alt={profile.displayName}
                        sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                        <Typography level="h4">
                            {profile.displayName || t('profile.noNickname')}
                        </Typography>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                            {profile.email}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {t('profile.role')}
                    </Typography>
                    <Typography level="body-lg">
                        {roleDisplayName}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}; 