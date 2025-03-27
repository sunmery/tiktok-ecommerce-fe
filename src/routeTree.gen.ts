/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import {createFileRoute} from '@tanstack/react-router'

// Import Routes
import {Route as rootRoute} from './routes/__root'
import {Route as ProductsIndexImport} from './routes/products/index'
import {Route as MerchantInventoryIndexImport} from './routes/merchant/inventory/index'
import {Route as MerchantInventoryMonitoringIndexImport} from './routes/merchant/inventory/monitoring/index'
import {Route as MerchantInventoryAlertsIndexImport} from './routes/merchant/inventory/alerts/index'

// Create Virtual Routes

const CategoriesLazyImport = createFileRoute('/categories')()
const IndexLazyImport = createFileRoute('/')()
const ProfileIndexLazyImport = createFileRoute('/profile/')()
const MerchantIndexLazyImport = createFileRoute('/merchant/')()
const LogoutIndexLazyImport = createFileRoute('/logout/')()
const LoginIndexLazyImport = createFileRoute('/login/')()
const CreditcardsIndexLazyImport = createFileRoute('/credit_cards/')()
const ConsumerIndexLazyImport = createFileRoute('/consumer/')()
const CheckoutIndexLazyImport = createFileRoute('/checkout/')()
const CartsIndexLazyImport = createFileRoute('/carts/')()
const CardsIndexLazyImport = createFileRoute('/cards/')()
const CallbackIndexLazyImport = createFileRoute('/callback/')()
const AdminIndexLazyImport = createFileRoute('/admin/')()
const AddressesIndexLazyImport = createFileRoute('/addresses/')()
const ProductsProductIdLazyImport = createFileRoute('/products/$productId')()
const MerchantProductsIndexLazyImport = createFileRoute('/merchant/products/')()
const MerchantOrdersIndexLazyImport = createFileRoute('/merchant/orders/')()
const MerchantAnalyticsIndexLazyImport = createFileRoute(
    '/merchant/analytics/',
)()
const ConsumerOrdersIndexLazyImport = createFileRoute('/consumer/orders/')()
const AdminUsersIndexLazyImport = createFileRoute('/admin/users/')()
const AdminProductsIndexLazyImport = createFileRoute('/admin/products/')()
const AdminEcommerceMapIndexLazyImport = createFileRoute(
    '/admin/ecommerce-map/',
)()
const AdminDatabaseIndexLazyImport = createFileRoute('/admin/database/')()
const AdminAnalyticsIndexLazyImport = createFileRoute('/admin/analytics/')()
const ProductsCategoryCategoryNameLazyImport = createFileRoute(
    '/products/category/$categoryName',
)()
const ConsumerOrdersOrderIdLazyImport = createFileRoute(
    '/consumer/orders/$orderId',
)()

// Create/Update Routes

const CategoriesLazyRoute = CategoriesLazyImport.update({
    id: '/categories',
    path: '/categories',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/categories.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ProfileIndexLazyRoute = ProfileIndexLazyImport.update({
    id: '/profile/',
    path: '/profile/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/profile/index.lazy').then((d) => d.Route))

const MerchantIndexLazyRoute = MerchantIndexLazyImport.update({
    id: '/merchant/',
    path: '/merchant/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/merchant/index.lazy').then((d) => d.Route),
)

const LogoutIndexLazyRoute = LogoutIndexLazyImport.update({
    id: '/logout/',
    path: '/logout/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/logout/index.lazy').then((d) => d.Route))

const LoginIndexLazyRoute = LoginIndexLazyImport.update({
    id: '/login/',
    path: '/login/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login/index.lazy').then((d) => d.Route))

const CreditcardsIndexLazyRoute = CreditcardsIndexLazyImport.update({
    id: '/credit_cards/',
    path: '/credit_cards/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/credit_cards/index.lazy').then((d) => d.Route),
)

const ConsumerIndexLazyRoute = ConsumerIndexLazyImport.update({
    id: '/consumer/',
    path: '/consumer/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/consumer/index.lazy').then((d) => d.Route),
)

const CheckoutIndexLazyRoute = CheckoutIndexLazyImport.update({
    id: '/checkout/',
    path: '/checkout/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/checkout/index.lazy').then((d) => d.Route),
)

const CartsIndexLazyRoute = CartsIndexLazyImport.update({
    id: '/carts/',
    path: '/carts/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/carts/index.lazy').then((d) => d.Route))

const CardsIndexLazyRoute = CardsIndexLazyImport.update({
    id: '/cards/',
    path: '/cards/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/cards/index.lazy').then((d) => d.Route))

const CallbackIndexLazyRoute = CallbackIndexLazyImport.update({
    id: '/callback/',
    path: '/callback/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/callback/index.lazy').then((d) => d.Route),
)

const AdminIndexLazyRoute = AdminIndexLazyImport.update({
    id: '/admin/',
    path: '/admin/',
    getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/admin/index.lazy').then((d) => d.Route))

const AddressesIndexLazyRoute = AddressesIndexLazyImport.update({
    id: '/addresses/',
    path: '/addresses/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/addresses/index.lazy').then((d) => d.Route),
)

const ProductsIndexRoute = ProductsIndexImport.update({
    id: '/products/',
    path: '/products/',
    getParentRoute: () => rootRoute,
} as any)

const ProductsProductIdLazyRoute = ProductsProductIdLazyImport.update({
    id: '/products/$productId',
    path: '/products/$productId',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/products/$productId.lazy').then((d) => d.Route),
)

const MerchantProductsIndexLazyRoute = MerchantProductsIndexLazyImport.update({
    id: '/merchant/products/',
    path: '/merchant/products/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/merchant/products/index.lazy').then((d) => d.Route),
)

const MerchantOrdersIndexLazyRoute = MerchantOrdersIndexLazyImport.update({
    id: '/merchant/orders/',
    path: '/merchant/orders/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/merchant/orders/index.lazy').then((d) => d.Route),
)

const MerchantAnalyticsIndexLazyRoute = MerchantAnalyticsIndexLazyImport.update(
    {
        id: '/merchant/analytics/',
        path: '/merchant/analytics/',
        getParentRoute: () => rootRoute,
    } as any,
).lazy(() =>
    import('./routes/merchant/analytics/index.lazy').then((d) => d.Route),
)

const ConsumerOrdersIndexLazyRoute = ConsumerOrdersIndexLazyImport.update({
    id: '/consumer/orders/',
    path: '/consumer/orders/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/consumer/orders/index.lazy').then((d) => d.Route),
)

const AdminUsersIndexLazyRoute = AdminUsersIndexLazyImport.update({
    id: '/admin/users/',
    path: '/admin/users/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/admin/users/index.lazy').then((d) => d.Route),
)

const AdminProductsIndexLazyRoute = AdminProductsIndexLazyImport.update({
    id: '/admin/products/',
    path: '/admin/products/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/admin/products/index.lazy').then((d) => d.Route),
)

const AdminEcommerceMapIndexLazyRoute = AdminEcommerceMapIndexLazyImport.update(
    {
        id: '/admin/ecommerce-map/',
        path: '/admin/ecommerce-map/',
        getParentRoute: () => rootRoute,
    } as any,
).lazy(() =>
    import('./routes/admin/ecommerce-map/index.lazy').then((d) => d.Route),
)

const AdminDatabaseIndexLazyRoute = AdminDatabaseIndexLazyImport.update({
    id: '/admin/database/',
    path: '/admin/database/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/admin/database/index.lazy').then((d) => d.Route),
)

const AdminAnalyticsIndexLazyRoute = AdminAnalyticsIndexLazyImport.update({
    id: '/admin/analytics/',
    path: '/admin/analytics/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/admin/analytics/index.lazy').then((d) => d.Route),
)

const MerchantInventoryIndexRoute = MerchantInventoryIndexImport.update({
    id: '/merchant/inventory/',
    path: '/merchant/inventory/',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/merchant/inventory/index.lazy').then((d) => d.Route),
)

const ProductsCategoryCategoryNameLazyRoute =
    ProductsCategoryCategoryNameLazyImport.update({
        id: '/products/category/$categoryName',
        path: '/products/category/$categoryName',
        getParentRoute: () => rootRoute,
    } as any).lazy(() =>
        import('./routes/products/category/$categoryName.lazy').then(
            (d) => d.Route,
        ),
    )

const ConsumerOrdersOrderIdLazyRoute = ConsumerOrdersOrderIdLazyImport.update({
    id: '/consumer/orders/$orderId',
    path: '/consumer/orders/$orderId',
    getParentRoute: () => rootRoute,
} as any).lazy(() =>
    import('./routes/consumer/orders/$orderId.lazy').then((d) => d.Route),
)

const MerchantInventoryMonitoringIndexRoute =
    MerchantInventoryMonitoringIndexImport.update({
        id: '/merchant/inventory/monitoring/',
        path: '/merchant/inventory/monitoring/',
        getParentRoute: () => rootRoute,
    } as any).lazy(() =>
        import('./routes/merchant/inventory/monitoring/index.lazy').then(
            (d) => d.Route,
        ),
    )

const MerchantInventoryAlertsIndexRoute =
    MerchantInventoryAlertsIndexImport.update({
        id: '/merchant/inventory/alerts/',
        path: '/merchant/inventory/alerts/',
        getParentRoute: () => rootRoute,
    } as any).lazy(() =>
        import('./routes/merchant/inventory/alerts/index.lazy').then(
            (d) => d.Route,
        ),
    )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
    interface FileRoutesByPath {
        '/': {
            id: '/'
            path: '/'
            fullPath: '/'
            preLoaderRoute: typeof IndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/categories': {
            id: '/categories'
            path: '/categories'
            fullPath: '/categories'
            preLoaderRoute: typeof CategoriesLazyImport
            parentRoute: typeof rootRoute
        }
        '/products/$productId': {
            id: '/products/$productId'
            path: '/products/$productId'
            fullPath: '/products/$productId'
            preLoaderRoute: typeof ProductsProductIdLazyImport
            parentRoute: typeof rootRoute
        }
        '/products/': {
            id: '/products/'
            path: '/products'
            fullPath: '/products'
            preLoaderRoute: typeof ProductsIndexImport
            parentRoute: typeof rootRoute
        }
        '/addresses/': {
            id: '/addresses/'
            path: '/addresses'
            fullPath: '/addresses'
            preLoaderRoute: typeof AddressesIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/admin/': {
            id: '/admin/'
            path: '/admin'
            fullPath: '/admin'
            preLoaderRoute: typeof AdminIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/callback/': {
            id: '/callback/'
            path: '/callback'
            fullPath: '/callback'
            preLoaderRoute: typeof CallbackIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/cards/': {
            id: '/cards/'
            path: '/cards'
            fullPath: '/cards'
            preLoaderRoute: typeof CardsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/carts/': {
            id: '/carts/'
            path: '/carts'
            fullPath: '/carts'
            preLoaderRoute: typeof CartsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/checkout/': {
            id: '/checkout/'
            path: '/checkout'
            fullPath: '/checkout'
            preLoaderRoute: typeof CheckoutIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/consumer/': {
            id: '/consumer/'
            path: '/consumer'
            fullPath: '/consumer'
            preLoaderRoute: typeof ConsumerIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/credit_cards/': {
            id: '/credit_cards/'
            path: '/credit_cards'
            fullPath: '/credit_cards'
            preLoaderRoute: typeof CreditcardsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/login/': {
            id: '/login/'
            path: '/login'
            fullPath: '/login'
            preLoaderRoute: typeof LoginIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/logout/': {
            id: '/logout/'
            path: '/logout'
            fullPath: '/logout'
            preLoaderRoute: typeof LogoutIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/': {
            id: '/merchant/'
            path: '/merchant'
            fullPath: '/merchant'
            preLoaderRoute: typeof MerchantIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/profile/': {
            id: '/profile/'
            path: '/profile'
            fullPath: '/profile'
            preLoaderRoute: typeof ProfileIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/consumer/orders/$orderId': {
            id: '/consumer/orders/$orderId'
            path: '/consumer/orders/$orderId'
            fullPath: '/consumer/orders/$orderId'
            preLoaderRoute: typeof ConsumerOrdersOrderIdLazyImport
            parentRoute: typeof rootRoute
        }
        '/products/category/$categoryName': {
            id: '/products/category/$categoryName'
            path: '/products/category/$categoryName'
            fullPath: '/products/category/$categoryName'
            preLoaderRoute: typeof ProductsCategoryCategoryNameLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/inventory/': {
            id: '/merchant/inventory/'
            path: '/merchant/inventory'
            fullPath: '/merchant/inventory'
            preLoaderRoute: typeof MerchantInventoryIndexImport
            parentRoute: typeof rootRoute
        }
        '/admin/analytics/': {
            id: '/admin/analytics/'
            path: '/admin/analytics'
            fullPath: '/admin/analytics'
            preLoaderRoute: typeof AdminAnalyticsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/admin/database/': {
            id: '/admin/database/'
            path: '/admin/database'
            fullPath: '/admin/database'
            preLoaderRoute: typeof AdminDatabaseIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/admin/ecommerce-map/': {
            id: '/admin/ecommerce-map/'
            path: '/admin/ecommerce-map'
            fullPath: '/admin/ecommerce-map'
            preLoaderRoute: typeof AdminEcommerceMapIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/admin/products/': {
            id: '/admin/products/'
            path: '/admin/products'
            fullPath: '/admin/products'
            preLoaderRoute: typeof AdminProductsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/admin/users/': {
            id: '/admin/users/'
            path: '/admin/users'
            fullPath: '/admin/users'
            preLoaderRoute: typeof AdminUsersIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/consumer/orders/': {
            id: '/consumer/orders/'
            path: '/consumer/orders'
            fullPath: '/consumer/orders'
            preLoaderRoute: typeof ConsumerOrdersIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/analytics/': {
            id: '/merchant/analytics/'
            path: '/merchant/analytics'
            fullPath: '/merchant/analytics'
            preLoaderRoute: typeof MerchantAnalyticsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/orders/': {
            id: '/merchant/orders/'
            path: '/merchant/orders'
            fullPath: '/merchant/orders'
            preLoaderRoute: typeof MerchantOrdersIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/products/': {
            id: '/merchant/products/'
            path: '/merchant/products'
            fullPath: '/merchant/products'
            preLoaderRoute: typeof MerchantProductsIndexLazyImport
            parentRoute: typeof rootRoute
        }
        '/merchant/inventory/alerts/': {
            id: '/merchant/inventory/alerts/'
            path: '/merchant/inventory/alerts'
            fullPath: '/merchant/inventory/alerts'
            preLoaderRoute: typeof MerchantInventoryAlertsIndexImport
            parentRoute: typeof rootRoute
        }
        '/merchant/inventory/monitoring/': {
            id: '/merchant/inventory/monitoring/'
            path: '/merchant/inventory/monitoring'
            fullPath: '/merchant/inventory/monitoring'
            preLoaderRoute: typeof MerchantInventoryMonitoringIndexImport
            parentRoute: typeof rootRoute
        }
    }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
    '/': typeof IndexLazyRoute
    '/categories': typeof CategoriesLazyRoute
    '/products/$productId': typeof ProductsProductIdLazyRoute
    '/products': typeof ProductsIndexRoute
    '/addresses': typeof AddressesIndexLazyRoute
    '/admin': typeof AdminIndexLazyRoute
    '/callback': typeof CallbackIndexLazyRoute
    '/cards': typeof CardsIndexLazyRoute
    '/carts': typeof CartsIndexLazyRoute
    '/checkout': typeof CheckoutIndexLazyRoute
    '/consumer': typeof ConsumerIndexLazyRoute
    '/credit_cards': typeof CreditcardsIndexLazyRoute
    '/login': typeof LoginIndexLazyRoute
    '/logout': typeof LogoutIndexLazyRoute
    '/merchant': typeof MerchantIndexLazyRoute
    '/profile': typeof ProfileIndexLazyRoute
    '/consumer/orders/$orderId': typeof ConsumerOrdersOrderIdLazyRoute
    '/products/category/$categoryName': typeof ProductsCategoryCategoryNameLazyRoute
    '/merchant/inventory': typeof MerchantInventoryIndexRoute
    '/admin/analytics': typeof AdminAnalyticsIndexLazyRoute
    '/admin/database': typeof AdminDatabaseIndexLazyRoute
    '/admin/ecommerce-map': typeof AdminEcommerceMapIndexLazyRoute
    '/admin/products': typeof AdminProductsIndexLazyRoute
    '/admin/users': typeof AdminUsersIndexLazyRoute
    '/consumer/orders': typeof ConsumerOrdersIndexLazyRoute
    '/merchant/analytics': typeof MerchantAnalyticsIndexLazyRoute
    '/merchant/orders': typeof MerchantOrdersIndexLazyRoute
    '/merchant/products': typeof MerchantProductsIndexLazyRoute
    '/merchant/inventory/alerts': typeof MerchantInventoryAlertsIndexRoute
    '/merchant/inventory/monitoring': typeof MerchantInventoryMonitoringIndexRoute
}

export interface FileRoutesByTo {
    '/': typeof IndexLazyRoute
    '/categories': typeof CategoriesLazyRoute
    '/products/$productId': typeof ProductsProductIdLazyRoute
    '/products': typeof ProductsIndexRoute
    '/addresses': typeof AddressesIndexLazyRoute
    '/admin': typeof AdminIndexLazyRoute
    '/callback': typeof CallbackIndexLazyRoute
    '/cards': typeof CardsIndexLazyRoute
    '/carts': typeof CartsIndexLazyRoute
    '/checkout': typeof CheckoutIndexLazyRoute
    '/consumer': typeof ConsumerIndexLazyRoute
    '/credit_cards': typeof CreditcardsIndexLazyRoute
    '/login': typeof LoginIndexLazyRoute
    '/logout': typeof LogoutIndexLazyRoute
    '/merchant': typeof MerchantIndexLazyRoute
    '/profile': typeof ProfileIndexLazyRoute
    '/consumer/orders/$orderId': typeof ConsumerOrdersOrderIdLazyRoute
    '/products/category/$categoryName': typeof ProductsCategoryCategoryNameLazyRoute
    '/merchant/inventory': typeof MerchantInventoryIndexRoute
    '/admin/analytics': typeof AdminAnalyticsIndexLazyRoute
    '/admin/database': typeof AdminDatabaseIndexLazyRoute
    '/admin/ecommerce-map': typeof AdminEcommerceMapIndexLazyRoute
    '/admin/products': typeof AdminProductsIndexLazyRoute
    '/admin/users': typeof AdminUsersIndexLazyRoute
    '/consumer/orders': typeof ConsumerOrdersIndexLazyRoute
    '/merchant/analytics': typeof MerchantAnalyticsIndexLazyRoute
    '/merchant/orders': typeof MerchantOrdersIndexLazyRoute
    '/merchant/products': typeof MerchantProductsIndexLazyRoute
    '/merchant/inventory/alerts': typeof MerchantInventoryAlertsIndexRoute
    '/merchant/inventory/monitoring': typeof MerchantInventoryMonitoringIndexRoute
}

export interface FileRoutesById {
    __root__: typeof rootRoute
    '/': typeof IndexLazyRoute
    '/categories': typeof CategoriesLazyRoute
    '/products/$productId': typeof ProductsProductIdLazyRoute
    '/products/': typeof ProductsIndexRoute
    '/addresses/': typeof AddressesIndexLazyRoute
    '/admin/': typeof AdminIndexLazyRoute
    '/callback/': typeof CallbackIndexLazyRoute
    '/cards/': typeof CardsIndexLazyRoute
    '/carts/': typeof CartsIndexLazyRoute
    '/checkout/': typeof CheckoutIndexLazyRoute
    '/consumer/': typeof ConsumerIndexLazyRoute
    '/credit_cards/': typeof CreditcardsIndexLazyRoute
    '/login/': typeof LoginIndexLazyRoute
    '/logout/': typeof LogoutIndexLazyRoute
    '/merchant/': typeof MerchantIndexLazyRoute
    '/profile/': typeof ProfileIndexLazyRoute
    '/consumer/orders/$orderId': typeof ConsumerOrdersOrderIdLazyRoute
    '/products/category/$categoryName': typeof ProductsCategoryCategoryNameLazyRoute
    '/merchant/inventory/': typeof MerchantInventoryIndexRoute
    '/admin/analytics/': typeof AdminAnalyticsIndexLazyRoute
    '/admin/database/': typeof AdminDatabaseIndexLazyRoute
    '/admin/ecommerce-map/': typeof AdminEcommerceMapIndexLazyRoute
    '/admin/products/': typeof AdminProductsIndexLazyRoute
    '/admin/users/': typeof AdminUsersIndexLazyRoute
    '/consumer/orders/': typeof ConsumerOrdersIndexLazyRoute
    '/merchant/analytics/': typeof MerchantAnalyticsIndexLazyRoute
    '/merchant/orders/': typeof MerchantOrdersIndexLazyRoute
    '/merchant/products/': typeof MerchantProductsIndexLazyRoute
    '/merchant/inventory/alerts/': typeof MerchantInventoryAlertsIndexRoute
    '/merchant/inventory/monitoring/': typeof MerchantInventoryMonitoringIndexRoute
}

export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath
    fullPaths:
        | '/'
        | '/categories'
        | '/products/$productId'
        | '/products'
        | '/addresses'
        | '/admin'
        | '/callback'
        | '/cards'
        | '/carts'
        | '/checkout'
        | '/consumer'
        | '/credit_cards'
        | '/login'
        | '/logout'
        | '/merchant'
        | '/profile'
        | '/consumer/orders/$orderId'
        | '/products/category/$categoryName'
        | '/merchant/inventory'
        | '/admin/analytics'
        | '/admin/database'
        | '/admin/ecommerce-map'
        | '/admin/products'
        | '/admin/users'
        | '/consumer/orders'
        | '/merchant/analytics'
        | '/merchant/orders'
        | '/merchant/products'
        | '/merchant/inventory/alerts'
        | '/merchant/inventory/monitoring'
    fileRoutesByTo: FileRoutesByTo
    to:
        | '/'
        | '/categories'
        | '/products/$productId'
        | '/products'
        | '/addresses'
        | '/admin'
        | '/callback'
        | '/cards'
        | '/carts'
        | '/checkout'
        | '/consumer'
        | '/credit_cards'
        | '/login'
        | '/logout'
        | '/merchant'
        | '/profile'
        | '/consumer/orders/$orderId'
        | '/products/category/$categoryName'
        | '/merchant/inventory'
        | '/admin/analytics'
        | '/admin/database'
        | '/admin/ecommerce-map'
        | '/admin/products'
        | '/admin/users'
        | '/consumer/orders'
        | '/merchant/analytics'
        | '/merchant/orders'
        | '/merchant/products'
        | '/merchant/inventory/alerts'
        | '/merchant/inventory/monitoring'
    id:
        | '__root__'
        | '/'
        | '/categories'
        | '/products/$productId'
        | '/products/'
        | '/addresses/'
        | '/admin/'
        | '/callback/'
        | '/cards/'
        | '/carts/'
        | '/checkout/'
        | '/consumer/'
        | '/credit_cards/'
        | '/login/'
        | '/logout/'
        | '/merchant/'
        | '/profile/'
        | '/consumer/orders/$orderId'
        | '/products/category/$categoryName'
        | '/merchant/inventory/'
        | '/admin/analytics/'
        | '/admin/database/'
        | '/admin/ecommerce-map/'
        | '/admin/products/'
        | '/admin/users/'
        | '/consumer/orders/'
        | '/merchant/analytics/'
        | '/merchant/orders/'
        | '/merchant/products/'
        | '/merchant/inventory/alerts/'
        | '/merchant/inventory/monitoring/'
    fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
    IndexLazyRoute: typeof IndexLazyRoute
    CategoriesLazyRoute: typeof CategoriesLazyRoute
    ProductsProductIdLazyRoute: typeof ProductsProductIdLazyRoute
    ProductsIndexRoute: typeof ProductsIndexRoute
    AddressesIndexLazyRoute: typeof AddressesIndexLazyRoute
    AdminIndexLazyRoute: typeof AdminIndexLazyRoute
    CallbackIndexLazyRoute: typeof CallbackIndexLazyRoute
    CardsIndexLazyRoute: typeof CardsIndexLazyRoute
    CartsIndexLazyRoute: typeof CartsIndexLazyRoute
    CheckoutIndexLazyRoute: typeof CheckoutIndexLazyRoute
    ConsumerIndexLazyRoute: typeof ConsumerIndexLazyRoute
    CreditcardsIndexLazyRoute: typeof CreditcardsIndexLazyRoute
    LoginIndexLazyRoute: typeof LoginIndexLazyRoute
    LogoutIndexLazyRoute: typeof LogoutIndexLazyRoute
    MerchantIndexLazyRoute: typeof MerchantIndexLazyRoute
    ProfileIndexLazyRoute: typeof ProfileIndexLazyRoute
    ConsumerOrdersOrderIdLazyRoute: typeof ConsumerOrdersOrderIdLazyRoute
    ProductsCategoryCategoryNameLazyRoute: typeof ProductsCategoryCategoryNameLazyRoute
    MerchantInventoryIndexRoute: typeof MerchantInventoryIndexRoute
    AdminAnalyticsIndexLazyRoute: typeof AdminAnalyticsIndexLazyRoute
    AdminDatabaseIndexLazyRoute: typeof AdminDatabaseIndexLazyRoute
    AdminEcommerceMapIndexLazyRoute: typeof AdminEcommerceMapIndexLazyRoute
    AdminProductsIndexLazyRoute: typeof AdminProductsIndexLazyRoute
    AdminUsersIndexLazyRoute: typeof AdminUsersIndexLazyRoute
    ConsumerOrdersIndexLazyRoute: typeof ConsumerOrdersIndexLazyRoute
    MerchantAnalyticsIndexLazyRoute: typeof MerchantAnalyticsIndexLazyRoute
    MerchantOrdersIndexLazyRoute: typeof MerchantOrdersIndexLazyRoute
    MerchantProductsIndexLazyRoute: typeof MerchantProductsIndexLazyRoute
    MerchantInventoryAlertsIndexRoute: typeof MerchantInventoryAlertsIndexRoute
    MerchantInventoryMonitoringIndexRoute: typeof MerchantInventoryMonitoringIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
    IndexLazyRoute: IndexLazyRoute,
    CategoriesLazyRoute: CategoriesLazyRoute,
    ProductsProductIdLazyRoute: ProductsProductIdLazyRoute,
    ProductsIndexRoute: ProductsIndexRoute,
    AddressesIndexLazyRoute: AddressesIndexLazyRoute,
    AdminIndexLazyRoute: AdminIndexLazyRoute,
    CallbackIndexLazyRoute: CallbackIndexLazyRoute,
    CardsIndexLazyRoute: CardsIndexLazyRoute,
    CartsIndexLazyRoute: CartsIndexLazyRoute,
    CheckoutIndexLazyRoute: CheckoutIndexLazyRoute,
    ConsumerIndexLazyRoute: ConsumerIndexLazyRoute,
    CreditcardsIndexLazyRoute: CreditcardsIndexLazyRoute,
    LoginIndexLazyRoute: LoginIndexLazyRoute,
    LogoutIndexLazyRoute: LogoutIndexLazyRoute,
    MerchantIndexLazyRoute: MerchantIndexLazyRoute,
    ProfileIndexLazyRoute: ProfileIndexLazyRoute,
    ConsumerOrdersOrderIdLazyRoute: ConsumerOrdersOrderIdLazyRoute,
    ProductsCategoryCategoryNameLazyRoute: ProductsCategoryCategoryNameLazyRoute,
    MerchantInventoryIndexRoute: MerchantInventoryIndexRoute,
    AdminAnalyticsIndexLazyRoute: AdminAnalyticsIndexLazyRoute,
    AdminDatabaseIndexLazyRoute: AdminDatabaseIndexLazyRoute,
    AdminEcommerceMapIndexLazyRoute: AdminEcommerceMapIndexLazyRoute,
    AdminProductsIndexLazyRoute: AdminProductsIndexLazyRoute,
    AdminUsersIndexLazyRoute: AdminUsersIndexLazyRoute,
    ConsumerOrdersIndexLazyRoute: ConsumerOrdersIndexLazyRoute,
    MerchantAnalyticsIndexLazyRoute: MerchantAnalyticsIndexLazyRoute,
    MerchantOrdersIndexLazyRoute: MerchantOrdersIndexLazyRoute,
    MerchantProductsIndexLazyRoute: MerchantProductsIndexLazyRoute,
    MerchantInventoryAlertsIndexRoute: MerchantInventoryAlertsIndexRoute,
    MerchantInventoryMonitoringIndexRoute: MerchantInventoryMonitoringIndexRoute,
}

export const routeTree = rootRoute
    ._addFileChildren(rootRouteChildren)
    ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/categories",
        "/products/$productId",
        "/products/",
        "/addresses/",
        "/admin/",
        "/callback/",
        "/cards/",
        "/carts/",
        "/checkout/",
        "/consumer/",
        "/credit_cards/",
        "/login/",
        "/logout/",
        "/merchant/",
        "/profile/",
        "/consumer/orders/$orderId",
        "/products/category/$categoryName",
        "/merchant/inventory/",
        "/admin/analytics/",
        "/admin/database/",
        "/admin/ecommerce-map/",
        "/admin/products/",
        "/admin/users/",
        "/consumer/orders/",
        "/merchant/analytics/",
        "/merchant/orders/",
        "/merchant/products/",
        "/merchant/inventory/alerts/",
        "/merchant/inventory/monitoring/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/categories": {
      "filePath": "categories.lazy.tsx"
    },
    "/products/$productId": {
      "filePath": "products/$productId.lazy.tsx"
    },
    "/products/": {
      "filePath": "products/index.tsx"
    },
    "/addresses/": {
      "filePath": "addresses/index.lazy.tsx"
    },
    "/admin/": {
      "filePath": "admin/index.lazy.tsx"
    },
    "/callback/": {
      "filePath": "callback/index.lazy.tsx"
    },
    "/cards/": {
      "filePath": "cards/index.lazy.tsx"
    },
    "/carts/": {
      "filePath": "carts/index.lazy.tsx"
    },
    "/checkout/": {
      "filePath": "checkout/index.lazy.tsx"
    },
    "/consumer/": {
      "filePath": "consumer/index.lazy.tsx"
    },
    "/credit_cards/": {
      "filePath": "credit_cards/index.lazy.tsx"
    },
    "/login/": {
      "filePath": "login/index.lazy.tsx"
    },
    "/logout/": {
      "filePath": "logout/index.lazy.tsx"
    },
    "/merchant/": {
      "filePath": "merchant/index.lazy.tsx"
    },
    "/profile/": {
      "filePath": "profile/index.lazy.tsx"
    },
    "/consumer/orders/$orderId": {
      "filePath": "consumer/orders/$orderId.lazy.tsx"
    },
    "/products/category/$categoryName": {
      "filePath": "products/category/$categoryName.lazy.tsx"
    },
    "/merchant/inventory/": {
      "filePath": "merchant/inventory/index.tsx"
    },
    "/admin/analytics/": {
      "filePath": "admin/analytics/index.lazy.tsx"
    },
    "/admin/database/": {
      "filePath": "admin/database/index.lazy.tsx"
    },
    "/admin/ecommerce-map/": {
      "filePath": "admin/ecommerce-map/index.lazy.tsx"
    },
    "/admin/products/": {
      "filePath": "admin/products/index.lazy.tsx"
    },
    "/admin/users/": {
      "filePath": "admin/users/index.lazy.tsx"
    },
    "/consumer/orders/": {
      "filePath": "consumer/orders/index.lazy.tsx"
    },
    "/merchant/analytics/": {
      "filePath": "merchant/analytics/index.lazy.tsx"
    },
    "/merchant/orders/": {
      "filePath": "merchant/orders/index.lazy.tsx"
    },
    "/merchant/products/": {
      "filePath": "merchant/products/index.lazy.tsx"
    },
    "/merchant/inventory/alerts/": {
      "filePath": "merchant/inventory/alerts/index.tsx"
    },
    "/merchant/inventory/monitoring/": {
      "filePath": "merchant/inventory/monitoring/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
