// 全局类型声明

interface TanStackRouterDevtoolsGlobalHandle {
    router: {
        navigate: (options: { to: string; replace: boolean }) => void;
    };
}

declare global {
    interface Window {
        __TANSTACK_ROUTER_DEVTOOLS_GLOBAL_HANDLE?: TanStackRouterDevtoolsGlobalHandle;
    }
}
