import {FC, MouseEvent, useState} from 'react';
import {IconButton, Menu, MenuItem, Tooltip, Typography} from '@mui/joy';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useLanguage} from '@/contexts/LanguageContext';

const LanguageSwitcher: FC = () => {
    const {language, setLanguage} = useLanguage();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: 'zh' | 'en') => {
        setLanguage(lng); // 使用上下文的setLanguage
        handleClose();
    };

    return (
        <div className="language-switcher">
            <Tooltip title="切换语言" placement="bottom">
                <IconButton
                    id="language-button"
                    aria-controls={open ? 'language-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="outlined"
                    color="neutral"
                    onClick={handleClick}
                    sx={{
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <LanguageIcon/>
                    <Typography level="body-sm">
                        {language === 'zh' ? '中文' : 'English'}
                    </Typography>
                    <KeyboardArrowDownIcon fontSize="small"/>
                </IconButton>
            </Tooltip>

            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                aria-labelledby="language-button"
            >
                <MenuItem
                    onClick={() => changeLanguage('zh')}
                    selected={language === 'zh'}
                >
                    中文
                </MenuItem>
                <MenuItem
                    onClick={() => changeLanguage('en')}
                    selected={language === 'en'}
                >
                    English
                </MenuItem>
            </Menu>
        </div>
    );
};

export default LanguageSwitcher; 
