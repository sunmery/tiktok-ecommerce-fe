import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Input, Avatar, IconButton, Badge, Card, FormControl } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { assistantService } from '@/api/assistantService';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * AI客服助手组件
 * 在页面右下角显示一个可折叠的聊天窗口
 */
export default function ChatAssistant() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 切换聊天窗口
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 发送消息
  const sendMessage = async () => {
    // 修复钩子渲染问题：不要在条件语句中提前返回
    if (message.trim()) {
      // 添加用户消息到列表
      const userMessage = {
        id: Date.now().toString(),
        content: message,
        isUser: true,
        timestamp: new Date()
      };
      addMessage(userMessage);
      setMessage('');
      
      // 设置加载状态
      setIsLoading(true);
      
      try {
        // 调用助手API
        const response = await assistantService.processQuery({ question: message });
        
        // 添加助手回复
        addMessage({
          id: (Date.now() + 1).toString(),
          content: response.message,
          isUser: false,
          timestamp: new Date()
        } as Message);
      } catch (error) {
        console.error('Error sending message:', error);
        // 添加错误消息
        addMessage({
          id: (Date.now() + 1).toString(),
          content: t('chat.error', '抱歉，发生了错误，请稍后再试。'),
          isUser: false,
          timestamp: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 添加消息到列表
  const addMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  // 处理按Enter键发送消息
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage().then(data=>{
        console.log('Message sent successfully:', data);
      }).catch(err=>{
        console.error('Error sending message:', err);
      });
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 使用媒体查询检测是否为移动设备
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  // 使用 useEffect 监听媒体查询变化
  useEffect(() => {
    // 创建媒体查询
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakpoints.values.md}px)`);
    
    // 设置初始状态
    setIsMobile(mediaQuery.matches);
    
    // 创建监听器函数
    const handleMediaQueryChange = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => {
      setIsMobile(event.matches);
    };
    
    // 添加监听器
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [theme.breakpoints.values.md]); // 依赖于断点值
  
  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: isMobile ? 10 : 20, 
      right: isMobile ? 10 : 20, 
      zIndex: 1000 
    }}>
      {/* 聊天图标按钮 */}
      {!isOpen && (
        <IconButton
          onClick={toggleChat}
          size={isMobile ? "md" : "lg"}
          variant="solid"
          color="primary"
          sx={{
            borderRadius: '50%',
            boxShadow: 'md',
            width: isMobile ? 50 : 60,
            height: isMobile ? 50 : 60,
          }}
        >
          <ChatIcon />
        </IconButton>
      )}
      {/* 聊天窗口 */}
      {isOpen && (
        <Card
          variant="outlined"
          sx={{
            width: isMobile ? '90vw' : 350,
            maxWidth: '100%',
            height: isMobile ? '70vh' : 500,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'lg',
            borderRadius: 'md',
            overflow: 'hidden',
          }}
        >
          {/* 聊天头部 */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography level="title-lg">{t('chat.title', '客服在线')}</Typography>
            <IconButton
              variant="plain"
              color="neutral"
              onClick={toggleChat}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 聊天内容区域 */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'background.surface',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* 客服状态信息 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Badge color="success" badgeContent="">
                <Avatar size="sm" />
              </Badge>
              <Box>
                <Typography level="body-sm" fontWeight="bold">
                  {t('chat.supportTeam', '客服团队')}
                </Typography>
                <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                  {t('chat.lastSeen', '1 minute ago, not seen')}
                </Typography>
              </Box>
            </Box>

            {
              <>
                {/* 消息列表 */}
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                    }}
                  >
                    <Card
                      variant={msg.isUser ? 'solid' : 'soft'}
                      color={msg.isUser ? 'primary' : 'neutral'}
                      size="sm"
                      sx={{
                        '--Card-radius': '12px',
                        '--Card-paddingX': '12px',
                        '--Card-paddingY': '8px',
                      }}
                    >
                      <Typography level="body-sm">{msg.content}</Typography>
                    </Card>
                    <Typography
                      level="body-xs"
                      sx={{ mt: 0.5, color: 'text.tertiary' }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Box>
                ))}

                {/* 加载指示器 */}
                {isLoading && (
                  <Box sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <Card
                      variant="soft"
                      color="neutral"
                      size="sm"
                      sx={{
                        '--Card-radius': '12px',
                        '--Card-paddingX': '12px',
                        '--Card-paddingY': '8px',
                      }}
                    >
                      <Typography level="body-sm">...</Typography>
                    </Card>
                  </Box>
                )}

                {/* 用于自动滚动的引用元素 */}
                <div ref={messagesEndRef} />
              </>
            }
          </Box>

          {/* 消息输入区域 */}
          {
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.surface',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="lg">
                  <Input
                    placeholder={t('chat.messagePlaceholder', '输入您的消息...')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ flex: 1 }}
                  />

                </FormControl>
                <IconButton
                  size="lg"
                  color="primary"
                  variant="solid"
                  disabled={!message.trim() || isLoading}
                  onClick={sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                  {t('chat.poweredBy', 'We run on Chatra')}
                </Typography>
              </Box>
            </Box>
          }
        </Card>
      )}
    </Box>
  );
}
