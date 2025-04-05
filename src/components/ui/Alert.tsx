import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ReportIcon from '@mui/icons-material/Report';
import WarningIcon from '@mui/icons-material/Warning';
import {ReactElement, useState} from 'react';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import {ColorPaletteProp} from '@mui/joy/styles';
import {useTranslation} from "react-i18next";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function AlertVariousStates(
    {
        color,
        message,
        title,
        icon,
        onClose
    }: {
        color: ColorPaletteProp,
        message: string,
        title?: string,
        icon?: ReactElement<any>,
        onClose?: () => void
    }
) {
    const [visible, setVisible] = useState(true);
    const {t} = useTranslation()

    if (!visible) {
        return null;
    }

    if (!title) {
        switch (color) {
            case 'success':
                title = t('common.success');
                break;
            case 'warning':
                title = 'Warning';
                break;
            case 'danger':
                title = 'Error';
                break;
            default:
                title = 'Info';
        }
    }

    if (!icon) {
        switch (color) {
            case 'success':
                icon = <CheckCircleIcon/>;
                break;
            case 'warning':
                icon = <WarningIcon/>;
                break;
            case 'danger':
                icon = <ReportIcon/>;
                break;
            default:
                icon = <InfoIcon/>;
        }
    }

    return <Alert
        key={title}
        sx={{
            width: '60vw',
            height: '40px',
        }}
        startDecorator={icon}
        variant="soft"
        color={color}
        endDecorator={
            <IconButton
                variant="soft"
                color={color}
                onClick={() => {
                    setVisible(false);
                    if (onClose) {
                        onClose();
                    }
                }}
            >
                <CloseRoundedIcon/>
            </IconButton>
        }
    >
        <div>
            <div>{title}</div>
            <Typography level="body-sm" color={color}>
                {message}
            </Typography>
        </div>
    </Alert>
}
