import { casdoorLogin } from "./api.ts";
import { useTranslation } from "react-i18next";
import { Box, Button, Card, Container, Divider, Stack, Typography } from "@mui/joy";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { LoginOutlined } from "@mui/icons-material";

export default function Login() {
    const {t} = useTranslation()
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #8a56e8 0%, #cf9eff 100%)',
            p: 2
        }}>
            <Container maxWidth="md" sx={{py: 4}}>
                <Card variant="outlined" sx={{
                    p: 4,
                    maxWidth: 600,
                    mx: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 3}}>
                        <LoginOutlined sx={{fontSize: 28, color: 'primary.500'}} />
                        <Typography level="h2">{t('login')}</Typography>
                    </Stack>

                    <Typography level="body-md" sx={{mb: 4, color: 'neutral.600'}}>
                        {t('profile.loginPrompt')}
                    </Typography>
                    
                    <Box sx={{textAlign: 'center', mt: 2}}>
                        <Button 
                            onClick={casdoorLogin} 
                            size="lg" 
                            sx={{
                                px: 4, 
                                py: 1, 
                                borderRadius: '8px',
                                background: 'linear-gradient(90deg, #6a3de8 0%, #9d71e8 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #5a2de8 0%, #8d61e8 100%)',
                                }
                            }}
                        >
                            {t('login')}
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    )
}
