// 读取配置
import SDK from "casdoor-js-sdk";
import { CASDOOR_CONF } from '@/core/conf/casdoor.ts'

export const CASDOOR_SDK = new SDK(CASDOOR_CONF)

// 获取登录接口的URL
export const getSigninUrl = () => {
    return CASDOOR_SDK.getSigninUrl()
}

export const goToLink = (link: string) => {
    // 检查是否在TanstackRouter环境中
    if (typeof window !== 'undefined' && window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE) {
        // 使用TanstackRouter的导航API
        const router = window.__TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE.router;
        if (router) {
            router.navigate({to: link, replace: true});
            return;
        }
    }

    // 如果不在TanstackRouter环境中，则使用传统方式
    window.location.replace(link);
}

export const casdoorLogin = () => {
    goToLink(getSigninUrl())
}
