import { casdoorLogin } from "./api.ts";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@mui/joy";
import Breadcrumbs from "@/shared/components/Breadcrumbs";

export default function Login() {
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
