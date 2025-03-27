import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import {Box, Container, List, ListItem, ListItemButton, Sheet, Typography} from '@mui/joy';
import {Link} from '@tanstack/react-router';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const {t} = useTranslation(['common']);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Sheet component="header" variant="outlined" sx={{py: 1}}>
                <Container
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1
                    }}
                >
                    <Typography level="h4" component="h1" sx={{fontWeight: 'bold'}}>
                        {t('common:app.title')}
                    </Typography>
                    <Box component="nav" sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <List orientation="horizontal" sx={{'--ListItem-radius': '8px'}}>
                            <ListItem>
                                <ListItemButton component={Link} to="/">
                                    {t('common:nav.home')}
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/products">
                                    {t('common:nav.products')}
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/cart">
                                    {t('common:nav.cart')}
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/profile">
                                    {t('common:nav.profile')}
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <LanguageSwitcher/>
                    </Box>
                </Container>
            </Sheet>

            <Box component="main" sx={{flexGrow: 1, py: 3}}>
                <Container>
                    {children}
                </Container>
            </Box>

            <Sheet component="footer" variant="soft" color="neutral" sx={{py: 3}}>
                <Container sx={{textAlign: 'center'}}>
                    <Typography level="body-sm" textColor="text.tertiary">
                        {t('common:app.title')} &copy; {new Date().getFullYear()}
                    </Typography>
                </Container>
            </Sheet>
        </Box>
    );
};

export default Layout; 
