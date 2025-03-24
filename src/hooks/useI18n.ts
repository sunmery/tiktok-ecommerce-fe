import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  // 提供一个方便的工具函数来翻译指定的命名空间
  const tNS = (namespace: string, key: string, options?: any) => {
    return t(`${namespace}:${key}`, options);
  };
  
  return {
    t,
    tNS,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
  };
}; 