import {FC, ReactNode, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

interface I18nRouteWrapperProps {
    children: ReactNode;
}

/**
 * 这个组件包装所有路由页面，确保所有页面可以访问 i18n
 * 并在语言更改时自动重新渲染
 */
const I18nRouteWrapper: FC<I18nRouteWrapperProps> = ({children}) => {
    const {i18n, t} = useTranslation();

    // 监听语言变化，触发组件重新渲染
    useEffect(() => {
        // 当语言变化时，这个 effect 会重新运行
        // 因为 i18n.language 被作为依赖项

        // 这里可以添加任何需要在语言变化时执行的逻辑
        document.documentElement.lang = i18n.language;
        document.title = t('app.title');

    }, [i18n, i18n.language, t]);

    return children;
};

export default I18nRouteWrapper;
