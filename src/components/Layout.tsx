import {useTranslation} from 'react-i18next';
import {Box, Container, CssBaseline, Sheet, Typography} from '@mui/joy';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {t} = useTranslation();
    
    return (
        <Sheet sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <CssBaseline />
            <Box component="header" sx={{p: 2, borderBottom: '1px solid', borderColor: 'divider'}}>
                <Typography level="h4" component="h1">
                    {t('app.title')}
                </Typography>
            </Box>
            <Box component="main" sx={{flex: 1, py: 2}}>
                <Container>
                    {children}
                </Container>
            </Box>
            <Box component="footer" sx={{p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center'}}>
                <Typography level="body-sm">
                    &copy; {new Date().getFullYear()} {t('app.title')}
                </Typography>
            </Box>
        </Sheet>
    );
};

export default Layout; 
