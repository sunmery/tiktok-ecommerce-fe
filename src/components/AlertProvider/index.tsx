import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/joy';

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
export const AlertProvider = ({ children }: AlertProviderProps) => {
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
    const handleShowAlert = (event: CustomEvent<{message: string; type: AlertType}>) => {
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
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          variant="soft"
          color={alertType}
          onClose={hideAlert}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export default AlertProvider;