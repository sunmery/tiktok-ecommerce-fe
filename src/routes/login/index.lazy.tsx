import {Box, Button, Typography} from '@mui/joy'
import {createLazyFileRoute} from '@tanstack/react-router'
import {userService} from '@/api/userService'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import {useTranslation} from "react-i18next";

export const Route = createLazyFileRoute('/login/')({
    component: () => <Login/>,
})

/**
 *@returns Element
 */
export default function Login() {
    const casdoorLogin = () => {
        userService.goToLink(userService.getSigninUrl())
    }
    const {t} = useTranslation()
    return (
        <Box sx={{p: 2, maxWidth: '1200px', mx: 'auto'}}>
            {/* 面包屑导航 */}
            <Breadcrumbs pathMap={{'login': t('login')}}/>

            <Typography level="h2" sx={{mb: 3}}>{t('profile.loginPrompt')}</Typography>

            <Button onClick={casdoorLogin}>{t('login')}</Button>
        </Box>
    )
}
