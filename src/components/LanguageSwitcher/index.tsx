import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Select, Option } from '@mui/joy';
import { Language as LanguageIcon } from '@mui/icons-material';

/**
 * 语言切换组件
 * @returns JSX.Element
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 默认设置为英文
  
  // 组件挂载时检查localStorage中的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      // 如果保存的语言是zh，转换为zh-CN
      const normalizedLanguage = savedLanguage === 'zh' ? 'zh-CN' : savedLanguage;
      setCurrentLanguage(normalizedLanguage);
      // 如果当前语言与i18n不一致，更新i18n
      if (normalizedLanguage !== i18n.language) {
        i18n.changeLanguage(normalizedLanguage);
      }
    } else {
      // 如果没有保存的语言设置，则设置为默认语言并保存到localStorage
      localStorage.setItem('i18nextLng', 'en');
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Select
        value={currentLanguage}
        onChange={(_, value) => value && changeLanguage(value as string)}
        startDecorator={<LanguageIcon />}
        size="sm"
        sx={{ minWidth: 100 }}
      >
        <Option value="en">English</Option>
        <Option value="zh-CN">中文</Option>
      </Select>
    </Box>
  );
}