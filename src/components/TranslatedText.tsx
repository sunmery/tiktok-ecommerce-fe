import React, {ReactNode} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import type {TFunction} from 'i18next';
import {recordTranslationKeyUsage} from '@/utils/i18n';

interface TranslatedTextProps {
    i18nKey: string;
    children?: ReactNode;
    values?: Record<string, any>;
    components?: React.ReactElement[] | Record<string, React.ReactElement>;
    count?: number;
    defaultValue?: string;
}

/**
 * 翻译文本组件，负责显示翻译内容并记录翻译键的使用情况
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
                                                                  i18nKey,
                                                                  children,
                                                                  values,
                                                                  components,
                                                                  count,
                                                                  defaultValue
                                                              }) => {
    const {t} = useTranslation();

    // 记录翻译键的使用
    React.useEffect(() => {
        recordTranslationKeyUsage(i18nKey);
    }, [i18nKey]);

    // 如果有复杂内容（包含HTML或组件）
    if (components) {
        return (
            <Trans
                i18nKey={i18nKey}
                values={values}
                components={components}
                count={count}
                defaults={defaultValue}
            >
                {children}
            </Trans>
        );
    }

    // 简单文本翻译
    return <>{t(i18nKey, {...values, count, defaultValue})}{children}</>;
};

/**
 * 创建一个自定义的翻译hook，用于记录翻译键的使用情况
 */
export function useTrackedTranslation() {
    const translation = useTranslation();
    const {t} = translation;

    // 使用类型断言确保返回的t函数与原始t函数类型完全一致
    const trackedT = React.useCallback(
        (key: string, options?: any) => {
            recordTranslationKeyUsage(key);
            return t(key, options);
        },
        [t]
    ) as unknown as TFunction;

    return {
        ...translation,
        t: trackedT
    };
}

export default TranslatedText; 
