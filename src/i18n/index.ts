import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // 使用 http 后端加载翻译文件
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    // 语言检测选项
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // 后端配置
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // 命名空间
    ns: ['common', 'home', 'profile', 'cart', 'checkout'],
    defaultNS: 'common',
  });

export default i18n;
