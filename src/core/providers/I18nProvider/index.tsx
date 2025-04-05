import i18n from '@/utils/i18n';
import {I18nextProvider} from 'react-i18next';
import {ReactNode} from 'react';

interface I18nProviderProps {
    children: ReactNode;
}

/**
 * I18n提供者组件 - 使用统一的i18n实例
 * 这个组件仅作为一个单纯的包装器，不再包含独立的初始化逻辑
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({children}) => (
    <I18nextProvider i18n={i18n}>
        {children}
    </I18nextProvider>
);
