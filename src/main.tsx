import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {CssVarsProvider} from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import '@fontsource/inter'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import './i18n';
import theme from './theme';
import AlertProvider from './components/AlertProvider';

// Import the generated route tree
import {routeTree} from './routeTree.gen'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<CssVarsProvider theme={theme}>
				<CssBaseline />
				<AlertProvider>
					<RouterProvider router={router}>
						<ReactQueryDevtools initialIsOpen={false} />
						<TanStackRouterDevtools router={router} />
					</RouterProvider>
				</AlertProvider>
			</CssVarsProvider>
		</QueryClientProvider>
	</StrictMode>,
)
