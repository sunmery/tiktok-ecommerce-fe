import i18n from 'i18next';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import {ReactNode} from 'react';

// 配置多语言资源路径
const resources = {
    en: {
        translation: require('../../public/locales/en/translation.json'),
        common: require('../../public/locales/en/common.json')
    },
    zh: {
        translation: require('../../public/locales/zh/translation.json'),
        common: require('../../public/locales/zh/common.json')
    }
};

// 初始化i18n实例
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({children}) => (
    <I18nextProvider i18n={i18n}>
        {children}
    </I18nextProvider>
);
