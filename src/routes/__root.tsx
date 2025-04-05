import {createRootRoute} from '@tanstack/react-router'
import Template from '@/components/Template'

import I18nRouteWrapper from "@/core/providers/I18nProvider/I18nRouteWrapper";

export const Route = createRootRoute({
    component: () => (
        <I18nRouteWrapper>
            <Template/>
        </I18nRouteWrapper>
    )
})
