/// <reference types="vite/client" />
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// 确保.png文件可以被导入
declare module '*.png' {
    const content: any;
    export default content;
}

// 确保.svg文件可以被导入
declare module '*.svg' {
    const content: any;
    export default content;
}

// 扩展Window接口以支持自定义属性
interface Window {
    // 如果有需要在Window上定义的全局属性，可以在这里添加
    __TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE?: any;
}

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_HUSKY: string
    readonly VITE_URL: string
    readonly HUSKY: string
    readonly URL: string
    readonly VITE_USERS_URL: string
    readonly VITE_AUTH_URL: string
    readonly VITE_CASDOOR_URL: string
    readonly VITE_CHECKOUT_URL: string
    readonly VITE_CREDIT_CARDS_URL: string
    readonly VITE_ORDERS_URL: string
    readonly VITE_PAYMENT_URL: string
    readonly VITE_PRODUCERS_URL: string
    readonly VITE_ADDRESSES_URL: string
    readonly VITE_MERCHANTS_URL: string
    readonly VITE_BALANCER_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// 高德地图API全局类型定义
interface Window {
    _AMapSecurityConfig: {
        securityJsCode: string;
    };
}
