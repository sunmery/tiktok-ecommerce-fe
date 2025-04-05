import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Alert, Snackbar} from '@mui/joy';

// 修改AlertType定义，确保与MUI Joy的Alert组件color属性类型兼容
type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertContextType {
    showAlert: (message: string, type?: AlertType) => void;
    hideAlert: () => void;
}

// 创建AlertContext
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// 提供一个hook来使用AlertContext
export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert必须在AlertProvider内部使用');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

// AlertProvider组件
export const AlertProvider = ({children}: AlertProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<AlertType>('info');

    const showAlert = (message: string, type: AlertType = 'info') => {
        setMessage(message);
        setAlertType(type);
        setOpen(true);
    };

    const hideAlert = () => {
        setOpen(false);
    };

    // 添加事件监听器，监听自定义事件'show-alert'
    useEffect(() => {
        const handleShowAlert = (event: CustomEvent<{ message: string; type: AlertType }>) => {
            showAlert(event.detail.message, event.detail.type);
        };

        // 添加事件监听
        window.addEventListener('show-alert', handleShowAlert as EventListener);

        // 组件卸载时移除事件监听
        return () => {
            window.removeEventListener('show-alert', handleShowAlert as EventListener);
        };
    }, []);

    return (
        <AlertContext.Provider value={{showAlert, hideAlert}}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={hideAlert}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                sx={{
                    zIndex: 9999, // 增加z-index确保消息显示在最上层
                    mt: 2, // 增加顶部边距
                    '& .MuiSnackbar-content': {
                        p: 0, // 移除Snackbar内容的内边距
                        borderRadius: 0, // 移除圆角
                        overflow: 'visible' // 确保内容可见
                    }
                }}
            >
                <Alert
                    variant="solid" // 改为solid变体以增强可见性
                    color={alertType}
                    onClose={hideAlert}
                    sx={{
                        width: '100%',
                        boxShadow: 'md', // 添加阴影增强视觉效果
                        border: 'none', // 移除边框
                        borderRadius: 0, // 移除圆角
                        margin: 0, // 移除外边距
                        // padding: '12px 16px', // 调整内边距
                        fontWeight: 'medium', // 增加字体粗细以提高可读性
                        '& .MuiAlert-action': { // 调整关闭按钮位置
                            padding: '0 0 0 8px',
                            marginRight: 0
                        }
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export default AlertProvider;
