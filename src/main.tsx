import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {routeTree} from './routeTree.gen'
import {CssVarsProvider, CssVarsProvider as JoyCssVarsProvider} from '@mui/joy/styles'
import theme from '@/core/conf/theme'
import './app.css'
import {LanguageProvider} from '@/core/providers/I18nProvider/LanguageContext'
import {I18nProvider} from '@/core/providers/I18nProvider'
import {scan} from "react-scan";
import AlertProvider from "@/core/providers/AlertProvider";
import {createTheme, THEME_ID as MATERIAL_THEME_ID, ThemeProvider,} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const materialTheme = createTheme();

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

scan({
    enabled: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={{[MATERIAL_THEME_ID]: materialTheme}}>
            <CssVarsProvider theme={theme} defaultMode="dark">
                <I18nProvider>
                    <LanguageProvider>
                        <JoyCssVarsProvider>
                            <CssBaseline enableColorScheme/>
                            <AlertProvider>
                                <RouterProvider router={router}/>
                            </AlertProvider>
                        </JoyCssVarsProvider>
                    </LanguageProvider>
                </I18nProvider>
            </CssVarsProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
)
