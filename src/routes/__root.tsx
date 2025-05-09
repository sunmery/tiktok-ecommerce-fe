import { createRootRoute, Outlet } from '@tanstack/react-router';

import I18nRouteWrapper from "@/core/providers/I18nProvider/I18nRouteWrapper";
import Template from '@/shared/components/layouts/Template';
import RouteGuard from '@/shared/components/RouteGuard';
import { Suspense } from 'react';
import { CircularProgress } from '@mui/joy';

export const Route = createRootRoute({
    errorComponent: ({error}) => {
        return (
            <div>
                <h1>Something went wrong!</h1>
                <pre>{error instanceof Error ? error.message : JSON.stringify(error)}</pre>
            </div>
        );
    },
    component: () => (
        <Suspense fallback={<CircularProgress/>}>
            <I18nRouteWrapper>
                <Template>
                    {/*<RouteGuard />*/}
                    <Outlet/>
                </Template>
            </I18nRouteWrapper>
        </Suspense>
    )
});
