import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {log} from '@/utils/env';

// 支持的语言
export type Language = 'zh' | 'en';

// 语言上下文类型
type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

// 创建上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 语言提供者Props
interface LanguageProviderProps {
    children: ReactNode;
}

// 从localStorage获取默认语言，如果没有则使用中文
const getDefaultLanguage = (): Language => {
    const savedLang = localStorage.getItem('language');
    log('从localStorage获取的语言:', savedLang);
    return (savedLang === 'en' ? 'en' : 'zh') as Language;
};

// 语言提供者组件
export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
    const [language, setLanguageState] = useState<Language>(getDefaultLanguage());
    const {i18n} = useTranslation();

    log('LanguageProvider初始化语言:', language);

    // 设置语言并保存到localStorage
    const setLanguage = (lang: Language) => {
        log('LanguageProvider.setLanguage被调用:', lang);
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang; // 更新HTML标签的lang属性

        // 确保i18n实例也被更新
        if (i18n.language !== lang) {
            log('更新i18n语言:', lang);
            i18n.changeLanguage(lang);
        }
    };

    // 初始化时设置文档语言
    useEffect(() => {
        log('LanguageProvider useEffect 运行, 语言:', language);
        document.documentElement.lang = language;

        // 确保i18n实例被初始化为当前语言
        if (i18n.language !== language) {
            log('初始化i18n语言:', language);
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    return (
        <LanguageContext.Provider value={{language, setLanguage}}>
            {children}
        </LanguageContext.Provider>
    );
};

// 自定义钩子，用于获取和设置当前语言
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage必须在LanguageProvider内使用');
    }
    return context;
}; 
