import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Sheet, 
  Chip,
  Modal,
  ModalDialog,
  Divider,
  List,
  ListItem,
  ListItemContent,
  IconButton
} from '@mui/joy';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { 
  checkUsedTranslationKeys, 
  checkUnusedTranslationKeys, 
  showTranslationCoverage 
} from '@/utils/i18n';
import { isDevelopment, showTranslationDebugger } from '@/utils/env';

/**
 * 翻译调试器组件，仅在开发环境中使用
 * 用于显示翻译覆盖率和未使用的键信息
 */
const TranslationDebugger: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [coverage, setCoverage] = useState<{
    totalKeys: number;
    usedKeys: number;
    coverage: number;
    unusedKeys: string[];
  }>({ totalKeys: 0, usedKeys: 0, coverage: 0, unusedKeys: [] });

  // 只在开发环境或明确启用了调试器时显示
  if (!isDevelopment && !showTranslationDebugger) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const refreshCoverage = () => {
    const data = showTranslationCoverage();
    setCoverage(data);
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage < 50) return 'danger';
    if (coverage < 80) return 'warning';
    return 'success';
  };

  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        size="sm"
        onClick={handleOpen}
        startDecorator={<RefreshIcon />}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          opacity: 0.7,
          '&:hover': {
            opacity: 1
          }
        }}
      >
        翻译调试
      </Button>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          variant="outlined"
          size="lg"
          sx={{
            maxWidth: 800,
            maxHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography level="h4">翻译覆盖率调试器</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography level="title-md">
                覆盖率:
                <Chip
                  color={getCoverageColor(coverage.coverage)}
                  sx={{ ml: 1 }}
                >
                  {coverage.coverage.toFixed(2)}%
                </Chip>
              </Typography>
              <Typography level="body-sm">
                已使用: {coverage.usedKeys} / 总计: {coverage.totalKeys} 键
              </Typography>
            </Box>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<RefreshIcon />}
              onClick={refreshCoverage}
            >
              刷新数据
            </Button>
          </Box>

          <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
            <Typography level="title-md" sx={{ mb: 2 }}>
              未使用的翻译键 ({coverage.unusedKeys.length})
            </Typography>
            {coverage.unusedKeys.length > 0 ? (
              <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {coverage.unusedKeys.map((key) => (
                  <ListItem key={key}>
                    <ListItemContent>
                      <Typography level="body-sm" fontFamily="monospace">
                        {key}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography level="body-sm" color="success">
                没有未使用的翻译键，太棒了！
              </Typography>
            )}
          </Sheet>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleClose}
            >
              关闭
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TranslationDebugger; 