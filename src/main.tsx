// import {StrictMode} from 'react'
import React from 'react'

import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {routeTree} from './routeTree.gen'
import {CssVarsProvider} from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import theme from './theme/theme'
import {AlertProvider} from './components/AlertProvider'
import './app.css'
import {LanguageProvider} from './contexts/LanguageContext'
import './utils/i18n'
import {createRoot} from "react-dom/client"; // 导入i18n配置

// 创建路由
const router = createRouter({
    routeTree,
})

// 注册路由
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <CssVarsProvider theme={theme} defaultMode="light">
                <CssBaseline/>
                <AlertProvider>
                    <LanguageProvider>
                        <RouterProvider router={router}/>
                    </LanguageProvider>
                </AlertProvider>
            </CssVarsProvider>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    </React.StrictMode>,
)
