import {createRootRoute} from '@tanstack/react-router'
import Template from '@/components/Template'

import I18nRouteWrapper from "@/core/providers/I18nProvider";

export const Route = createRootRoute({
    component: () => (
        <I18nRouteWrapper>
            <Template/>
        </I18nRouteWrapper>
    )
})
