import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Snackbar, Stack } from '@mui/joy';
import { Slide, SlideProps } from '@mui/material';

// 定义消息类型
interface AlertMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}

// 创建上下文
const AlertContext = createContext<{
  showAlert: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}>({
  showAlert: () => {},
});

// 自定义Hook，方便在组件中使用
export const useAlert = () => useContext(AlertContext);

// 滑动动画
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

// AlertProvider组件
export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 使用数组存储多个消息
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  
  // 自动消失时间（毫秒）
  const AUTO_HIDE_DURATION = 5000;

  // 添加新消息
  const showAlert = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const newAlert: AlertMessage = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      message,
      type,
      timestamp: Date.now(),
    };
    
    // 添加新消息到数组
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    
    // 设置自动消失计时器
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, AUTO_HIDE_DURATION);
  };

  // 移除指定ID的消息
  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  // 监听自定义事件
  useEffect(() => {
    const handleShowAlert = (event: CustomEvent) => {
      const { message, type, id, timestamp } = event.detail;
      
      // 如果事件中已包含ID和时间戳，则使用它们
      const newAlert: AlertMessage = {
        id: id || Date.now() + Math.random().toString(36).substring(2, 9),
        message,
        type,
        timestamp: timestamp || Date.now(),
      };
      
      // 添加新消息到数组
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
      
      // 设置自动消失计时器
      setTimeout(() => {
        removeAlert(newAlert.id);
      }, AUTO_HIDE_DURATION);
    };

    // 添加事件监听器
    window.addEventListener('show-alert', handleShowAlert as EventListener);
    
    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('show-alert', handleShowAlert as EventListener);
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      
      {/* 消息堆叠容器 */}
      <Stack 
        spacing={1} 
        sx={{ 
          position: 'fixed', 
          top: 16, 
          right: 16, 
          zIndex: 9999,
          maxWidth: '80%',
          width: 'auto',
          maxHeight: '80vh',
          overflow: 'hidden'
        }}
      >
        {/* 对消息进行排序，最新的消息显示在顶部 */}
        {alerts
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((alert) => (
            <Snackbar
              key={alert.id}
              open={true}
              TransitionComponent={SlideTransition}
              sx={{ 
                position: 'relative', 
                transform: 'none !important',
                marginBottom: 1
              }}
            >
              <Alert
                variant="soft"
                color={alert.type}
                onClose={() => removeAlert(alert.id)}
                sx={{ 
                  width: '100%',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  animation: 'fadeIn 0.3s ease-in-out'
                }}
              >
                {alert.message}
              </Alert>
            </Snackbar>
          ))}
      </Stack>
      
      {/* 添加动画样式 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AlertContext.Provider>
  );
};

export default AlertProvider;