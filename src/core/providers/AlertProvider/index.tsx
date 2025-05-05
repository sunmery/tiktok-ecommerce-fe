import React, {createContext, useContext, useEffect, useState} from 'react';
import {Stack} from '@mui/joy';
import {Alert, AlertColor, Fade, Slide, SlideProps, Snackbar} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// 定义消息类型
interface AlertMessage {
    id: string;
    message: string;
    type: AlertColor;
    timestamp: number;
    visible: boolean; // 控制消息是否可见
}

// 创建上下文
const AlertContext = createContext<{
    showAlert: (message: string, type: AlertColor) => void;
}>({
    showAlert: () => {
    },
});

// 自定义Hook，方便在组件中使用
export const useAlert = () => useContext(AlertContext);

// 滑动动画
function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down"/>;
}

// 获取对应状态的图标
const getAlertIcon = (type: AlertColor) => {
    switch (type) {
        case 'success':
            return <CheckCircleOutlineIcon />;
        case 'error':
            return <ErrorOutlineIcon />;
        case 'warning':
            return <WarningAmberIcon />;
        case 'info':
        default:
            return <InfoOutlinedIcon />;
    }
};

// AlertProvider组件
export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // 使用数组存储多个消息
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);
    
    // 自动消失时间（毫秒）
    const AUTO_HIDE_DURATION = 5000;
    // 消息出现间隔时间（毫秒）
    const APPEAR_INTERVAL = 300;

    // 添加新消息
    const showAlert = (message: string, type: AlertColor) => {
        const newAlert: AlertMessage = {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            message,
            type,
            timestamp: Date.now(),
            visible: false, // 初始设为不可见
        };
        
        // 添加新消息到数组
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
        
        // 延迟显示消息
        setTimeout(() => {
            setAlerts((prevAlerts) => 
                prevAlerts.map(alert => 
                    alert.id === newAlert.id ? {...alert, visible: true} : alert
                )
            );
            
            // 设置自动消失计时器
            setTimeout(() => {
                handleAlertRemoval(newAlert.id);
            }, AUTO_HIDE_DURATION);
        }, APPEAR_INTERVAL * alerts.length); // 根据当前消息数量计算延迟时间
    };

    // 处理消息移除（先设置为不可见，然后移除）
    const handleAlertRemoval = (id: string) => {
        // 先将消息设为不可见
        setAlerts((prevAlerts) => 
            prevAlerts.map(alert => 
                alert.id === id ? {...alert, visible: false} : alert
            )
        );
        
        // 延迟后从数组中移除
        setTimeout(() => {
            removeAlert(id);
        }, 500); // 动画持续时间
    };

    // 移除指定ID的消息
    const removeAlert = (id: string) => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    };

    // 监听自定义事件
    useEffect(() => {
        const handleShowAlert = (event: CustomEvent) => {
            const {message, type, id, timestamp} = event.detail;
            
            // 如果事件中已包含ID和时间戳，则使用它们
            const newAlert: AlertMessage = {
                id: id || Date.now() + Math.random().toString(36).substring(2, 9),
                message,
                type,
                timestamp: timestamp || Date.now(),
                visible: false, // 初始设为不可见
            };
            
            // 添加新消息到数组
            setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
            
            // 延迟显示消息
            setTimeout(() => {
                setAlerts((prevAlerts) => 
                    prevAlerts.map(alert => 
                        alert.id === newAlert.id ? {...alert, visible: true} : alert
                    )
                );
                
                // 设置自动消失计时器
                setTimeout(() => {
                    handleAlertRemoval(newAlert.id);
                }, AUTO_HIDE_DURATION);
            }, APPEAR_INTERVAL * alerts.length); // 根据当前消息数量计算延迟时间
        };

        // 添加事件监听器
        window.addEventListener('show-alert', handleShowAlert as EventListener);
        
        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('show-alert', handleShowAlert as EventListener);
        };
    }, [alerts.length]); // 依赖项添加 alerts.length

    return (
        <AlertContext.Provider value={{showAlert}}>
            {children}
            <Stack
                spacing={1}
                sx={{
                    position: 'fixed',
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    maxWidth: '60vw',
                    width: '60vw',
                    maxHeight: '80vh',
                    overflow: 'hidden'
                }}
            >
                {alerts.map((alert) => (
                    <Fade 
                        key={alert.id}
                        in={alert.visible}
                        timeout={{
                            enter: 400,
                            exit: 400
                        }}
                    >
                        <Snackbar
                            open={true}
                            TransitionComponent={SlideTransition}
                            sx={{
                                position: 'relative',
                                transform: 'none !important',
                                width: '100%',
                                opacity: alert.visible ? 1 : 0,
                                transition: 'opacity 400ms ease-in-out',
                                '&.MuiSnackbar-root': {
                                    position: 'relative',
                                    bottom: 'auto !important'
                                }
                            }}
                        >
                            <Alert
                                variant="standard"
                                color={alert.type}
                                icon={getAlertIcon(alert.type)}
                                onClose={() => handleAlertRemoval(alert.id)}
                                sx={{
                                    width: '100%',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    '& .MuiAlert-action': {
                                        '& .MuiButtonBase-root': {
                                            marginRight: '25px'
                                        }
                                    },
                                    '& .MuiAlert-icon': {
                                        fontSize: '24px'
                                    }
                                }}
                            >
                                {alert.message}
                            </Alert>
                        </Snackbar>
                    </Fade>
                ))}
            </Stack>
        </AlertContext.Provider>
    );
};

export default AlertProvider;
